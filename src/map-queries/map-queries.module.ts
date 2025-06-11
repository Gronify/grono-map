import { UsersModule } from '../users/users.module';
import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { MapQueriesService } from './map-queries.service';
import { MapQueriesController } from './map-queries.controller';
import { RelationalMapQueryPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { GeminiModelProvider } from './gemini.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    UsersModule,

    // do not remove this comment
    RelationalMapQueryPersistenceModule,
  ],
  controllers: [MapQueriesController],
  providers: [MapQueriesService, GeminiModelProvider],
  exports: [MapQueriesService, RelationalMapQueryPersistenceModule],
})
export class MapQueriesModule {}
