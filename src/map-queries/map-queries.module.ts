import { UsersModule } from '../users/users.module';
import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { MapQueriesService } from './map-queries.service';
import { MapQueriesController } from './map-queries.controller';
import { RelationalMapQueryPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    UsersModule,

    // do not remove this comment
    RelationalMapQueryPersistenceModule,
  ],
  controllers: [MapQueriesController],
  providers: [MapQueriesService],
  exports: [MapQueriesService, RelationalMapQueryPersistenceModule],
})
export class MapQueriesModule {}
