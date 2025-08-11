import { Tag } from '../../../../domain/tag';

import { MarkerMapper } from '../../../../../markers/infrastructure/persistence/relational/mappers/marker.mapper';

import { TagEntity } from '../entities/tag.entity';

export class TagMapper {
  static toDomain(raw: TagEntity): Tag {
    const domainEntity = new Tag();
    domainEntity.id = raw.id;
    if (raw.marker) {
      domainEntity.marker = MarkerMapper.toDomain(raw.marker);
    }
    domainEntity.value = raw.value;
    domainEntity.key = raw.key;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Tag): TagEntity {
    const persistenceEntity = new TagEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    if (domainEntity.marker) {
      persistenceEntity.marker = MarkerMapper.toPersistence(
        domainEntity.marker,
      );
    }
    persistenceEntity.value = domainEntity.value;
    persistenceEntity.key = domainEntity.key;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
