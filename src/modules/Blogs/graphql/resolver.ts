import { MutationResolvers, QueryResolvers, BlogUserNestedResolvers } from '../../../graphql/__generatedTypes__'
import { Blog } from '../models'
import { AuthenticationError } from 'apollo-server-errors'
import { blogCreate } from '../functions'
import { ClientGroups } from '../../../interfaces'
import { operationErrorCreate } from 'event-driven'
import { RedisClientType } from 'redis'

export const blogResolvers = (
  client: RedisClientType<any, any>,
  clientGroup: ClientGroups
): { BlogUserNested: BlogUserNestedResolvers; Query: QueryResolvers; Mutation: MutationResolvers } => ({
  BlogUserNested: {
    user: async (pV, _, { userLoader }) => userLoader.load(pV.id),
  },
  Query: {
    blogs: async () => Blog.find({}),
    blog: async (_, { id }, { blogLoader }) => blogLoader.load(id),
  },
  Mutation: {
    blogCreate: async (_, { title, content }, { userId, userLoader, operationId }) => {
      if (!userId) throw new AuthenticationError('You are not logged in.')
      //this is not recommeded because it causes coupling with the user service.
      //rather you could duplicate user collection via event sourcing
      const user = await userLoader.load(userId)
      try {
        const blog = blogCreate({
          client,
          clientGroup,
          parentId: operationId,
          operationId,
          args: {
            title,
            content,
            user: { _id: user._id, username: user.username, firstName: user.firstName, lastName: user.lastName },
          },
        })
        return blog
      } catch (error) {
        operationErrorCreate({ operationId, error })
        throw error
      }
    },
  },
})
