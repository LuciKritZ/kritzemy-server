import { NodeEnv } from '@/dto';

import { config as dotEnvConfig } from 'dotenv';
dotEnvConfig();

export const getEnvVariable = (key: keyof NodeEnv): string =>
  process.env[key] ?? '';
