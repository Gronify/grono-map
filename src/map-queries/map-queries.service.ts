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
import { OsmElement, OverpassApiResponse } from './dto/osm-marker.dto';
import { RunnableSequence } from '@langchain/core/runnables';
@Injectable()
export class MapQueriesService {
  private assistantChain;
  constructor(
    private readonly userService: UsersService,
    // Dependencies here
    private readonly mapQueryRepository: MapQueryRepository,
    private configService: ConfigService<AllConfigType>,
    private model: ChatGoogleGenerativeAI,
  ) {
    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `
        You are an assistant that converts natural language instructions into Overpass QL queries.
        Respond ONLY with a single-line Overpass QL query. No explanations, formatting, code blocks, or comments.

        Rules:
        - If the user query includes a radius, use it. Otherwise, use the fallback radius.
        - Interpret user intent broadly and map it to relevant Overpass tags.
          For example:
            - If user wants to buy food or drinks or etc, include "supermarket", "convenience", "kiosk" or etc
            - If user wants to relax or be in nature, include "park", "forest", "natural" or etc
        - Always include all element types: node, way, and relation.
        - Strictly follow this format:[out:json];(node["key"="value"](around:radius,lat,lon);way["key"="value"](around:radius,lat,lon);relation["key"="value"](around:radius,lat,lon););out;
        - No extra whitespace. No newlines. Return only the Overpass QL query.
        `,
      ],
      [
        'user',
        `
        Latitude: {latitude}
        Longitude: {longitude}
        Fallback radius: {radius} meters
        User query: {input}
        `,
      ],
    ]);

    this.assistantChain = RunnableSequence.from([prompt, this.model]);
  }

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
    const start = Date.now();
    let content = '';
    let status: 'success' | 'error' = 'success';

    try {
      const response = await this.assistantChain.invoke({
        input,
        latitude,
        longitude,
        radius,
      });

      if (typeof response === 'string') {
        content = response;
      } else if (typeof response.content === 'string') {
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
      llmResponse: content.trim(),
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
      data.elements = await this.enrichOverpassElements(data.elements);
      return data;
    } catch (error) {
      console.error('Overpass API request failed:', error);
      throw new Error('Failed to fetch data from Overpass API');
    }
  }

  async fetchOsmElement(
    type: 'node' | 'way' | 'relation',
    id: number,
  ): Promise<OsmElement> {
    const query = `[out:json];${type}(${id});out;`;
    const url =
      'https://overpass-api.de/api/interpreter?data=' +
      encodeURIComponent(query);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    const data: OverpassApiResponse = await response.json();
    const element = data.elements[0];

    return {
      type: element.type,
      id: element.id,
      longitude: element.lon,
      latitude: element.lat,
      tags: element.tags,
    };
  }

  private async enrichElementWithCoords(element: any): Promise<any> {
    if (element.type === 'node') {
      return element;
    }

    if (
      (element.type === 'way' || element.type === 'relation') &&
      Array.isArray(element.nodes) &&
      element.nodes.length > 0
    ) {
      const firstNodeId = element.nodes[0];
      try {
        const firstNode = await this.fetchOsmElement('node', firstNodeId);
        return {
          ...element,
          lat: firstNode.latitude,
          lon: firstNode.longitude,
        };
      } catch (error) {
        console.error('Failed to fetch first node coordinates:', error);
        return element;
      }
    }

    return element;
  }

  async enrichOverpassElements(elements: OsmElement[]): Promise<OsmElement[]> {
    const enriched: OsmElement[] = [];
    for (const element of elements) {
      enriched.push(await this.enrichElementWithCoords(element));
    }
    return enriched;
  }
}
