# Event Driven Modular Monolith Boilerplate

## Problem

Backend start out simple, as a simple monolith. As more features are added, it quickly becomes very difficult to manage and productivity drops. The "trending" solution to this problem is micro service architecture.
Micro service architecture's decoupling is amazing but **decoupling causes a lot of complexities.**\
Therefore it is very difficult to achieve decoupling for small dev teams.

At a later stage, converting conventional monolith to micro services is very challenging.\
Many projects often fail this transition.

_How can we start with the "decoupled architecture" from the very beginning?_\
_What exactly causes the decoupling?_\
_How can we do this from the very beginning of a project with a small team? Just like the observer pattern(Redux, Mobx, etc. or Vuex for Vue) being used in almost every React projects._

## Solution

**Event Driven Modular Monolith** attempts to solve this issue.

### Modular Monolith

A module behaves very similarly to a microservice\
Each module is logically, fully decoupled and each module also has its own database.
The main difference is, rather than deplyong each module separetely, all modules are deployed as a single Node.js instance.

In terms of scaling, you just create multiple instances of the monolith by simply creating a Node.js cluster with PM2 (No Kubernetes needed)

![event-driven-monolith](https://github.com/hoffnung8493/event-driven-modular-monolith/blob/master/readme-assets/event-driven-monolith.png?raw=true)

### Event Driven Architecture

What makes micro services truly decoupled, is the Event Driven Architecture.
If microservices communicate via APIs, it would cause tight coupling between the servcies and easily become very complex.

<!-- For example the following would be a single /POST API to create an order in a standard e-commerce:
1. A client requests /POST Order to the order service.
2. Order service stores the order data in it's database.
3. Order service requests the inventory service
    1. Inventory service updates it's database
4. Order service requests the payment service
    1. Payment service requests external PG API to make
    2. Payment service stores new payment data in it's database
5. Order service requests the delivery service
    1. Delivery service requests external Delivery API to make an invoice.
    2. Delivery service stores the new invoice in it's database
6. returns a response to the client -->

If a single service or an external API failed, other coupled micro services would have to be rolled back. In other words the service that initiates the request becomes very **stateful**. It has to manage all the complex state of other coupled micro services.

With **Event Driven Architecture**, services communicate with each other via **events(messages)** and all the services become **stateless**. The message broker handles all the statefull part automatically.

This architecture has become very common with micro services.
But very few seem to realize that this can be applied equally to a monolith.

There are still significant amount of complexities with adopting event driven architecture, but most of it can be solved with a framework or just a boilerplate, which is why this project has been made.

![event-driven-architecture](https://github.com/hoffnung8493/event-driven-modular-monolith/blob/master/readme-assets/event-driven-architecture.png?raw=true)

## Boilerplate

Boilerplate details:

- Modular Monolith
  - Includes sample modules(User, Blog, Comment)
- Node.js Clustering
  - Process Manager - [PM2](https://pm2.keymetrics.io/)
- Event Driven Architecture
  - Message Broker - [Redis Stream](https://redis.io/topics/streams-intro)
  - Consumer Groups(for horizontal scaling) with acknowledgement
  - Retry Logic for 2 cases:
    - Unprocessed messages are requeued(retried) up to 5 times
    - Unprocessable messages are moved to Dead Letter Queue(DLQ)
      - After the issue is resolved, messages in DLQ can be replayed
- GraphQL([Apollo](https://www.apollographql.com/docs/apollo-server/))
  - N+1 solution - [dataloader](https://www.npmjs.com/package/dataloader)
- MongoDB
- Typescript
  - [GraphQL Codegen](https://www.graphql-code-generator.com/)
- Authentication
  - JWT, access & refresh Token

## Recommendation

Use managed services for stateful components. There are free versions.

- Mongodb: [Atlas](https://www.mongodb.com/atlas/database)
- Redis: [Redis Cloud](https://redis.com/redis-enterprise-cloud/overview/)

You can run your own MongoDB and Redis clusters if you are confident, but its always safer to use managed services for stateful components

###

## Quick Start

### Development Mode

1. Configure the environment variables
   1. Create `env_development.env`) file, next to the `package.json` file.
   2. Add your environment variables, where you have to replace the square brackets:
   ```
   ACCESS_TOKEN_SECRET=[your_access_token_secret]
   REFRESH_TOKEN_SECRET=[your_refresh_token_secret]
   PORT=[port]
   MONGO_URI=mongodb+srv://[username]:[password]@[host]/dbname?retryWrites=true&w=majority
   REDIS_URL=redis://[username]:[password]@[host]:[port]
   ```
2. `npm install`
3. `npm run dev`

### Production Mode

1. Configure the environment variables
   1. Create `env_production.env`) file, next to the `package.json` file.
   2. Add your environment variables, where you have to replace the square brackets:
   ```
   ACCESS_TOKEN_SECRET=[your_access_token_secret]
   REFRESH_TOKEN_SECRET=[your_refresh_token_secret]
   PORT=[port]
   MONGO_URI=mongodb+srv://[username]:[password]@[host]/dbname?retryWrites=true&w=majority
   REDIS_URL=redis://[username]:[password]@[host]:[port]
   ```
2. `npm install`
3. `sudo npm i -g pm2`
4. `npm run build`
5. `npm run start`
