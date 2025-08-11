import { Module } from '@nestjs/common';
import { MapQueryRepository } from '../map-query.repository';
import { MapQueryRelationalRepository } from './repositories/map-query.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MapQueryEntity } from './entities/map-query.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MapQueryEntity])],
  providers: [
    {
      provide: MapQueryRepository,
      useClass: MapQueryRelationalRepository,
    },
  ],
  exports: [MapQueryRepository],
})
export class RelationalMapQueryPersistenceModule {}
