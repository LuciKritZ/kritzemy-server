export interface NodeEnv {
  NODE_ENV: 'development' | 'production';
  PORT?: string;
  ORIGIN: string;
  JWT_AUTH_SECRET: string;

  // User Security
  ACCESS_TOKEN_PUBLIC_KEY: string;
  REFRESH_TOKEN_SECRET_KEY: string;

  // MongoDB
  MONGO_DB_URI: string;

  // Cloudinary
  CLOUDINARY_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;

  // Redis
  REDIS_URL: string;

  // SMTP
  SMTP_HOST: string;
  SMTP_PORT: string;
  SMTP_SERVICE: string;
  SMTP_EMAIL: string;
  SMTP_PASSWORD: string;
}
