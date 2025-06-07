import { Module } from '@nestjs/common';
import { MarkerRepository } from '../marker.repository';
import { MarkerRelationalRepository } from './repositories/marker.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarkerEntity } from './entities/marker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MarkerEntity])],
  providers: [
    {
      provide: MarkerRepository,
      useClass: MarkerRelationalRepository,
    },
  ],
  exports: [MarkerRepository],
})
export class RelationalMarkerPersistenceModule {}
