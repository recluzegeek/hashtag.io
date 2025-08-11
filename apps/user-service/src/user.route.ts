import express from 'express';
import UserController from './user.controller';
import { auth } from '@hashtag.io-microservices/hashtag-common-utils';

const UserRouter = express.Router();

UserRouter.get('/api', auth, (req, res) => {
  res.send({ message: 'Welcome to users-service!' });
});

// TODO: Validate the DATA
UserRouter.post('/register', UserController.register);
UserRouter.post('/login', UserController.login);
UserRouter.post('/logout', auth, UserController.logout);
// UserRouter.post('/forgot-password', UserController.logout);
// UserRouter.post('/reset-password', UserController.logout);

export { UserRouter };
