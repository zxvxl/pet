import { createConnection } from 'mysql2/promise';
import { loadConfig } from './config';

export async function mysqlHealthCheck() {
  const db = loadConfig().db;
  const connection = await createConnection({
    host: db.host,
    port: db.port,
    user: db.username,
    password: db.password,
    database: db.database,
  });

  await connection.execute('SELECT 1');
  await connection.end();
  return true;
}
