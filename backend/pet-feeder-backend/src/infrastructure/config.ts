import { readFileSync } from 'fs';
import * as path from 'path';

export interface DbConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface AppConfig {
  port: number;
  jwtSecret: string;
  frontendDomain: string;
  wechat: { appid: string; secret: string };
  redis: { host: string; port: number };
  kafka: { brokers: string[] };
  db: DbConfig;
}

export function loadConfig(): AppConfig {
  const defaults: AppConfig = {
    port: 3000,
    jwtSecret: 'secret',
    frontendDomain: 'http://localhost:8080',
    wechat: { appid: '', secret: '' },
    redis: { host: 'localhost', port: 6379 },
    kafka: { brokers: ['localhost:9092'] },
    db: {
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'pet_feeder',
    },
  };

  const env = process.env.APP_ENV || 'development';
  const basePath = path.join(__dirname, '../../config');
  const configPath =
    process.env.APP_CONFIG_PATH || path.join(basePath, `${env}.json`);

  try {
    const raw = readFileSync(configPath, 'utf8');
    const parsed = JSON.parse(raw) as Partial<AppConfig>;
    return {
      ...defaults,
      ...parsed,
      db: { ...defaults.db, ...(parsed.db || {}) },
    };
  } catch {
    return defaults;
  }
}
