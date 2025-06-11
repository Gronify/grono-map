import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { MapQueriesService } from './map-queries.service';
import { CreateMapQueryDto } from './dto/create-map-query.dto';
import { UpdateMapQueryDto } from './dto/update-map-query.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { MapQuery } from './domain/map-query';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllMapQueriesDto } from './dto/find-all-map-queries.dto';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';
import { GenerateQueryDto } from './dto/generate-query.dto';
import { UserDto } from '../users/dto/user.dto';
import { LlmQueryResultDto } from './dto/llm-query-result.dto';

@ApiTags('Mapqueries')
@ApiBearerAuth()
@Roles(RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({
  path: 'map-queries',
  version: '1',
})
export class MapQueriesController {
  constructor(private readonly mapQueriesService: MapQueriesService) {}

  @Post()
  @ApiCreatedResponse({
    type: MapQuery,
  })
  create(@Body() createMapQueryDto: CreateMapQueryDto) {
    return this.mapQueriesService.create(createMapQueryDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(MapQuery),
  })
  async findAll(
    @Query() query: FindAllMapQueriesDto,
  ): Promise<InfinityPaginationResponseDto<MapQuery>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.mapQueriesService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: MapQuery,
  })
  findById(@Param('id') id: string) {
    return this.mapQueriesService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: MapQuery,
  })
  update(
    @Param('id') id: string,
    @Body() updateMapQueryDto: UpdateMapQueryDto,
  ) {
    return this.mapQueriesService.update(id, updateMapQueryDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.mapQueriesService.remove(id);
  }

  @Post('ai/generate-overpass-query')
  @ApiOkResponse({ description: 'Generated Overpass QL query', type: String })
  async generateOverpassQuery(
    @Body() body: GenerateQueryDto,
  ): Promise<LlmQueryResultDto> {
    return this.mapQueriesService.generateOverpassQuery(
      body.input,
      body.latitude,
      body.longitude,
      body.radius,
    );
  }

  @UseGuards()
  @Post('ai/generate-and-fetch-overpass-query')
  @ApiOkResponse({
    description: 'Generated Overpass QL query and fetch Overpass Data',
  })
  async generateAndFetch(
    @Body() body: GenerateQueryDto,
    @Request() request,
  ): Promise<any> {
    const { input, latitude, longitude, radius } = body;
    const user: UserDto = request.user;

    const overpassQuery = await this.mapQueriesService.generateOverpassQuery(
      input,
      latitude,
      longitude,
      radius,
    );
    const data = await this.mapQueriesService.fetchOverpassData(
      overpassQuery.llmResponse,
    );

    await this.mapQueriesService.create({
      inputText: input,
      latitude,
      longitude,
      radius,
      llmResponse: overpassQuery.llmResponse,
      llmModel: overpassQuery.llmModel,
      status: overpassQuery.status,
      duration: overpassQuery.duration,
      user,
    });
    return data;
  }
}
