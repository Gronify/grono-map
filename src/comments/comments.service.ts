import { MarkersService } from '../markers/markers.service';
import { Marker } from '../markers/domain/marker';

import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentRepository } from './infrastructure/persistence/comment.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Comment } from './domain/comment';
import { UserDto } from '../users/dto/user.dto';

@Injectable()
export class CommentsService {
  constructor(
    private readonly markerService: MarkersService,

    private readonly userService: UsersService,

    // Dependencies here
    private readonly commentRepository: CommentRepository,
  ) {}

  async create(createCommentDto: CreateCommentDto, userDto: UserDto) {
    // Do not remove comment below.
    // <creating-property />
    const markerObject = await this.markerService.findById(
      createCommentDto.marker.id,
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

    const userObject = await this.userService.findById(userDto.id);
    if (!userObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          user: 'notExists',
        },
      });
    }
    const user = userObject;

    return this.commentRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      marker,
      user,
      text: createCommentDto.text,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.commentRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Comment['id']) {
    return this.commentRepository.findById(id);
  }

  findByIds(ids: Comment['id'][]) {
    return this.commentRepository.findByIds(ids);
  }

  findByMarkerId(markerId: string): Promise<Comment[]> {
    return this.commentRepository.findByMarkerId(markerId);
  }

  async update(
    id: Comment['id'],

    updateCommentDto: UpdateCommentDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let marker: Marker | undefined = undefined;

    if (updateCommentDto.marker) {
      const markerObject = await this.markerService.findById(
        updateCommentDto.marker.id,
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

    let user: User | undefined = undefined;

    if (updateCommentDto.user) {
      const userObject = await this.userService.findById(
        updateCommentDto.user.id,
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
    }

    return this.commentRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      marker,

      user,

      text: updateCommentDto.text,
    });
  }

  remove(id: Comment['id']) {
    return this.commentRepository.remove(id);
  }
}
