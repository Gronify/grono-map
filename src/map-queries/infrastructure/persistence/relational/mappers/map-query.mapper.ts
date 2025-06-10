import { MapQuery } from '../../../../domain/map-query';

import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { MapQueryEntity } from '../entities/map-query.entity';

export class MapQueryMapper {
  static toDomain(raw: MapQueryEntity): MapQuery {
    const domainEntity = new MapQuery();
    domainEntity.radius = raw.radius;

    domainEntity.longitude = raw.longitude;

    domainEntity.latitude = raw.latitude;

    domainEntity.inputText = raw.inputText;

    domainEntity.llmResponse = raw.llmResponse;

    domainEntity.llmModel = raw.llmModel;

    domainEntity.status = raw.status;

    domainEntity.duration = raw.duration;

    if (raw.user) {
      domainEntity.user = UserMapper.toDomain(raw.user);
    } else if (raw.user === null) {
      domainEntity.user = null;
    }

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: MapQuery): MapQueryEntity {
    const persistenceEntity = new MapQueryEntity();
    persistenceEntity.radius = domainEntity.radius;

    persistenceEntity.longitude = domainEntity.longitude;

    persistenceEntity.latitude = domainEntity.latitude;

    persistenceEntity.inputText = domainEntity.inputText;

    persistenceEntity.llmResponse = domainEntity.llmResponse;

    persistenceEntity.llmModel = domainEntity.llmModel;

    persistenceEntity.status = domainEntity.status;

    persistenceEntity.duration = domainEntity.duration;

    if (domainEntity.user) {
      persistenceEntity.user = UserMapper.toPersistence(domainEntity.user);
    } else if (domainEntity.user === null) {
      persistenceEntity.user = null;
    }

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
