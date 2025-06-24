import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Raw } from 'typeorm';
import { MarkerEntity } from '../entities/marker.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Marker } from '../../../../domain/marker';
import { MarkerRepository } from '../../marker.repository';
import { MarkerMapper } from '../mappers/marker.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class MarkerRelationalRepository implements MarkerRepository {
  constructor(
    @InjectRepository(MarkerEntity)
    private readonly markerRepository: Repository<MarkerEntity>,
  ) {}

  async create(data: Marker): Promise<Marker> {
    const persistenceModel = MarkerMapper.toPersistence(data);
    const newEntity = await this.markerRepository.save(
      this.markerRepository.create(persistenceModel),
    );
    return MarkerMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Marker[]> {
    const entities = await this.markerRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => MarkerMapper.toDomain(entity));
  }

  async findById(id: Marker['id']): Promise<NullableType<Marker>> {
    const entity = await this.markerRepository.findOne({
      where: { id },
    });

    return entity ? MarkerMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Marker['id'][]): Promise<Marker[]> {
    const entities = await this.markerRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => MarkerMapper.toDomain(entity));
  }

  async update(id: Marker['id'], payload: Partial<Marker>): Promise<Marker> {
    const entity = await this.markerRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.markerRepository.save(
      this.markerRepository.create(
        MarkerMapper.toPersistence({
          ...MarkerMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return MarkerMapper.toDomain(updatedEntity);
  }

  async remove(id: Marker['id']): Promise<void> {
    await this.markerRepository.delete(id);
  }

  async findByOsmIdAndType(
    osmId: string,
    osmType: string,
  ): Promise<NullableType<Marker>> {
    const entity = await this.markerRepository.findOne({
      where: {
        osmId,
        osmType,
      },
    });

    return entity ? MarkerMapper.toDomain(entity) : null;
  }

  async findNearby(
    latitude: number,
    longitude: number,
    radiusMeters: number,
  ): Promise<Marker[]> {
    const earthRadius = 6371000;

    const markers = await this.markerRepository.find({
      where: {
        latitude: Raw(
          () => `ABS(latitude - ${latitude}) <= ${radiusMeters / earthRadius}`,
        ),
        longitude: Raw(
          () =>
            `ABS(longitude - ${longitude}) <= ${radiusMeters / (earthRadius * Math.cos((latitude * Math.PI) / 180))}`,
        ),
      },
    });

    return markers.map((entity) => MarkerMapper.toDomain(entity));
  }
}
