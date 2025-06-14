import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Marker } from '../../domain/marker';

export abstract class MarkerRepository {
  abstract create(
    data: Omit<Marker, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Marker>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Marker[]>;

  abstract findById(id: Marker['id']): Promise<NullableType<Marker>>;

  abstract findByIds(ids: Marker['id'][]): Promise<Marker[]>;

  abstract update(
    id: Marker['id'],
    payload: DeepPartial<Marker>,
  ): Promise<Marker | null>;

  abstract remove(id: Marker['id']): Promise<void>;

  abstract findByOsmIdAndType(
    osmId: string,
    osmType: string,
  ): Promise<NullableType<Marker>>;
}
