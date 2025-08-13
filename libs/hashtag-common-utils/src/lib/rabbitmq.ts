import client, { Channel, ChannelModel } from 'amqplib';
import { selectedConfig } from './config.js';
import { logger } from './logger.js';

// means the consume method expects a callback function that takes a string and returns anything.
type HandlerCB = (msg: string) => any;
// https://stackoverflow.com/questions/34058166/rabbitmq-consumer-getting-messages-of-different-routing-key
class RabbitMQConnection {
  connection!: ChannelModel;
  channel!: Channel;
  private connected = false;
  private exchangeName = selectedConfig.queues.exchangeName;
  private exchangeType = selectedConfig.queues.exchangeType;

  private async connect() {
    if (this.connected && this.channel) return;
    else this.connected = true;

    try {
      logger.info(`⌛️ Connecting to Rabbit-MQ Server`);

      //   this.connection = await client.connect(
      //     selectedConfig.services.rabbitmq.url
      //   );

      this.connection = await client.connect({
        protocol: selectedConfig.services.rabbitmq.protocol,
        hostname: selectedConfig.services.rabbitmq.host,
        port: selectedConfig.services.rabbitmq.port,
        frameMax: 0x2000,
        vhost: '/',
      });

      logger.debug(`Rabbit MQ Connection is ready`);

      this.channel = await this.connection.createChannel();

      logger.info(`🛸 Created RabbitMQ Channel successfully`);
    } catch (error) {
      logger.error(`Not connected to MQ Server`);
      throw error;
    }
  }

  // ch.publish publishes the message to an exchange, in contrasts with ch.sendToQueue which directly sends
  // messages to queues bypassing exchanges routing mechanism
  // In this scenario, we would want to adopt publish/subscribe instead of producer/consumer model

  // 1. Create connection
  // 2. Assert/declare exchange
  // 3. Assert/declare and bind queue, except when using direct or fanout exchange type
  // 4. Publish the message
  async publish(queue: string, routingKey: string, message: object) {
    try {
      if (!this.channel) {
        await this.connect();
      }

      await this.channel.assertExchange(this.exchangeName, this.exchangeType, {
        durable: true,
      });
      // await this.channel.assertQueue(queue, { durable: true });
      // await this.channel.bindQueue(queue, this.exchangeName, routingKey); // routing key here is binding key
      this.channel.publish(
        this.exchangeName,
        routingKey, // routing key here is routing key ...:)
        Buffer.from(JSON.stringify(message))
      );

      logger.info(
        `Message sent to queue "${queue}" with routing key "${routingKey}": ${JSON.stringify(
          message,
          null,
          2
        )}`
      );
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async subscribe(
    queue: string,
    routingKey: string,
    handleIncomingNotification: HandlerCB
  ) {
    try {
      if (!this.channel) {
        await this.connect();
      }

      await this.channel.assertExchange(this.exchangeName, this.exchangeType, {
        durable: true,
      });
      await this.channel.assertQueue(queue, { durable: true });
      // routingKeys.map(
      //   async (routingKey) =>
      //     await this.channel.bindQueue(queue, this.exchangeName, routingKey)
      // );
      console.debug(`Routing Key passed as arg ${routingKey}.`);
      await this.channel.bindQueue(queue, this.exchangeName, routingKey);

      await this.channel.consume(
        queue,
        async (msg) => {
          {
            if (!msg) {
              logger.error(`Invalid incoming message`);
              return;
            }
            handleIncomingNotification(msg?.content?.toString());
            logger.info(
              `Message received from "${queue}" queue with routing key "${
                msg.fields.routingKey
              }": ${JSON.stringify(
                JSON.parse(msg.content.toString()),
                null,
                2
              )}`
            );
            this.channel.ack(msg);
          }
        },
        {
          noAck: false,
        }
      );
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}

export const amqConnection = new RabbitMQConnection();
