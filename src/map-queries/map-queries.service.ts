import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateMapQueryDto } from './dto/create-map-query.dto';
import { UpdateMapQueryDto } from './dto/update-map-query.dto';
import { MapQueryRepository } from './infrastructure/persistence/map-query.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { MapQuery } from './domain/map-query';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { LlmQueryResultDto } from './dto/llm-query-result.dto';
@Injectable()
export class MapQueriesService {
  constructor(
    private readonly userService: UsersService,
    // Dependencies here
    private readonly mapQueryRepository: MapQueryRepository,
    private configService: ConfigService<AllConfigType>,
    private model: ChatGoogleGenerativeAI,
  ) {}

  async create(createMapQueryDto: CreateMapQueryDto) {
    // Do not remove comment below.
    // <creating-property />

    let user: User | null | undefined = undefined;

    if (createMapQueryDto.user) {
      const userObject = await this.userService.findById(
        createMapQueryDto.user.id,
      );
      if (!userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            user: 'notExists',
          },
        });
      }
      user = userObject;
    } else if (createMapQueryDto.user === null) {
      user = null;
    }

    return this.mapQueryRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      longitude: createMapQueryDto.longitude,
      latitude: createMapQueryDto.latitude,
      inputText: createMapQueryDto.inputText,
      llmResponse: createMapQueryDto.llmResponse,
      llmModel: createMapQueryDto.llmModel,
      status: createMapQueryDto.status,
      duration: createMapQueryDto.duration,
      user,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.mapQueryRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: MapQuery['id']) {
    return this.mapQueryRepository.findById(id);
  }

  findByIds(ids: MapQuery['id'][]) {
    return this.mapQueryRepository.findByIds(ids);
  }

  async update(
    id: MapQuery['id'],

    updateMapQueryDto: UpdateMapQueryDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    let user: User | null | undefined = undefined;

    if (updateMapQueryDto.user) {
      const userObject = await this.userService.findById(
        updateMapQueryDto.user.id,
      );
      if (!userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            user: 'notExists',
          },
        });
      }
      user = userObject;
    } else if (updateMapQueryDto.user === null) {
      user = null;
    }

    return this.mapQueryRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      longitude: updateMapQueryDto.longitude,
      latitude: updateMapQueryDto.latitude,
      inputText: updateMapQueryDto.inputText,
      llmResponse: updateMapQueryDto.llmResponse,
      llmModel: updateMapQueryDto.llmModel,
      status: updateMapQueryDto.status,
      duration: updateMapQueryDto.duration,
      user,
    });
  }

  remove(id: MapQuery['id']) {
    return this.mapQueryRepository.remove(id);
  }

  async generateOverpassQuery(
    input: string,
    latitude: number,
    longitude: number,
    radius: number,
  ): Promise<LlmQueryResultDto> {
    const prompt = ChatPromptTemplate.fromTemplate(`
      You are an assistant that converts natural language instructions into Overpass QL queries. You must respond with a single-line Overpass QL query, without any formatting, code fences, or comments.

      Use the following fixed location:
      Latitude: {latitude}
      Longitude: {longitude}
      Radius: {radius} meters

      User query:
      {input}

      Respond ONLY with the Overpass QL query in this format:
      [out:json];node["key"="value"](around:radius,latitude,longitude);out;
      No newlines. No explanations. No formatting. No extra characters.
    `);

    const chain = prompt.pipe(this.model);

    const start = Date.now();
    let content: string = '';
    let status: 'success' | 'error' = 'success';

    try {
      const response = await chain.invoke({
        input,
        latitude,
        longitude,
        radius,
      });

      if (typeof response.content === 'string') {
        content = response.content;
      } else if (Array.isArray(response.content)) {
        content = response.content
          .filter(
            (item) =>
              typeof item === 'string' ||
              (item.type === 'text' && typeof (item as any).text === 'string'),
          )
          .map((item) => (typeof item === 'string' ? item : (item as any).text))
          .join(' ');
      } else {
        content = '';
        status = 'error';
      }
    } catch (error) {
      console.error('LLM query generation failed:', error);
      content = '';
      status = 'error';
    }

    const duration = Date.now() - start;

    return {
      llmResponse: content,
      llmModel: this.model.model,
      duration,
      status,
    };
  }

  async fetchOverpassData(overpassQuery: string): Promise<any> {
    const url =
      'https://overpass-api.de/api/interpreter?data=' +
      encodeURIComponent(overpassQuery);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(
          `Overpass API error: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Overpass API request failed:', error);
      throw new Error('Failed to fetch data from Overpass API');
    }
  }
}
