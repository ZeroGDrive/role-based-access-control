import { config } from 'dotenv';
import { parseEnv } from 'znv';
import { z } from 'zod';

config();

export const env = parseEnv(process.env, {
  PORT: z.number().default(3000),
  HOST: z.string().default('0.0.0.0'),
  DATABASE_CONNECTION: z.string(),
});
