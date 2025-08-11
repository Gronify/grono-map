import { Inject, Injectable } from '@nestjs/common';
import { Cacheable } from 'cacheable';

@Injectable()
export class RedisService {
  constructor(@Inject('CACHE_INSTANCE') private readonly cache: Cacheable) {}

  async get<T>(key: string): Promise<T | undefined> {
    return await this.cache.get<T>(key);
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.cache.set(key, value);
  }

  async del(key: string): Promise<void> {
    await this.cache.delete(key);
  }

  async getOrSet<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const cached = await this.get<T>(key);

    if (cached) return cached;

    const data = await fetcher();
    await this.set(key, data);

    return data;
  }
}
