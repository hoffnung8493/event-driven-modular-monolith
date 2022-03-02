import { RedisClientType } from 'redis'
import { Subscriber } from 'event-driven'
import { commentUserUpdate } from './functions'
import { ClientGroups, Subjects, UserNameUpdatedEvent } from '../../interfaces'
export * from './graphql'
export const commentSubscriberInit = async (client: RedisClientType<any, any>, consumerName: string) => {
  const subscribe = await Subscriber(client, ClientGroups.Comment, consumerName)
  subscribe<UserNameUpdatedEvent>({
    subject: Subjects.UserNameUpdated,
    publishingSubject: Subjects.CommentUserUpdated,
    eventHandler: async (input) => commentUserUpdate({ ...input, args: { user: input.args } }),
  })
}
