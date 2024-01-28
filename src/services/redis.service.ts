import { getEnvVariable } from '@/config';
import { Redis } from 'ioredis';

export const redisService = (): Redis => {
  // TODO: Implement caching in future
  const redisURL = getEnvVariable('REDIS_URL');
  if (redisURL) {
    const client = new Redis(redisURL);
    return client;
  }

  throw new Error('Redis connection failed.');
};

export const redisClient = redisService();

export default redisService;
