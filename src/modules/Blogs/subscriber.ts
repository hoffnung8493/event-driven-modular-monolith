import { Subscriber } from 'event-driven'
import { ClientGroups, Subjects, UserNameUpdatedEvent, UserRegisteredEvent } from '../../interfaces'
import { blogUserDuplicate, blogUserUpdate } from './functions'
import { RedisClientType } from 'redis'

export * from './graphql'
export const blogSubscriberInit = async (client: RedisClientType<any, any>, consumerName: string) => {
  const subscribe = await Subscriber(client, ClientGroups.Blog, consumerName)
  subscribe<UserNameUpdatedEvent>({
    subject: Subjects.UserNameUpdated,
    publishingSubject: Subjects.BlogUserUpdated,
    eventHandler: (input) => blogUserUpdate({ ...input, args: { user: input.args } }),
  })
  subscribe<UserRegisteredEvent>({
    subject: Subjects.UserRegistered,
    publishingSubject: Subjects.BlogUserDuplicated,
    eventHandler: (input) =>
      blogUserDuplicate({ ...input, args: { user: { _id: input.args._id, username: input.args.username } } }),
  })
}
