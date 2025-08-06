export interface ServicesConfig {
  userServicePort: number;
  postServicePort: number;
  groupServicePort: number;
  notificationServicePort: number;
  apiGatewayPort: number;
  frontendPort: number;
  frontendPreviewPort: number;
}

export interface SecretsConfig {
  accessTokenSecret: string;
  refreshTokenSecret: string;
}

const parsePort = (port: string | undefined, fallback: number): number =>
  port ? parseInt(port, 10) : fallback;

const servicesConfig: ServicesConfig = {
  userServicePort: parsePort(process.env.USER_SERVICE_PORT, 3500),
  postServicePort: parsePort(process.env.POST_SERVICE_PORT, 3400),
  groupServicePort: parsePort(process.env.GROUP_SERVICE_PORT, 3200),
  notificationServicePort: parsePort(
    process.env.NOTIFICATION_SERVICE_PORT,
    3300
  ),
  apiGatewayPort: parsePort(process.env.API_GATEWAY_PORT, 3100),
  frontendPort: parsePort(process.env.FRONTEND_SERVING_PORT, 4200),
  frontendPreviewPort: parsePort(process.env.FRONTEND_PREVIEW_PORT, 4300),
};

const secretsConfig: SecretsConfig = {
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || '',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || '',
};

export { servicesConfig, secretsConfig };
