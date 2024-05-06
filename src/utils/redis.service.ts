import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('RedisClient') private readonly redisClient: Redis) {}

  async set(key: string, value: any, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redisClient.setex(key, ttl, value);
    } else {
      await this.redisClient.set(key, value);
    }
  }

  async get(key: string): Promise<any> {
    return this.redisClient.get(key);
  }
}