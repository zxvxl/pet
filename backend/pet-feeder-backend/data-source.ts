import 'dotenv/config';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '3306', 10),
  username: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASS ?? 'root',
  database: process.env.DB_NAME ?? 'pet_feeder',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
});
