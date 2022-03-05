# Event Driven Modular Monolith Boilerplate

## Problem

Backend start out simple, as a simple monolith. As more features are added, it quickly becomes very difficult to manage and productivity drops. The "trending" solution to this problem is micro service architecture.
Micro service architecture's decoupling is amazing but **decoupling causes a lot of complexities.**\
Therefore it is very difficult to achieve decoupling for small dev teams.

At a later stage, converting conventional monolith to micro services is very challenging.\
Many projects often fail this transition.

_How can we start with the "decoupled architecture" from the very beginning?_\
_What exactly causes the decoupling?_

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
  - Each module has its own isolated database(not necessarily different virtual machine)
- Node.js Clustering
  - Process Manager - [PM2](https://pm2.keymetrics.io/)
- Cron Jobs
  - Each module has a `cronjobs` folder.
  - Even with Node.js Clustering(multiple instances), cron jobs will not be duplicated. Only one of the instance will execute the cronjob.
- Event Driven Architecture
  - [Event Driven](https://www.npmjs.com/package/event-driven) libary encapsulates event store & message broker logic. It uses [Redis Stream](https://redis.io/topics/streams-intro) internally for the message broker and MongoDB for event store.
- GraphQL([Apollo Server](https://www.apollographql.com/docs/apollo-server/))
  - N+1 solution - [dataloader](https://www.npmjs.com/package/dataloader)
  - While there are multiple modules, only a single unified graphql endpoint is shared to the client. This can be applied for event driven microservices as well, by using [Apollo Federation](https://www.apollographql.com/docs/federation/)
- MongoDB
  - In modular architecture(or microservices) and with GraphQL, data processing(ex. JOINs) tend to happen in the backend, rather than in database with complex heavy queries. Natrually MongoDB is a better fit than relational databases.
  - Event store uses MongoDB, so the database could be shared.
- Typescript
  - [GraphQL Codegen](https://www.graphql-code-generator.com/) for end to end type checking from database model to GraphQL end point. (And also for client, but client code is not included in this boilerplate)
- Authentication
  - JWT, access & refresh token

## Recommendation

Use managed services for stateful components. There are free versions.

- Mongodb: [Atlas](https://www.mongodb.com/atlas/database)
- Redis: [Redis Cloud](https://redis.com/redis-enterprise-cloud/overview/)

You can run your own MongoDB and Redis clusters if you are confident, but its always safer to use managed services for stateful components

###

## Quick Start

### Development Mode

The backend is a simple blog service. Lets create a user and with this user create a blog post and also a comment to the same blog with the same user. Both blog and comment documents nest user's name.(check the blog and comment model). Now when we update the user's name, it will generate an `user-nameUpdated` event. Both blog and comment module are subscribed to this event, where each module updates the nested names accordingly.

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
4. See events in action:
   1. go to [graphql playground](http://localhost:4000/graphql)
   2. create a user by executing the `userRegister` mutation. It will return return an `accessToken`. Store this token in the header `Authorization=Bearer [accessToken]`
   3. create a blog by executing the `blogCreate` mutation.
   4. create a comment by executing the `commentCreate` mutation.
   5. update user's name by executing the `userUpdateNames` mutation.
   6. check the terminal!
   ```
   Event! - [User-nameUpdated]
   Event! - [Comment-userUpdated]
   Event! - [Blog-userUpdated]
   ```
   ![event-chain](https://github.com/hoffnung8493/event-driven-modular-monolith/blob/master/readme-assets/event-chain.png?raw=true)
   The full event chain can also be visualized in event management client.

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
