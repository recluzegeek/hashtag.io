import client, { Channel, ChannelModel } from 'amqplib';
import { selectedConfig } from './config.js';
import { logger } from './logger.js';

// means the consume method expects a callback function that takes a string and returns anything.
type HandlerCB = (msg: string) => any;

class RabbitMQConnection {
  connection!: ChannelModel;
  channel!: Channel;
  private connected!: boolean;

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
      });

      logger.debug(`Rabbit MQ Connection is ready`);

      this.channel = await this.connection.createChannel();

      logger.info(`🛸 Created RabbitMQ Channel successfully`);
    } catch (error) {
      logger.error(`Not connected to MQ Server`);
      throw error;
    }
  }

  async sendToQueue(queue: string, message: object) {
    try {
      if (!this.channel) {
        await this.connect();
      }

      this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async consume(queue: string, handleIncomingNotification: HandlerCB) {
    try {
      if (!this.channel) {
        await this.connect();
      }

      await this.channel.assertQueue(queue, {
        durable: true,
      });

      this.channel.consume(
        queue,
        (msg) => {
          {
            if (!msg) {
              return console.error(`Invalid incoming message`);
            }
            handleIncomingNotification(msg?.content?.toString());
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
