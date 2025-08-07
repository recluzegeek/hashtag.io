import express from 'express';
import type { Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { selectedConfig } from '@hashtag.io-microservices/hashtag-common-utils';

const app = express();

// app.use((req, res, next) => {});

const userProxyMiddleware = createProxyMiddleware<Request, Response>({
  target: selectedConfig.services.userService.url,
  changeOrigin: true,
  pathRewrite: {
    '^/api/users': '',
  },
});

app.use('/api/users', userProxyMiddleware);

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to api-gateway!' });
});

const port = process.env.API_GATEWAY_PORT || 3100;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

server.on('error', console.error);
