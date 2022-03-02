import { MutationResolvers, QueryResolvers, CommentUserNestedResolvers } from '../../../graphql/__generatedTypes__'
import { Comment } from '../models'
import { AuthenticationError } from 'apollo-server-errors'
import { commentCreate } from '../functions'
import { ClientGroups } from '../../../interfaces'
import { operationErrorCreate } from 'event-driven'
import { RedisClientType } from 'redis'

export const commentResolvers = (
  client: RedisClientType<any, any>,
  clientGroup: ClientGroups
): { CommentUserNested: CommentUserNestedResolvers; Query: QueryResolvers; Mutation: MutationResolvers } => ({
  CommentUserNested: {
    user: async (pV, _, { userLoader }) => userLoader.load(pV.id),
  },
  Query: {
    comments: async (_, { blogId }) => Comment.find({ blogId }),
  },
  Mutation: {
    commentCreate: async (_, { blogId, content }, { userId, userLoader, operationId }) => {
      if (!userId) throw new AuthenticationError('You are not logged in.')
      const user = await userLoader.load(userId)
      try {
        const comment = commentCreate({
          client,
          clientGroup,
          parentId: operationId,
          operationId,
          args: {
            blogId,
            content,
            user: { _id: user._id, username: user.username, firstName: user.firstName, lastName: user.lastName },
          },
        })
        return comment
      } catch (error) {
        operationErrorCreate({ operationId, error })
        throw error
      }
    },
  },
})
