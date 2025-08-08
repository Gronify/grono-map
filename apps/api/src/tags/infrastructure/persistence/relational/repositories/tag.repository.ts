import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { TagEntity } from '../entities/tag.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Tag } from '../../../../domain/tag';
import { TagRepository } from '../../tag.repository';
import { TagMapper } from '../mappers/tag.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class TagRelationalRepository implements TagRepository {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  async create(data: Tag): Promise<Tag> {
    const persistenceModel = TagMapper.toPersistence(data);
    const newEntity = await this.tagRepository.save(
      this.tagRepository.create(persistenceModel),
    );
    return TagMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Tag[]> {
    const entities = await this.tagRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => TagMapper.toDomain(entity));
  }

  async findById(id: Tag['id']): Promise<NullableType<Tag>> {
    const entity = await this.tagRepository.findOne({
      where: { id },
    });

    return entity ? TagMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Tag['id'][]): Promise<Tag[]> {
    const entities = await this.tagRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => TagMapper.toDomain(entity));
  }

  async update(id: Tag['id'], payload: Partial<Tag>): Promise<Tag> {
    const entity = await this.tagRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.tagRepository.save(
      this.tagRepository.create(
        TagMapper.toPersistence({
          ...TagMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return TagMapper.toDomain(updatedEntity);
  }

  async remove(id: Tag['id']): Promise<void> {
    await this.tagRepository.delete(id);
  }
}
