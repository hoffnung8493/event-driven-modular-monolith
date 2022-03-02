import http from 'http'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { MyContext } from './graphql/context'
import { dataLoaderInit } from './utils/dataloader'
import { operationInit, applyMiddleware } from 'event-driven'
import { verify } from 'jsonwebtoken'
import { merge } from 'lodash'
import { commonSchema } from './graphql/schema'
import { userSchema, userResolvers, blogSchema, blogResolvers, commentSchema, commentResolvers } from './modules'
import { ClientGroups } from './interfaces'
import { RedisClientType } from 'redis'
import cors from 'cors'
import { Types } from 'mongoose'

interface IServer {
  PORT: number
  ACCESS_TOKEN_SECRET: string
  redis: RedisClientType<any, any>
}

declare module 'express' {
  export interface Request {
    admin?: { id: string; authorized: boolean }
  }
}

export const connectServer = async (config: IServer) => {
  const app = express()
  app.use(cors())
  app.use(express.json())
  applyMiddleware(app, config.ACCESS_TOKEN_SECRET, config.redis)

  const httpServer = http.createServer(app)

  const typeDefs = [commonSchema, userSchema, blogSchema, commentSchema]
  const resolvers = merge(
    {},
    userResolvers(config.redis, ClientGroups.User),
    blogResolvers(config.redis, ClientGroups.Blog),
    commentResolvers(config.redis, ClientGroups.Comment)
  )

  const authenticate = (req: express.Request, ACCESS_TOKEN_SECRET: string) => {
    const token = req.headers.authorization
    if (!token) throw new Error('Unauthenticated')
    let accessToken = token.split(' ')[1]
    if (!accessToken) throw new Error('Unauthenticated')
    const decoded = verify(accessToken, ACCESS_TOKEN_SECRET) as {
      userId: string
    }
    return decoded
  }

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      try {
        const { userId } = authenticate(req, config.ACCESS_TOKEN_SECRET)
        const context: MyContext = {
          operationId: operationInit(req, new Types.ObjectId(userId)),
          ...dataLoaderInit(),
          userId,
        }
        return context
      } catch (err) {
        const context: MyContext = {
          operationId: operationInit(req),
          ...dataLoaderInit(),
        }
        return context
      }
    },
  })

  await apolloServer.start()
  apolloServer.applyMiddleware({ app, path: '/graphql' })
  await new Promise<void>((resolve) => httpServer.listen({ port: config.PORT }, resolve))
  console.log(`🚀 Server ready at http://localhost:${config.PORT}${apolloServer.graphqlPath}\n`)
}
