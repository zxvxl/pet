import { createConnection } from 'mysql2/promise';

export async function mysqlHealthCheck() {
  const connection = await createConnection({
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '3306', 10),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASS ?? 'password',
    database: process.env.DB_NAME ?? 'pet_feeder',
  });

  await connection.execute('SELECT 1');
  await connection.end();
  return true;
}
