import express from 'express';
import UserController from './user.controller';

const UserRouter = express.Router();

UserRouter.get('/api', (req, res) => {
  res.send({ message: 'Welcome to users-service!' });
});

// TODO: Validate the DATA
UserRouter.post('/register', UserController.register);
UserRouter.post('/login', UserController.login);

export {UserRouter};