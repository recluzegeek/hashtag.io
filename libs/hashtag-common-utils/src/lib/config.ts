import {
  type QueuesConfig,
  queuesConfig,
  type RoutingKeys,
  routingKeysConfig,
  type SecretsConfig,
  secretsConfig,
  type ServicesConfig,
  servicesConfig,
} from './services.config.js';

interface AppConfig {
  server: ServerConfig;
  database: DatabaseConfig;
  routingKeys: RoutingKeys;
  queues: QueuesConfig;
  services: ServicesConfig;
  secrets: SecretsConfig;
  isDev: boolean;
  isProd: boolean;
}

interface DatabaseConfig {
  url: string;
}

interface ServerConfig {
  port: number | string;
  hostname: string;
}

const env = (process.env.NODE_ENV || 'development') as
  | 'development'
  | 'production';

const config: Record<
  'development' | 'production',
  Omit<AppConfig, 'isDev' | 'isProd'>
> = {
  development: {
    server: {
      port: process.env.PORT || 3000,
      hostname: process.env.HOSTNAME || 'localhost',
    },
    database: {
      url: `mongodb://${process.env.DB_HOST || 'localhost'}:${
        process.env.DB_PORT || 27017
      }/${process.env.DB_NAME || 'hashtag_dev'}`,
    },
    services: servicesConfig,
    secrets: secretsConfig,
    queues: queuesConfig,
    routingKeys: routingKeysConfig,
  },
  production: {
    server: {
      port: process.env.PORT || 3200,
      hostname: process.env.HOSTNAME || 'localhost',
    },
    database: {
      url: `mongodb://${process.env.DB_HOST || 'localhost'}:${
        process.env.DB_PORT || 27017
      }/${process.env.DB_NAME || 'hashtag_prod'}`,
    },
    services: servicesConfig,
    secrets: secretsConfig,
    queues: queuesConfig,
    routingKeys: routingKeysConfig,
  },
};

export const selectedConfig: AppConfig = {
  ...config[env],
  isDev: env === 'development',
  isProd: env === 'production',
};
