import {
  ConflictException,
  // common
  Injectable,
} from '@nestjs/common';
import { CreateMarkerDto } from './dto/create-marker.dto';
import { UpdateMarkerDto } from './dto/update-marker.dto';
import { MarkerRepository } from './infrastructure/persistence/marker.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Marker } from './domain/marker';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class MarkersService {
  constructor(
    // Dependencies here
    private readonly markerRepository: MarkerRepository,
    private readonly redisService: RedisService,
  ) {}

  async create(createMarkerDto: CreateMarkerDto) {
    if (createMarkerDto.osmId) {
      const existing = await this.markerRepository.findByOsmIdAndType(
        createMarkerDto.osmId,
        createMarkerDto.osmType,
      );
      if (existing) {
        throw new ConflictException(
          'Marker with this OSM ID and type already exists',
        );
      }
    }

    // Do not remove comment below.
    // <creating-property />

    return this.markerRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      osmType: createMarkerDto.osmType,
      osmId: createMarkerDto.osmId,
      source: createMarkerDto.source,
      category: createMarkerDto.category,
      description: createMarkerDto.description,
      longitude: createMarkerDto.longitude,
      latitude: createMarkerDto.latitude,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.markerRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Marker['id']) {
    return this.markerRepository.findById(id);
  }

  findByIds(ids: Marker['id'][]) {
    return this.markerRepository.findByIds(ids);
  }

  async update(
    id: Marker['id'],

    updateMarkerDto: UpdateMarkerDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.markerRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      osmType: updateMarkerDto.osmType,
      osmId: updateMarkerDto.osmId,
      source: updateMarkerDto.source,
      category: updateMarkerDto.category,
      description: updateMarkerDto.description,
      longitude: updateMarkerDto.longitude,
      latitude: updateMarkerDto.latitude,
    });
  }

  remove(id: Marker['id']) {
    return this.markerRepository.remove(id);
  }

  async findNearby(latitude: number, longitude: number, radiusMeters: number) {
    const cacheKey = `nearby:${latitude}:${longitude}:${radiusMeters}`;

    return this.redisService.getOrSet(cacheKey, async () => {
      return this.markerRepository.findNearby(
        latitude,
        longitude,
        radiusMeters,
      );
    });
  }
}
