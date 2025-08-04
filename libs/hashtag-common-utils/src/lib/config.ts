import servicesConfig, { ServicesConfig } from "./services.config.ts";

interface ServerConfig {
  port: number | string;
  hostname: string;
}

interface DatabaseConfig {
  url: string;
}

interface AppConfig {
  server: ServerConfig;
  database: DatabaseConfig;
  services: ServicesConfig,
  isDev: boolean;
  isProd: boolean;
}

const env = (process.env.NODE_ENV || 'development') as 'development' | 'production';

const config: Record<'development' | 'production', Omit<AppConfig, 'isDev' | 'isProd'>> = {
  development: {
    server: {
      port: process.env.PORT || 3000,
      hostname: process.env.HOSTNAME || 'localhost',
    },
    database: {
      url: `mongodb://${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 27017}/${process.env.DB_NAME || 'hashtag_dev'}`,
    },
    services: servicesConfig,
  },
  production: {
    server: {
      port: process.env.PORT || 3200,
      hostname: process.env.HOSTNAME || 'localhost',
    },
    database: {
      url: `mongodb://${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 27017}/${process.env.DB_NAME || 'hashtag_prod'}`,
    },
    services: servicesConfig,
  },
};

const selectedConfig: AppConfig = {
  ...config[env],
  isDev: env === 'development',
  isProd: env === 'production',
};

export default selectedConfig;
