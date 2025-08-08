import { Module } from '@nestjs/common';
import { TagRepository } from '../tag.repository';
import { TagRelationalRepository } from './repositories/tag.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from './entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity])],
  providers: [
    {
      provide: TagRepository,
      useClass: TagRelationalRepository,
    },
  ],
  exports: [TagRepository],
})
export class RelationalTagPersistenceModule {}
