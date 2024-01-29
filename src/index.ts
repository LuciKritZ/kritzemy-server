import { getEnvVariable } from '@/config';
import {
  applicationService,
  cloudinaryService,
  databaseService,
  redisService,
} from '@/services';

const startServer = async () => {
  // Env variables
  const PORT: number = Number(getEnvVariable('PORT')) || 8000;
  const ORIGINS: string[] = JSON.parse(getEnvVariable('ORIGIN') || '');
  const MONGO_DB_URI: string = getEnvVariable('MONGO_DB_URI') ?? '';
  const CLOUDINARY_NAME: string = getEnvVariable('CLOUDINARY_NAME') ?? '';
  const CLOUDINARY_API_KEY: string = getEnvVariable('CLOUDINARY_API_KEY') ?? '';
  const CLOUDINARY_API_SECRET: string =
    getEnvVariable('CLOUDINARY_API_SECRET') ?? '';

  // DB connection
  await databaseService(MONGO_DB_URI);

  // Express application service
  const app = applicationService(ORIGINS);

  // Redis connection
  redisService();

  // Cloudinary connection
  cloudinaryService({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
};

// Starting server
startServer();
