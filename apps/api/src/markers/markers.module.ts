import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { MarkersService } from './markers.service';
import { MarkersController } from './markers.controller';
import { RelationalMarkerPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    RedisModule,
    // do not remove this comment
    RelationalMarkerPersistenceModule,
  ],
  controllers: [MarkersController],
  providers: [MarkersService],
  exports: [MarkersService, RelationalMarkerPersistenceModule],
})
export class MarkersModule {}
