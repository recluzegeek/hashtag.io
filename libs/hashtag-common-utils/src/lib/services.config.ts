export interface ServiceEndpoint {
  host: string;
  port: number;
  url: string;
}

export interface ServicesConfig {
  userService: ServiceEndpoint;
  postService: ServiceEndpoint;
  groupService: ServiceEndpoint;
  notificationService: ServiceEndpoint;
  apiGateway: ServiceEndpoint;
  frontend: ServiceEndpoint;
  frontendPreview: ServiceEndpoint;
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
  defaultPort: number
): ServiceEndpoint {
  const host = parseHost(hostEnv, 'localhost');
  const port = parsePort(portEnv, defaultPort);
  const url = `http://${host}:${port}`;
  return { host, port, url };
}

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
};

const secretsConfig: SecretsConfig = {
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || '',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || '',
};

export { servicesConfig, secretsConfig };
