import { MarkersService } from '../markers/markers.service';
import { Marker } from '../markers/domain/marker';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagRepository } from './infrastructure/persistence/tag.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Tag } from './domain/tag';

@Injectable()
export class TagsService {
  constructor(
    private readonly markerService: MarkersService,

    // Dependencies here
    private readonly tagRepository: TagRepository,
  ) {}

  async create(createTagDto: CreateTagDto) {
    // Do not remove comment below.
    // <creating-property />

    const markerObject = await this.markerService.findById(
      createTagDto.marker.id,
    );
    if (!markerObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          marker: 'notExists',
        },
      });
    }
    const marker = markerObject;

    return this.tagRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      value: createTagDto.value,

      key: createTagDto.key,

      marker,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.tagRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Tag['id']) {
    return this.tagRepository.findById(id);
  }

  findByIds(ids: Tag['id'][]) {
    return this.tagRepository.findByIds(ids);
  }

  async update(
    id: Tag['id'],

    updateTagDto: UpdateTagDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    let marker: Marker | undefined = undefined;

    if (updateTagDto.marker) {
      const markerObject = await this.markerService.findById(
        updateTagDto.marker.id,
      );
      if (!markerObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            marker: 'notExists',
          },
        });
      }
      marker = markerObject;
    }

    return this.tagRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      value: updateTagDto.value,

      key: updateTagDto.key,

      marker,
    });
  }

  remove(id: Tag['id']) {
    return this.tagRepository.remove(id);
  }
}
