import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { MapQueryEntity } from '../entities/map-query.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { MapQuery } from '../../../../domain/map-query';
import { MapQueryRepository } from '../../map-query.repository';
import { MapQueryMapper } from '../mappers/map-query.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class MapQueryRelationalRepository implements MapQueryRepository {
  constructor(
    @InjectRepository(MapQueryEntity)
    private readonly mapQueryRepository: Repository<MapQueryEntity>,
  ) {}

  async create(data: MapQuery): Promise<MapQuery> {
    const persistenceModel = MapQueryMapper.toPersistence(data);
    const newEntity = await this.mapQueryRepository.save(
      this.mapQueryRepository.create(persistenceModel),
    );
    return MapQueryMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<MapQuery[]> {
    const entities = await this.mapQueryRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => MapQueryMapper.toDomain(entity));
  }

  async findById(id: MapQuery['id']): Promise<NullableType<MapQuery>> {
    const entity = await this.mapQueryRepository.findOne({
      where: { id },
    });

    return entity ? MapQueryMapper.toDomain(entity) : null;
  }

  async findByIds(ids: MapQuery['id'][]): Promise<MapQuery[]> {
    const entities = await this.mapQueryRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => MapQueryMapper.toDomain(entity));
  }

  async update(
    id: MapQuery['id'],
    payload: Partial<MapQuery>,
  ): Promise<MapQuery> {
    const entity = await this.mapQueryRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.mapQueryRepository.save(
      this.mapQueryRepository.create(
        MapQueryMapper.toPersistence({
          ...MapQueryMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return MapQueryMapper.toDomain(updatedEntity);
  }

  async remove(id: MapQuery['id']): Promise<void> {
    await this.mapQueryRepository.delete(id);
  }
}
