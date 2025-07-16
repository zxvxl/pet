export interface AppConfig {
  nodeEnv: string;
  mysqlHost: string;
  cloudMode: boolean;
}

export function loadConfig(): AppConfig {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    mysqlHost: process.env.MYSQL_HOST || 'localhost',
    cloudMode: process.env.CLOUD_ENV === 'true',
  };
}
