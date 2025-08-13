## 🧠 Overview of Services

You'll split your project into these **core services**:

- **User Service** (auth, profile, account settings)
- **Notification Service**
- **Group Service**
- **Post Service**
- **API Gateway** (routing + authentication middleware)
- **Frontend** (React + TypeScript + TailwindCSS)

You’ll use:

- **MongoDB** for storage
- **RabbitMQ / Kafka (optional)** for messaging (e.g., notifications)
- **Docker** for isolated services
- **JWT** for auth
- **Nginx** (optional, for gateway proxying)

---

## 🗓️ 10-Day Migration Plan

---

### ✅ **Day 1: Project Setup & Planning**

- Initialize **monorepo** using `Turborepo`, `Nx`, or plain folder structure.
- Set up folder structure:

  ```
  /user-service
  /group-service
  /post-service
  /notification-service
  /api-gateway
  /frontend
  /shared (for DTOs, utils, types)
  /docker (docker-compose, mongo, rabbitmq etc.)
  ```

- Set up **TypeScript** in each Node service.
- Initialize `tsconfig.json`, `eslint`, `prettier`.
- Setup **basic Docker Compose**:

  - MongoDB
  - Redis (optional, for caching or session)
  - RabbitMQ/Kafka (optional, for async notification events)
  - Node containers

---

### ✅ **Day 2: Authentication & User Service**

- Implement `user-service`:

  - Routes: `signup`, `login`, `logout`, `verify email`, `forgot password`
  - Use **JWT**, store hashed passwords with bcrypt
  - MongoDB schemas: `User`, `LoginSession`

- Integrate email sending logic (use Mailtrap for testing)
- Setup proper DTOs for request/response
- Test user registration/login
- Add some fake users

---

### ✅ **Day 3: API Gateway Setup**

- Build **API Gateway** (Express or Fastify with TypeScript):

  - Route requests to microservices using reverse proxy logic
  - Centralized **JWT validation middleware**
  - Use `http-proxy-middleware` or `express-http-proxy`
  - Basic routes setup:

    - `/api/users/*` → user-service
    - `/api/posts/*` → post-service
    - `/api/groups/*` → group-service

---

### ✅ **Day 4: Post Service**

- Build `post-service`:

  - Models: `Post`, `Comment`, `Like`, `Share`
  - CRUD for posts: create, edit, delete, share, comment
  - Uploads: Use `Multer` or cloud (S3, Cloudinary) for media
  - Handle mentions, hashtags (you can index hashtags as a separate collection)

- Add sample post creation & feed listing

---

### ✅ **Day 5: Notification Service**

- Create `notification-service`:

  - MongoDB Models: `Notification` (with `user`, `type`, `data`)
  - Event types: post liked, comment, follow, group invite
  - Build REST endpoint to list notifications

- Use event-driven messaging (optional):

  - Emit events from post/user/group → consume in notification service

---

### ✅ **Day 6: Group Service**

- Implement `group-service`:

  - Models: `Group`, `GroupMember`, `GroupMessage`
  - Endpoints: create group, join/leave, invite, post in group

- Implement group settings (avatar, privacy, admin)

---

### ✅ **Day 7: Frontend Setup (React + TS + Tailwind)**

- Initialize with `Vite` + React + TypeScript + TailwindCSS
- Setup project-wide theme, reusable components:

  - Button, Input, Modal, Navbar

- Add routes: login, register, home, profile, notifications
- Setup React Query or TanStack Query for API calls
- Auth context with JWT handling
- Connect to API Gateway

---

### ✅ **Day 8: Implement Feed, Profile, and Groups (Frontend)**

- **Feed** page:

  - List posts
  - Like, comment, share

- **Profile** page:

  - View user profile, posts
  - Follow/unfollow

- **Groups**:

  - Join, view, create, invite

---

### ✅ **Day 9: Messaging & Conversations**

- Add private & group conversation features:

  - Can use WebSocket or polling for real-time
  - Models: `Conversation`, `Message`
  - Add emoji, image, and text support

- Frontend UI for messaging
- Add message CRUD

---

### ✅ **Day 10: Polish, Test, Deploy**

- Finalize:

  - Styling with Tailwind
  - Responsive layout
  - Error handling, form validation
  - Optimize Docker setup
  - Add unit tests (Jest or Vitest)

- Deploy:

  - Use **Railway**, **Render**, or **Docker on VPS**
  - Use environment variables for services

---

## 🔁 Stretch Features (Post Day 10)

- Real-time notifications (via WebSocket)
- Admin dashboard
- Advanced analytics (views, engagement)
- Activity log
- Multi-language support

---

## 📦 Tech Stack Summary

| Service    | Tech                             |
| ---------- | -------------------------------- |
| Frontend   | React + TypeScript + TailwindCSS |
| Backend    | Node.js + Express + TypeScript   |
| DB         | MongoDB (Mongoose)               |
| Messaging  | RabbitMQ / Kafka (optional)      |
| Gateway    | API Gateway w/ Express Proxy     |
| Deployment | Docker Compose, Railway/Render   |
| Auth       | JWT + Bcrypt + Email verify      |

