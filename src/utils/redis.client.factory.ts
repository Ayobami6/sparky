import { FactoryProvider } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';

export const redisClientFactory: FactoryProvider<Redis> = {
  provide: 'RedisClient',
  useFactory: (configService: ConfigService) => {
    console.log(configService.get('REDIS_URL'));
    const redisInstance = new Redis(configService.get('REDIS_URL'));

    redisInstance.on('error', (e) => {
      throw new Error(`Redis connection failed: ${e}`);
    });

    return redisInstance;
  },
  inject: [ConfigService],
};
