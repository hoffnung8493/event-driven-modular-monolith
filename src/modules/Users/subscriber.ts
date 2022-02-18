import { RedisClientType } from 'redis'
import { BlogCreatedEvent, ClientGroups, Subjects, Subscriber } from '../../common'

export * from './graphql'
export const userSubscriberInit = async (client: RedisClientType<any, any>, consumerName: string) => {
  const subscribe = await Subscriber(client, ClientGroups.User, consumerName)
  subscribe<BlogCreatedEvent>(Subjects.BlogCreated, async (input) => {
    //do something here
  })
}
