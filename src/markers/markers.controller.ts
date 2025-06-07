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
} from '@nestjs/common';
import { MarkersService } from './markers.service';
import { CreateMarkerDto } from './dto/create-marker.dto';
import { UpdateMarkerDto } from './dto/update-marker.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Marker } from './domain/marker';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllMarkersDto } from './dto/find-all-markers.dto';

@ApiTags('Markers')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'markers',
  version: '1',
})
export class MarkersController {
  constructor(private readonly markersService: MarkersService) {}

  @Post()
  @ApiCreatedResponse({
    type: Marker,
  })
  create(@Body() createMarkerDto: CreateMarkerDto) {
    return this.markersService.create(createMarkerDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Marker),
  })
  async findAll(
    @Query() query: FindAllMarkersDto,
  ): Promise<InfinityPaginationResponseDto<Marker>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.markersService.findAllWithPagination({
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
    type: Marker,
  })
  findById(@Param('id') id: string) {
    return this.markersService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Marker,
  })
  update(@Param('id') id: string, @Body() updateMarkerDto: UpdateMarkerDto) {
    return this.markersService.update(id, updateMarkerDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.markersService.remove(id);
  }
}
