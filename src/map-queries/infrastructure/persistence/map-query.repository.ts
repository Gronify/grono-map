import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { MapQuery } from '../../domain/map-query';

export abstract class MapQueryRepository {
  abstract create(
    data: Omit<MapQuery, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<MapQuery>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<MapQuery[]>;

  abstract findById(id: MapQuery['id']): Promise<NullableType<MapQuery>>;

  abstract findByIds(ids: MapQuery['id'][]): Promise<MapQuery[]>;

  abstract update(
    id: MapQuery['id'],
    payload: DeepPartial<MapQuery>,
  ): Promise<MapQuery | null>;

  abstract remove(id: MapQuery['id']): Promise<void>;
}
