## 🧠 Overview of Services

You'll split your project into these **core services**:

* **User Service** (auth, profile, account settings)
* **Notification Service**
* **Group Service**
* **Post Service**
* **API Gateway** (routing + authentication middleware)
* **Frontend** (React + TypeScript + TailwindCSS)

You’ll use:

* **MongoDB** for storage
* **RabbitMQ / Kafka (optional)** for messaging (e.g., notifications)
* **Docker** for isolated services
* **JWT** for auth
* **Nginx** (optional, for gateway proxying)

---

## 🗓️ 10-Day Migration Plan

---

### ✅ **Day 1: Project Setup & Planning**

* Initialize **monorepo** using `Turborepo`, `Nx`, or plain folder structure.
* Set up folder structure:

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
* Set up **TypeScript** in each Node service.
* Initialize `tsconfig.json`, `eslint`, `prettier`.
* Setup **basic Docker Compose**:

  * MongoDB
  * Redis (optional, for caching or session)
  * RabbitMQ/Kafka (optional, for async notification events)
  * Node containers

---

### ✅ **Day 2: Authentication & User Service**

* Implement `user-service`:

  * Routes: `signup`, `login`, `logout`, `verify email`, `forgot password`
  * Use **JWT**, store hashed passwords with bcrypt
  * MongoDB schemas: `User`, `LoginSession`
* Integrate email sending logic (use Mailtrap for testing)
* Setup proper DTOs for request/response
* Test user registration/login
* Add some fake users

---

### ✅ **Day 3: API Gateway Setup**

* Build **API Gateway** (Express or Fastify with TypeScript):

  * Route requests to microservices using reverse proxy logic
  * Centralized **JWT validation middleware**
  * Use `http-proxy-middleware` or `express-http-proxy`
  * Basic routes setup:

    * `/api/users/*` → user-service
    * `/api/posts/*` → post-service
    * `/api/groups/*` → group-service

---

### ✅ **Day 4: Post Service**

* Build `post-service`:

  * Models: `Post`, `Comment`, `Like`, `Share`
  * CRUD for posts: create, edit, delete, share, comment
  * Uploads: Use `Multer` or cloud (S3, Cloudinary) for media
  * Handle mentions, hashtags (you can index hashtags as a separate collection)
* Add sample post creation & feed listing

---

### ✅ **Day 5: Notification Service**

* Create `notification-service`:

  * MongoDB Models: `Notification` (with `user`, `type`, `data`)
  * Event types: post liked, comment, follow, group invite
  * Build REST endpoint to list notifications
* Use event-driven messaging (optional):

  * Emit events from post/user/group → consume in notification service

---

### ✅ **Day 6: Group Service**

* Implement `group-service`:

  * Models: `Group`, `GroupMember`, `GroupMessage`
  * Endpoints: create group, join/leave, invite, post in group
* Implement group settings (avatar, privacy, admin)

---

### ✅ **Day 7: Frontend Setup (React + TS + Tailwind)**

* Initialize with `Vite` + React + TypeScript + TailwindCSS
* Setup project-wide theme, reusable components:

  * Button, Input, Modal, Navbar
* Add routes: login, register, home, profile, notifications
* Setup React Query or TanStack Query for API calls
* Auth context with JWT handling
* Connect to API Gateway

---

### ✅ **Day 8: Implement Feed, Profile, and Groups (Frontend)**

* **Feed** page:

  * List posts
  * Like, comment, share
* **Profile** page:

  * View user profile, posts
  * Follow/unfollow
* **Groups**:

  * Join, view, create, invite

---

### ✅ **Day 9: Messaging & Conversations**

* Add private & group conversation features:

  * Can use WebSocket or polling for real-time
  * Models: `Conversation`, `Message`
  * Add emoji, image, and text support
* Frontend UI for messaging
* Add message CRUD

---

### ✅ **Day 10: Polish, Test, Deploy**

* Finalize:

  * Styling with Tailwind
  * Responsive layout
  * Error handling, form validation
  * Optimize Docker setup
  * Add unit tests (Jest or Vitest)
* Deploy:

  * Use **Railway**, **Render**, or **Docker on VPS**
  * Use environment variables for services

---

## 🔁 Stretch Features (Post Day 10)

* Real-time notifications (via WebSocket)
* Admin dashboard
* Advanced analytics (views, engagement)
* Activity log
* Multi-language support

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