---

Nice! You’re designing a clean, scalable architecture for your monorepo with microservices — love it. Here’s a recommended **overall workflow and architecture** for handling forgot password emails using your Nx monorepo, message brokers, and microservices:

---

## Suggested Architecture & Workflow

### 1. **User-Service (Auth Service)**

- Handles user-related logic: login, registration, password reset request.
- When a user requests a password reset:

  - Generate the reset token.
  - Save it on user document.
  - Instead of sending email directly, **publish a message to a message broker** (Kafka/Redis/RabbitMQ) with the email details (recipient, subject, token, etc).
  - Return a response immediately to the client — no waiting for email to send.

### 2. **Message Broker (Kafka, Redis Streams, RabbitMQ, etc)**

- Acts as a **queue** to decouple user-service from notification-service.
- Holds email jobs/events.
- Ensures reliability, retry, ordering, and scaling.

### 3. **Notification-Service (Email Service)**

- A dedicated microservice that:

  - Listens to the message broker queue/topic for email tasks.
  - Processes each email job asynchronously.
  - Sends the actual email (via SMTP, SendGrid, SES, etc).
  - Optionally logs or updates status in DB.

- Built with Express or any backend framework, deployed independently.
- Can also handle other notifications (SMS, push, etc) in the future.

### 4. **Common-UI (React)**

- Contains shared UI components (e.g., forgot password form).
- Used by frontend apps or admin dashboards.
- Independent from backend logic, no direct coupling to email flow.

---

## Visual Workflow

```
[Client] --POST /forgot-password--> [User-Service]
     |
     |-- Generate token & save
     |-- Publish message to Kafka: { email, resetToken }
     |
[Message Broker (Kafka)] --message--> [Notification-Service]
                                      |
                                      |-- Send email with reset link/token
                                      |
                                 (optional: update status, logs)
```

---

## Why this workflow?

- **Decouples services**: User service doesn’t wait for email to be sent.
- **Scalable**: Notification service can scale independently.
- **Resilient**: Message brokers handle retries, durability.
- **Extensible**: Easy to add other notification types or consumers.
- **Clean separation of concerns**: User service handles auth, notification service handles messaging.

---

## Implementation tips

- Use **Kafka** if you want strong ordering, partitions, and complex event streaming.
- Use **Redis Streams** or **RabbitMQ** if you want simpler setup or lightweight queueing.
- In User-Service:

  - Create a producer client to publish email messages.

- In Notification-Service:

  - Create a consumer client to listen and process email messages.

- Use environment variables for configs (broker URLs, SMTP creds).
- Use Nx to keep user-service and notification-service in the same monorepo but separate apps/libs.
- Write shared interfaces/types for messages in a common lib inside Nx.

---

## Bonus: How a forgot password token email message might look

```json
{
  "type": "forgotPassword",
  "payload": {
    "email": "user@example.com",
    "resetToken": "abc123",
    "resetUrl": "https://yourfrontend.com/reset-password?token=abc123"
  }
}
```

---

### Would you like me to help you write a sample Kafka producer/consumer or the message interfaces inside Nx?

Or how to wire your services and message broker?

---

2025-08-13 02:36:59 [info]: Message sent to queue "notification.email.password" with routing key "password.forget": {  
 "email": "recluse@gmail.com",
"resetToken": "876011292a507c6acef816f5067aa1d496f5635b",
"resetUrl": "http://localhost:3500/reset/876011292a507c6acef816f5067aa1d496f5635b"
}
2025-08-13 02:36:59 [info]: Token "876011292a507c6acef816f5067aa1d496f5635b" sent to email: recluse@gmail.com

NX Successfully ran target build for project @hashtag.io-microservices/notification-service and 2 tasks it depends on
Nx read the output from the cache instead of running the command for 1 out of 3 tasks.
2025-08-13 02:36:59 [info]: Message received to queue "notification.email.password" with routing key "password.reset": "{\"email\":\"recluse@gmail.com\",\"resetToken\":\"876011292a507c6acef816f5067aa1d496f5635b\",\"resetUrl\":\"http://localhost:3500/reset/876011292a507c6acef816f5067aa1d496f5635b\"}"

import client, { Channel, ChannelModel } from 'amqplib';
import { selectedConfig } from './config.js';
import { logger } from './logger.js';

// means the consume method expects a callback function that takes a string and returns anything.
type HandlerCB = (msg: string) => any;

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
      await this.channel.assertQueue(queue, { durable: true });
      await this.channel.bindQueue(queue, this.exchangeName, routingKey); // routing key here is binding key
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
              `Message received from "${queue}" queue with routing key "${routingKey}": ${JSON.stringify(
                msg.content.toString(),
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

    await amqConnection.publish(
      selectedConfig.queues.passwordResetQueue,
      'password.forget', // routing key
      payload
    );

const server = app.listen(port, async () => {
console.log(`Listening at http://localhost:${port}/api`);

