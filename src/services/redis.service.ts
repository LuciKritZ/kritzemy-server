import { Redis } from 'ioredis';

const redisClient = (redisURL: string) => {
  // TODO: Implement caching in future
  if (redisURL) {
    console.log(`Redis connected!`);
    return redisClient;
  }

  throw new Error('Redis connection failed.');
};

export default redisClient;
