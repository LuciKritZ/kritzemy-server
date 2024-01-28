import { getEnvVariable } from '@/config';
import { applicationService, databaseService, redisService } from '@/services';

// Env variables
const PORT: number = Number(getEnvVariable('PORT')) || 8000;
const ORIGINS: string[] = JSON.parse(getEnvVariable('ORIGIN') || '');
const MONGO_DB_URI: string = getEnvVariable('MONGO_DB_URI') ?? '';
const REDIS_URL: string = getEnvVariable('REDIS_URL') ?? '';

const startServer = async () => {
  // DB connection
  await databaseService(MONGO_DB_URI);

  // Express application service
  const app = applicationService(ORIGINS);

  // Redis connection
  redisService(REDIS_URL);

  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
};

// Starting server
startServer();
