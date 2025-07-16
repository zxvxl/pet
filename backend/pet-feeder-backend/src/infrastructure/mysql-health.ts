import { createConnection } from 'mysql2/promise';

export async function mysqlHealthCheck() {
  const connection = await createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    port: +(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'password',
    database: process.env.MYSQL_DB || 'pet_feeder',
  });

  await connection.execute('SELECT 1');
  await connection.end();
  return true;
}
