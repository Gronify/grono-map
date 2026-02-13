import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
  Logger,
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
import {
  OsmElement,
  OsmElementApi,
  OverpassApiMapResponse,
  OverpassApiNodeResponse,
  OverpassApiResponse,
} from './dto/osm-marker.dto';
import { RunnableSequence } from '@langchain/core/runnables';
import { OverpassQuery } from './dto/overpass-all-elements-query.dto';
@Injectable()
export class MapQueriesService {
  private readonly logger = new Logger(MapQueriesService.name);
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
    this.logger.debug('Assistant chain initialized (prompt + LLM)');
  }

  async create(createMapQueryDto: CreateMapQueryDto) {
    this.logger.debug(
      `create() called with inputText=${createMapQueryDto.inputText?.slice(0, 50)}..., lat=${createMapQueryDto.latitude}, lon=${createMapQueryDto.longitude}`,
    );
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

    const created = await this.mapQueryRepository.create({
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
    this.logger.debug(`create() completed, id=${created?.id}`);
    return created;
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
    this.logger.debug(`findById(${id})`);
    return this.mapQueryRepository.findById(id);
  }

  findByIds(ids: MapQuery['id'][]) {
    return this.mapQueryRepository.findByIds(ids);
  }

  async update(
    id: MapQuery['id'],

    updateMapQueryDto: UpdateMapQueryDto,
  ) {
    this.logger.debug(`update(${id}) called`);
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
    this.logger.debug(`remove(${id})`);
    return this.mapQueryRepository.remove(id);
  }

  async generateOverpassQuery(
    input: string,
    latitude: number,
    longitude: number,
    radius: number,
  ): Promise<LlmQueryResultDto> {
    this.logger.debug(
      `generateOverpassQuery input="${input?.slice(0, 80)}..." lat=${latitude} lon=${longitude} radius=${radius}`,
    );
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
      this.logger.debug(
        `generateOverpassQuery LLM response type=${typeof response}, content type=${typeof (response as any)?.content}`,
      );

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
        this.logger.warn(
          'generateOverpassQuery: unexpected response shape, setting status=error',
        );
      }
    } catch (error) {
      this.logger.error(
        'LLM query generation failed',
        error instanceof Error ? error.stack : String(error),
      );
      content = '';
      status = 'error';
    }

    const duration = Date.now() - start;
    const llmResponse = content.trim();
    this.logger.debug(
      `generateOverpassQuery completed in ${duration}ms status=${status} responseLength=${llmResponse.length}`,
    );
    if (llmResponse) {
      this.logger.debug(
        `generateOverpassQuery LLM generated Overpass query: ${llmResponse}`,
      );
    } else {
      this.logger.warn('generateOverpassQuery: LLM returned empty query');
    }

    return {
      llmResponse,
      llmModel: this.model.model,
      duration,
      status,
    };
  }

  async fetchOverpassData(
    overpassQuery: string,
  ): Promise<OverpassApiMapResponse> {
    const url =
      'https://overpass-api.de/api/interpreter?data=' +
      encodeURIComponent(overpassQuery);
    this.logger.debug(
      `fetchOverpassData sending Overpass query: ${overpassQuery}`,
    );
    this.logger.debug(
      `fetchOverpassData query length=${overpassQuery.length}, url length=${url.length}`,
    );
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });
      this.logger.debug(
        `fetchOverpassData response status=${response.status} ok=${response.ok}`,
      );

      if (!response.ok) {
        const hint =
          response.status === 504
            ? ' (504 = timeout: query may be too heavy or server busy; try smaller radius or simpler query)'
            : response.status === 400
              ? ' (400 = bad request: query syntax may be invalid)'
              : '';
        this.logger.warn(
          `fetchOverpassData Overpass API error ${response.status} ${response.statusText}${hint}. Query was: ${overpassQuery}`,
        );
        throw new Error(
          `Overpass API error: ${response.status} ${response.statusText}`,
        );
      }

      const data: OverpassApiResponse = await response.json();
      this.logger.debug(
        `fetchOverpassData raw elements count=${data.elements?.length ?? 0}`,
      );

      const enrichedElements = await this.enrichOverpassElementsBatch(
        data.elements,
      );
      this.logger.debug(
        `fetchOverpassData enriched elements count=${enrichedElements.length}`,
      );

      const responseData: OverpassApiMapResponse = {
        ...data,
        elements: enrichedElements,
      };
      return responseData;
    } catch (error) {
      this.logger.error(
        `Overpass API request failed. Query was: ${overpassQuery}. Error: ${error instanceof Error ? error.message : String(error)}`,
      );
      if (error instanceof Error && error.stack) {
        this.logger.debug(error.stack);
      }
      throw new Error('Failed to fetch data from Overpass API');
    }
  }

  async fetchOsmElement(
    type: 'node' | 'way' | 'relation',
    id: number,
  ): Promise<OsmElement> {
    this.logger.debug(`fetchOsmElement type=${type} id=${id}`);
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
    if (!response.ok) {
      this.logger.warn(
        `fetchOsmElement ${type}/${id} response not ok: ${response.status}`,
      );
    }
    const data: OverpassApiNodeResponse = await response.json();
    const element = data.elements[0];
    if (!element) {
      this.logger.warn(`fetchOsmElement ${type}/${id} no element in response`);
    }

    return {
      type: element.type,
      id: element.id,
      longitude: element.lon,
      latitude: element.lat,
      tags: element.tags,
    };
  }

  private async enrichElementWithCoords(
    element: OsmElementApi,
  ): Promise<OsmElement> {
    if (element.type === 'node') {
      return {
        ...element,
        latitude: element.lat,
        longitude: element.lon,
      };
    }

    if (
      element.type === 'way' &&
      Array.isArray(element.nodes) &&
      element.nodes.length > 0
    ) {
      const firstNodeId = element.nodes[0];
      try {
        const firstNode = await this.fetchOsmElement('node', firstNodeId);
        return {
          ...element,
          latitude: firstNode.latitude,
          longitude: firstNode.longitude,
        };
      } catch (error) {
        this.logger.error(
          `enrichElementWithCoords: failed to fetch node ${firstNodeId}`,
          error instanceof Error ? error.stack : String(error),
        );
        throw new Error('Failed to enrich element with coordinates');
      }
    }
    throw new Error('Failed to enrich element with coordinates');
  }

  async enrichOverpassElements(
    elements: OsmElementApi[],
  ): Promise<OsmElement[]> {
    const enriched: OsmElement[] = [];
    for (const element of elements) {
      enriched.push(await this.enrichElementWithCoords(element));
    }
    return enriched;
  }

  private chunkArray<T>(arr: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  }

  private async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async fetchManyNodes(
    nodeIds: number[],
  ): Promise<Record<number, { lat: number; lon: number }>> {
    if (nodeIds.length === 0) {
      this.logger.debug('fetchManyNodes: no node ids, skipping');
      return {};
    }
    const chunks = this.chunkArray(nodeIds, 250);
    this.logger.debug(
      `fetchManyNodes: ${nodeIds.length} unique nodes in ${chunks.length} chunk(s)`,
    );
    const coordsMap: Record<number, { lat: number; lon: number }> = {};

    for (let index = 0; index < chunks.length; index++) {
      const chunk = chunks[index];
      const idsString = chunk.join(',');
      const query = `[out:json];node(id:${idsString});out;`;
      const url =
        'https://overpass-api.de/api/interpreter?data=' +
        encodeURIComponent(query);

      // --- retry loop ---
      let attempt = 0;
      const maxRetries = 5;
      while (true) {
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

          const data: OverpassApiNodeResponse = await response.json();

          data.elements.forEach((el) => {
            coordsMap[el.id] = { lat: el.lat, lon: el.lon };
          });
          this.logger.debug(
            `fetchManyNodes chunk ${index + 1}/${chunks.length} got ${data.elements.length} nodes`,
          );
          break;
        } catch (error: any) {
          attempt++;
          if (attempt > maxRetries) {
            this.logger.error(
              `fetchManyNodes: failed after ${maxRetries} retries for chunk`,
              chunk?.slice(0, 5),
            );
            throw error;
          }
          const delay = 2000 * attempt;
          this.logger.warn(
            `fetchManyNodes chunk ${index + 1}/${chunks.length} attempt ${attempt}/${maxRetries} failed, retrying in ${delay}ms: ${error?.message ?? error}`,
          );
          await this.sleep(delay);
        }
      }
      await this.sleep(2000);
    }
    this.logger.debug(
      `fetchManyNodes: resolved ${Object.keys(coordsMap).length} coordinates`,
    );
    return coordsMap;
  }

  async fetchManyWays(
    wayIds: number[],
  ): Promise<Record<number, { id: number; nodes: number[] }>> {
    if (wayIds.length === 0) {
      this.logger.debug('fetchManyWays: no way ids, skipping');
      return {};
    }
    const chunks = this.chunkArray(wayIds, 250);
    this.logger.debug(
      `fetchManyWays: ${wayIds.length} ways in ${chunks.length} chunk(s)`,
    );
    const waysMap: Record<number, { id: number; nodes: number[] }> = {};

    for (let index = 0; index < chunks.length; index++) {
      const chunk = chunks[index];
      const idsString = chunk.join(',');

      const query = `[out:json];way(id:${idsString});out;`;
      const url =
        'https://overpass-api.de/api/interpreter?data=' +
        encodeURIComponent(query);

      let attempt = 0;
      const maxRetries = 5;

      // --- retry loop ---
      while (true) {
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

          data.elements.forEach((el: any) => {
            if (el.type === 'way' && Array.isArray(el.nodes)) {
              waysMap[el.id] = { id: el.id, nodes: el.nodes };
            }
          });
          this.logger.debug(
            `fetchManyWays chunk ${index + 1}/${chunks.length} got ${Object.keys(waysMap).length} ways`,
          );
          break;
        } catch (error: any) {
          attempt++;
          if (attempt > maxRetries) {
            this.logger.error(
              `fetchManyWays: failed after ${maxRetries} retries for chunk`,
              chunk?.slice(0, 5),
            );
            throw error;
          }
          const delay = 2000 * attempt;
          this.logger.warn(
            `fetchManyWays chunk ${index + 1}/${chunks.length} attempt ${attempt}/${maxRetries} failed, retrying in ${delay}ms: ${error?.message ?? error}`,
          );
          await this.sleep(delay);
        }
      }
      await this.sleep(2000);
    }
    this.logger.debug(
      `fetchManyWays: resolved ${Object.keys(waysMap).length} ways`,
    );
    return waysMap;
  }

  async enrichOverpassElementsBatch(
    elements: OsmElementApi[],
  ): Promise<OsmElement[]> {
    this.logger.debug(
      `enrichOverpassElementsBatch: ${elements.length} elements`,
    );
    const nodeIdsToFetch: number[] = [];
    const wayIdsToFetch: number[] = [];

    // 1. Collect the first node IDs from all ways,
    //    and the first way IDs from all relations.
    for (const element of elements) {
      if (
        element.type === 'way' &&
        Array.isArray(element.nodes) &&
        element.nodes.length > 0
      ) {
        nodeIdsToFetch.push(element.nodes[0]);
      }

      if (element.type === 'relation') {
        wayIdsToFetch.push(element.members[0].ref);
      }
    }

    // 2. Fetch ways data (to get their node lists),
    //    then collect the first node from each way.
    let waysMap: Record<number, { id: number; nodes: number[] }> = {};
    if (wayIdsToFetch.length > 0) {
      this.logger.debug(
        `enrichOverpassElementsBatch: fetching ${wayIdsToFetch.length} way ids for relations`,
      );
      waysMap = await this.fetchManyWays([...new Set(wayIdsToFetch)]);
      for (const wayId of Object.keys(waysMap).map(Number)) {
        const way = waysMap[wayId];
        if (way?.nodes?.length) {
          nodeIdsToFetch.push(way.nodes[0]);
        }
      }
    }

    // 3. Fetch coordinates for all collected node IDs in one batch.
    const uniqueNodeIds = [...new Set(nodeIdsToFetch)];
    this.logger.debug(
      `enrichOverpassElementsBatch: fetching ${uniqueNodeIds.length} unique node coords`,
    );
    const coordsMap = await this.fetchManyNodes(uniqueNodeIds);

    // 4. Enrich each element with coordinates.
    const result = elements.map((element) => {
      if (element.type === 'node') {
        return {
          ...element,
          latitude: element.lat,
          longitude: element.lon,
        };
      }

      if (element.type === 'way' && element.nodes?.length > 0) {
        const coords = coordsMap[element.nodes[0]];
        if (coords) {
          return {
            ...element,
            latitude: coords.lat,
            longitude: coords.lon,
          };
        }
      }

      if (element.type === 'relation') {
        const wayId = element.members[0].ref;
        if (wayId) {
          const way = waysMap[wayId];
          if (way?.nodes?.length) {
            const coords = coordsMap[way.nodes[0]];
            if (coords) {
              return {
                ...element,
                latitude: coords.lat,
                longitude: coords.lon,
              };
            }
          }
        }
      }
      this.logger.warn(
        'enrichOverpassElementsBatch: could not resolve coords for element',
        { type: element.type, id: element.id },
      );
      return {
        ...element,
        latitude: 0,
        longitude: 0,
      };
    });
    this.logger.debug(
      `enrichOverpassElementsBatch: enriched ${result.length} elements`,
    );
    return result;
  }

  generateOverpassAllElementsQuery(
    latitude: number,
    longitude: number,
    radius: number,
    // bbox: { latMin: number; lonMin: number; latMax: number; lonMax: number },
  ): OverpassQuery {
    this.logger.debug(
      `generateOverpassAllElementsQuery lat=${latitude} lon=${longitude} radius=${radius}`,
    );
    let status: 'success' | 'error' = 'success';
    let query = '';

    try {
      query = `[timeout:10][out:json];(
        node(around:${radius},${latitude},${longitude});
        way(around:${radius},${latitude},${longitude});
        relation(around:${radius},${latitude},${longitude});
      );
      out;
    `.trim();
      //   let queryBbox = `[timeout:10][out:json];
      //   (
      //     node(around:${radius},${latitude},${longitude});
      //     way(around:${radius},${latitude},${longitude});
      //   );
      //   out tags geom(${bbox.latMin},${bbox.lonMin},${bbox.latMax},${bbox.latMax});
      //   relation(around:${radius},${latitude},${longitude});
      //   out geom(${bbox.latMin},${bbox.lonMin},${bbox.latMax},${bbox.latMax});
      // `.trim();
    } catch (err) {
      this.logger.error(
        'generateOverpassAllElementsQuery error',
        err instanceof Error ? err.stack : String(err),
      );
      status = 'error';
    }
    this.logger.debug(
      `generateOverpassAllElementsQuery status=${status} query length=${query.length}`,
    );
    return {
      query,
      status,
    };
  }
}
