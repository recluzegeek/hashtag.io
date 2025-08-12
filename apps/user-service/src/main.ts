import {
  errorMiddleware,
  selectedConfig,
} from '@hashtag.io-microservices/hashtag-common-utils';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import * as path from 'path';

import { UserRouter } from './user.route';

const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', UserRouter);

app.use(errorMiddleware);

const port = selectedConfig.services.userService.port || 3500;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

server.on('error', console.error);
