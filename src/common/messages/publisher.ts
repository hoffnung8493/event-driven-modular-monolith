import { RedisClientType } from 'redis'
import { Types } from 'mongoose'
import { createMessage, Message } from './service/models'
import { ClientGroups, Subjects } from './interfaces'

export interface PublisherInput {
  client: RedisClientType<any, any>
  clientGroup: ClientGroups
  parentId: Types.ObjectId
  operationId: Types.ObjectId
}

export const Publisher = <T extends Message<Subjects>>({
  client,
  clientGroup,
  operationId,
  parentId,
  subject,
}: {
  client: RedisClientType<any, any>
  clientGroup: ClientGroups
  operationId: Types.ObjectId
  parentId: Types.ObjectId
  subject: T['subject']
}) => {
  const receivedAt = new Date()
  return (data: T['data']) =>
    new Promise(async (resolve, reject) => {
      try {
        const eventId = new Types.ObjectId()
        await client.sendCommand([
          'XADD',
          subject,
          '*',
          'operationId',
          operationId.toHexString(),
          'eventId',
          eventId.toHexString(),
          'data',
          JSON.stringify(data),
        ])
        //@ts-ignore
        console.log(`Event!${process.env.PORT} - [${subject}]`)
        createMessage<Subjects, T>({
          _id: eventId,
          operationId,
          parentId,
          clientGroup,
          subject,
          data,
          receivedAt,
          publishedAt: new Date(),
          republish: [],
        })
        resolve({ eventId })
      } catch (err) {
        console.error(err)
        reject(err)
      }
    })
}
