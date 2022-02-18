import { ClientGroups, Subjects, Subscriber, UserNameUpdatedEvent, UserRegisteredEvent } from '../../common'
import { blogUserDuplicate, blogUserUpdate } from './publishers'
import { RedisClientType } from 'redis'

export * from './graphql'
export const blogSubscriberInit = async (client: RedisClientType<any, any>, consumerName: string) => {
  const subscribe = await Subscriber(client, ClientGroups.Blog, consumerName)
  subscribe<UserNameUpdatedEvent>(Subjects.UserNameUpdated, (input) => blogUserUpdate({ ...input, args: { user: input.args } }))
  subscribe<UserRegisteredEvent>(Subjects.UserRegistered, (input) =>
    blogUserDuplicate({ ...input, args: { user: { _id: input.args._id, username: input.args.username } } })
  )
}
