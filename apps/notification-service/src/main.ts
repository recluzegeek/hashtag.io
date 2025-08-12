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

    console.log(`Received Notification`, parsedMessage);

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
  await amqConnection.consume(
    selectedConfig.queues.passwordResetQueue,
    handleIncomingNotification
  );
});

server.on('error', console.error);