// handle password reset email notifications
await amqConnection.subscribe(
selectedConfig.queues.passwordResetQueue,
// ['password.reset'], // binding key
'password.reset', // binding key
handleIncomingNotification
);
});

how's this possible? that amqlib is routing incorrectly?

NODE_ENV=development

API_GATEWAY_HOST=localhost
API_GATEWAY_PORT=3100

FRONTEND_SERVING_HOST=localhost
FRONTEND_SERVING_PORT=4200

FRONTEND_PREVIEW_HOST=localhost
FRONTEND_PREVIEW_PORT=4300

GROUP_SERVICE_HOST=localhost
GROUP_SERVICE_PORT=3200

NOTIFICATION_SERVICE_HOST=localhost
NOTIFICATION_SERVICE_PORT=3300

POST_SERVICE_HOST=localhost
POST_SERVICE_PORT=3400

USER_SERVICE_HOST=localhost
USER_SERVICE_PORT=3500

RABBITMQ_SERVICE_HOST=localhost
RABBITMQ_SERVICE_PORT=5672

EXCHANGE_NAME=hashtag.io
EXCHANGE_TYPE=direct

PASSWORD_RESET_QUEUE=notification.email.password  
WELCOME_EMAIL_QUEUE=notification.email.welcome

ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=

import {
type QueuesConfig,
queuesConfig,
type SecretsConfig,
secretsConfig,
type ServicesConfig,
servicesConfig,
} from './services.config.js';

interface AppConfig {
server: ServerConfig;
database: DatabaseConfig;
queues: QueuesConfig;
services: ServicesConfig;
secrets: SecretsConfig;
isDev: boolean;
isProd: boolean;
}

interface DatabaseConfig {
url: string;
}

interface ServerConfig {
port: number | string;
hostname: string;
}

const env = (process.env.NODE_ENV || 'development') as
| 'development'
| 'production';

const config: Record<
'development' | 'production',
Omit<AppConfig, 'isDev' | 'isProd'>

> = {
> development: {

    server: {
      port: process.env.PORT || 3000,
      hostname: process.env.HOSTNAME || 'localhost',
    },
    database: {
      url: `mongodb://${process.env.DB_HOST || 'localhost'}:${
        process.env.DB_PORT || 27017
      }/${process.env.DB_NAME || 'hashtag_dev'}`,
    },
    services: servicesConfig,
    secrets: secretsConfig,
    queues: queuesConfig,

},
production: {
server: {
port: process.env.PORT || 3200,
hostname: process.env.HOSTNAME || 'localhost',
},
database: {
url: `mongodb://${process.env.DB_HOST || 'localhost'}:${
        process.env.DB_PORT || 27017
      }/${process.env.DB_NAME || 'hashtag_prod'}`,
},
services: servicesConfig,
secrets: secretsConfig,
queues: queuesConfig,
},
};

export const selectedConfig: AppConfig = {
...config[env],
isDev: env === 'development',
isProd: env === 'production',
};

export interface QueuesConfig {
exchangeName: string;
exchangeType: string;
passwordResetQueue: string;
welcomeEmailQueue: string;
}

export interface ServiceEndpoint {
protocol: string;
host: string;
port: number;
url: string;
}

export interface NotificationConfig {
name: string;
}

export interface ServicesConfig {
userService: ServiceEndpoint;
postService: ServiceEndpoint;
groupService: ServiceEndpoint;
notificationService: ServiceEndpoint;
apiGateway: ServiceEndpoint;
frontend: ServiceEndpoint;
frontendPreview: ServiceEndpoint;
rabbitmq: ServiceEndpoint;
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
defaultPort: number,
protocol = 'http'
): ServiceEndpoint {
const host = parseHost(hostEnv, 'localhost');
const port = parsePort(portEnv, defaultPort);
const url = `${protocol}://${host}:${port}`;
return { protocol, host, port, url };
}

const queuesConfig: QueuesConfig = {
exchangeName: process.env.EXCHANGE_NAME || 'hashtag.io',
exchangeType: process.env.EXCHANGE_TYPE || 'direct',
passwordResetQueue:
process.env.PASSWORD_RESET_QUEUE || 'notification.email.password',
welcomeEmailQueue:
process.env.WELCOME_EMAIL_QUEUE || 'notification.email.welcome',
};

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
rabbitmq: createServiceEndpoint(
process.env.RABBITMQ_SERVICE_HOST,
process.env.RABBITMQ_SERVICE_PORT,
5672,
'amqp'
),
};

const secretsConfig: SecretsConfig = {
accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || '',
refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || '',
};

export { queuesConfig, secretsConfig, servicesConfig };

const handleIncomingNotification = (msg: string) => {
try {
const parsedMessage = JSON.parse(msg);

    // logger.info(
    //   `Received Notification: ${JSON.stringify(parsedMessage, null, 2)}`
    // );

    // TODO: Implement forget password email notification

} catch (error) {
logger.error(
`Error While Parsing the message: ${JSON.stringify(error, null, 2)}`
);
}
};
