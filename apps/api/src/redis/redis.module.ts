import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Cacheable } from 'cacheable';
import { createKeyv } from '@keyv/redis';
import { RedisService } from './redis.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'CACHE_INSTANCE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.getOrThrow('redis.host', { infer: true });
        const port = configService.getOrThrow('redis.port', { infer: true });
        const ttl = configService.getOrThrow('redis.ttl', {
          infer: true,
        });

        const redisUrl = `redis://${host}:${port}`;
        const secondary = createKeyv(redisUrl);

        return new Cacheable({
          secondary,
          ttl: ttl,
        });
      },
    },
    RedisService,
  ],
  exports: ['CACHE_INSTANCE', RedisService],
})
export class RedisModule {}
