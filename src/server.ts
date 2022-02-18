import http from 'http'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { MyContext } from './common/graphql/context'
import { userLoader, blogLoader } from './utils/dataloader'
import { operationInit } from './common/messages'
import { verify } from 'jsonwebtoken'
import { merge } from 'lodash'
import { commonSchema } from './common/graphql/schema'
import { userSchema, userResolvers, blogSchema, blogResolvers, commentSchema, commentResolvers } from './modules'
import { ClientGroups, errorRouter, infoRouter } from './common'
import { RedisClientType } from 'redis'

interface IServer {
  PORT: number
  ACCESS_TOKEN_SECRET: string
  redis: RedisClientType<any, any>
}

export const connectServer = async (config: IServer) => {
  const app = express()
  app.use('/stream-api/errors', errorRouter(config.redis))
  app.use('/stream-api/info', infoRouter(config.redis))

  const httpServer = http.createServer(app)

  const apolloServer = new ApolloServer({
    typeDefs: [commonSchema, userSchema, blogSchema, commentSchema],
    resolvers: merge(
      {},
      userResolvers(config.redis, ClientGroups.User),
      blogResolvers(config.redis, ClientGroups.Blog),
      commentResolvers(config.redis, ClientGroups.Comment)
    ),
    context: ({ req }) => {
      const context: MyContext = {
        operationId: operationInit(req),
        userLoader: userLoader(),
        blogLoader: blogLoader(),
      }
      try {
        const token = req.headers.authorization
        if (!token) return context
        let accessToken = token.split(' ')[1]
        if (!accessToken) return context
        const decoded = verify(accessToken, config.ACCESS_TOKEN_SECRET) as {
          userId: string
        }
        if (decoded) return { ...context, userId: decoded.userId }
        else return context
      } catch (err) {
        return context
      }
    },
  })

  await apolloServer.start()
  apolloServer.applyMiddleware({ app, path: '/' })
  await new Promise<void>((resolve) => httpServer.listen({ port: config.PORT }, resolve))
  console.log(`🚀 Server ready at http://localhost:${config.PORT}${apolloServer.graphqlPath}\n`)
}
