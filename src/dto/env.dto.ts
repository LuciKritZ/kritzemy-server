export interface NodeEnv {
  NODE_ENV: 'development' | 'production';
  PORT?: string;
  ORIGIN: string;
  MONGO_DB_URI: string;
  CLOUDINARY_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  REDIS_URL: string;
  ACCESS_TOKEN_PRIVATE_KEY?: string;
  SMTP_HOST: string;
  SMTP_PORT: string;
  SMTP_SERVICE: string;
  SMTP_EMAIL: string;
  SMTP_PASSWORD: string;
}
