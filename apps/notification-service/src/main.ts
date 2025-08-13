import {
  amqConnection,
  logger,
  selectedConfig,
} from '@hashtag.io-microservices/hashtag-common-utils';
import bodyParser from 'body-parser';
import express from 'express';

const app = express();
app.use(bodyParser.json());

const handleIncomingNotification = (msg: string) => {
  try {
    const parsedMessage = JSON.parse(msg);

    logger.info(
      `Received Notification: ${JSON.stringify(parsedMessage, null, 2)}`
    );

    // TODO: Implement forget password email notification
  } catch (error) {
    logger.error(
      `Error While Parsing the message: ${JSON.stringify(error, null, 2)}`
    );
  }
};

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to notification-service!' });
});

const port = selectedConfig.services.notificationService.port;

const server = app.listen(port, async () => {
  console.log(`Listening at http://localhost:${port}/api`);

  // handle password reset email notifications
  await amqConnection.subscribe(
    selectedConfig.queues.passwordResetQueue,
    // ['password.reset'], // binding key
    selectedConfig.routingKeys.passwordReset, // binding key
    handleIncomingNotification
  );
});

server.on('error', console.error);
