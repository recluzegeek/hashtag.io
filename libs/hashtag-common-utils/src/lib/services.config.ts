export interface QueuesConfig {
  exchangeName: string;
  exchangeType: string;
  passwordResetQueue: string;
  welcomeEmailQueue: string;
}

export interface RoutingKeys {
  passwordForget: string;
  passwordReset: string;
}

export interface ServiceEndpoint {
  protocol: string;
  host: string;
  port: number;
  url: string;
}

export interface NotificationConfig {
  name: string;
}

export interface ServicesConfig {
  userService: ServiceEndpoint;
  postService: ServiceEndpoint;
  groupService: ServiceEndpoint;
  notificationService: ServiceEndpoint;
  apiGateway: ServiceEndpoint;
  frontend: ServiceEndpoint;
  frontendPreview: ServiceEndpoint;
  rabbitmq: ServiceEndpoint;
}

export interface SecretsConfig {
  accessTokenSecret: string;
  refreshTokenSecret: string;
}

const parsePort = (port: string | undefined, fallback: number): number =>
  port ? parseInt(port, 10) : fallback;

const parseHost = (host: string | undefined, fallback: string): string =>
  host || fallback;

function createServiceEndpoint(
  hostEnv: string | undefined,
  portEnv: string | undefined,
  defaultPort: number,
  protocol = 'http'
): ServiceEndpoint {
  const host = parseHost(hostEnv, 'localhost');
  const port = parsePort(portEnv, defaultPort);
  const url = `${protocol}://${host}:${port}`;
  return { protocol, host, port, url };
}

const queuesConfig: QueuesConfig = {
  exchangeName: process.env.EXCHANGE_NAME || 'hashtag.io',
  exchangeType: process.env.EXCHANGE_TYPE || 'direct',
  passwordResetQueue:
    process.env.PASSWORD_RESET_QUEUE || 'notification.email.password',
  welcomeEmailQueue:
    process.env.WELCOME_EMAIL_QUEUE || 'notification.email.welcome',
};

const routingKeysConfig: RoutingKeys = {
  passwordForget: process.env.PASSWORD_FORGET_ROUTING_KEY || 'password.forget',
  passwordReset: process.env.PASSWORD_RESET_ROUTING_KEY || 'password.reset',
};

const servicesConfig: ServicesConfig = {
  userService: createServiceEndpoint(
    process.env.USER_SERVICE_HOST,
    process.env.USER_SERVICE_PORT,
    3500
  ),
  postService: createServiceEndpoint(
    process.env.POST_SERVICE_HOST,
    process.env.POST_SERVICE_PORT,
    3400
  ),
  groupService: createServiceEndpoint(
    process.env.GROUP_SERVICE_HOST,
    process.env.GROUP_SERVICE_PORT,
    3200
  ),
  notificationService: createServiceEndpoint(
    process.env.NOTIFICATION_SERVICE_HOST,
    process.env.NOTIFICATION_SERVICE_PORT,
    3300
  ),
  apiGateway: createServiceEndpoint(
    process.env.API_GATEWAY_HOST,
    process.env.API_GATEWAY_PORT,
    3100
  ),
  frontend: createServiceEndpoint(
    process.env.FRONTEND_SERVING_HOST,
    process.env.FRONTEND_SERVING_PORT,
    4200
  ),
  frontendPreview: createServiceEndpoint(
    process.env.FRONTEND_PREVIEW_HOST,
    process.env.FRONTEND_PREVIEW_PORT,
    4300
  ),
  rabbitmq: createServiceEndpoint(
    process.env.RABBITMQ_SERVICE_HOST,
    process.env.RABBITMQ_SERVICE_PORT,
    5672,
    'amqp'
  ),
};

const secretsConfig: SecretsConfig = {
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || '',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || '',
};

export { queuesConfig, routingKeysConfig, secretsConfig, servicesConfig };
