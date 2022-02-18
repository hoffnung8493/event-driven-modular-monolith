import { MutationResolvers, QueryResolvers } from '../../../common/graphql/__generatedTypes__'
import { User, UserDoc } from '../models'
import { UserInputError } from 'apollo-server-express'
import { compare, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { userRegister, userUpdateNames } from '../publishers'
import { ClientGroups } from '../../../common'
import { operationErrorCreate } from '../../../common/messages/service/models'
import { RedisClientType } from 'redis'

export const userResolvers = (
  client: RedisClientType<any, any>,
  clientGroup: ClientGroups
): { Mutation: MutationResolvers; Query: QueryResolvers } => ({
  Query: {
    user: async (_, { id }, { userLoader }) => userLoader.load(id),
    users: async (_, { ids }, { userLoader }) => {
      const users = await userLoader.loadMany(ids)
      return users.filter((v) => !(v instanceof Error)) as UserDoc[]
    },
  },
  Mutation: {
    userRegister: async (_, { username, password, firstName, lastName }, { operationId }) => {
      if (username.trim().length < 3) throw new UserInputError('Username must be at least 3 characters long')
      if (password.length < 8) throw new UserInputError('Password must be at least 7 characters long')
      const existingUser = await User.findOne({ username: username.toLowerCase() })
      if (existingUser) throw new UserInputError('This username is already taken.')
      const hashedPassword = await hash(password, 10)
      try {
        const user = await userRegister({
          client,
          clientGroup,
          parentId: operationId,
          operationId,
          input: {
            username: username.toLowerCase().trim(),
            hashedPassword,
            firstName,
            lastName,
          },
        })
        return createTokens(user)
      } catch (error) {
        operationErrorCreate({ operationId, error })
        throw error
      }
    },
    userLogin: async (_, { username, password }, { operationId }) => {
      try {
        const user = await User.findOne({ username: username.toLowerCase().trim() })
        if (!user) throw new UserInputError(`Cannot find user with username of ${username}`)
        if (process.env.NODE_ENV === 'production' && !(await compare(password, user.hashedPassword)))
          throw new UserInputError('Username or password is incorrect')
        return createTokens(user)
      } catch (error) {
        operationErrorCreate({ operationId, error })
        throw error
      }
    },
    userUpdateNames: async (_, { firstName, lastName }, { userId, operationId }) => {
      if (!userId) throw new Error('You are not logged in.')
      return userUpdateNames({ client, clientGroup, parentId: operationId, operationId, input: { userId, firstName, lastName } })
    },
  },
})

const createTokens = (user: UserDoc) => {
  const tokenBody = { userId: user.id }
  const accessToken = sign(tokenBody, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '12h' })
  const refreshToken = sign(tokenBody, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '1y' })
  return {
    accessToken,
    refreshToken,
    user,
  }
}
