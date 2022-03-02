import { RedisClientType } from 'redis'
import { Subscriber } from 'event-driven'
import { ClientGroups } from '../../interfaces'

export * from './graphql'
export const userSubscriberInit = async (client: RedisClientType<any, any>, consumerName: string) => {
  const subscribe = await Subscriber(client, ClientGroups.User, consumerName)
}
