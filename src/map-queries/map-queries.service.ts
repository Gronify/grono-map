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

@Injectable()
export class MapQueriesService {
  constructor(
    private readonly userService: UsersService,

    // Dependencies here
    private readonly mapQueryRepository: MapQueryRepository,
  ) {}

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
      radius: createMapQueryDto.radius,

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
      radius: updateMapQueryDto.radius,

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
}
