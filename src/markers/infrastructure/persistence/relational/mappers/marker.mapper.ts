import { Marker } from '../../../../domain/marker';

import { MarkerEntity } from '../entities/marker.entity';

export class MarkerMapper {
  static toDomain(raw: MarkerEntity): Marker {
    const domainEntity = new Marker();
    domainEntity.id = raw.id;
    domainEntity.longitude = raw.longitude;
    domainEntity.latitude = raw.latitude;
    domainEntity.source = raw.source;
    domainEntity.osmType = raw.osmType;
    domainEntity.osmId = raw.osmId;
    domainEntity.category = raw.category;
    domainEntity.description = raw.description;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Marker): MarkerEntity {
    const persistenceEntity = new MarkerEntity();
    persistenceEntity.longitude = domainEntity.longitude;
    persistenceEntity.latitude = domainEntity.latitude;
    persistenceEntity.source = domainEntity.source;
    persistenceEntity.osmType = domainEntity.osmType;
    persistenceEntity.osmId = domainEntity.osmId;
    persistenceEntity.category = domainEntity.category;
    persistenceEntity.description = domainEntity.description;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
