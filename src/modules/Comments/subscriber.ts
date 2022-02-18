import { RedisClientType } from 'redis'
import { ClientGroups, Subjects, Subscriber, UserNameUpdatedEvent } from '../../common'
import { commentUserUpdate } from './publishers'
export * from './graphql'
export const commentSubscriberInit = async (client: RedisClientType<any, any>, consumerName: string) => {
  const subscribe = await Subscriber(client, ClientGroups.Comment, consumerName)
  subscribe<UserNameUpdatedEvent>(Subjects.UserNameUpdated, async (input) =>
    commentUserUpdate({ ...input, args: { user: input.args } })
  )
}
