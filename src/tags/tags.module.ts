import { MarkersModule } from '../markers/markers.module';
import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { RelationalTagPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    MarkersModule,

    // do not remove this comment
    RelationalTagPersistenceModule,
  ],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TagsService, RelationalTagPersistenceModule],
})
export class TagsModule {}
