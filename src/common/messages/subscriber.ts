import { createMessageError, Message, MessageError } from './service/models'
import { Types } from 'mongoose'
import { ClientGroups, Subjects } from './interfaces'
import { RedisClientType } from 'redis'
import { getValue } from '../redisParser'

// This is used to prevent duplicate messages from being processed, when retries occur
// processingMessage string format: `${parentId}-${clientGroup}`
let processingMessages: string[] = []

export const Subscriber = async (redisOriginal: RedisClientType<any, any>, clientGroup: ClientGroups, consumerName: string) => {
  const redis = redisOriginal.duplicate()
  await redis.connect()
  return async <T1 extends Message<Subjects>>(
    subject: T1['subject'],
    eventHandler: (input: {
      args: T1['data']
      operationId: Types.ObjectId
      parentId: Types.ObjectId
      client: RedisClientType<any, any>
      clientGroup: ClientGroups
    }) => Promise<any>
  ) => {
    const cfg = await configureMessageProcessingFunctions(redis, clientGroup, consumerName, subject, eventHandler)
    cfg.processUnackedPendingMessages()
    cfg.processNewMessages()
    setInterval(() => cfg.retryMessagesThatAreIdleFor(10 * 1000), 10 * 1000)
  }
}

type EventHandler = (input: {
  args: any
  operationId: Types.ObjectId
  parentId: Types.ObjectId
  client: RedisClientType<any, any>
  clientGroup: ClientGroups
}) => Promise<any>

const configureMessageProcessingFunctions = async (
  redis: RedisClientType<any, any>,
  clientGroup: ClientGroups,
  consumerName: string,
  subject: Subjects,
  eventHandler: EventHandler
) => {
  //upsert client group
  await redis
    .sendCommand(['XGROUP', 'CREATE', subject, clientGroup, '$', 'MKSTREAM'])
    .then((result) => console.log({ result }))
    .catch((err) => !err.message.includes('Consumer Group name already exists') && console.log(err))

  const processUnackedPendingMessages = async () => {
    const result = (await redis.sendCommand(['XREADGROUP', 'GROUP', clientGroup, consumerName, 'STREAMS', subject, '0'])) as any
    if (result) processMessage(result[0][1], redis, subject, clientGroup, eventHandler)
  }
  const processNewMessages = async () => {
    const result = (await redis.sendCommand([
      'XREADGROUP',
      'BLOCK',
      '1000',
      'COUNT',
      '10',
      'GROUP',
      clientGroup,
      consumerName,
      'STREAMS',
      subject,
      '>',
    ])) as any

    if (result) await processMessage(result[0][1], redis, subject, clientGroup, eventHandler)
    processNewMessages()
  }

  const retryMessagesThatAreIdleFor = async (ms: number) => {
    try {
      const result = (await redis.sendCommand([
        'XAUTOCLAIM',
        subject,
        clientGroup,
        consumerName,
        ms.toString(),
        '0',
        'COUNT',
        '10',
      ])) as string[][][]
      if (!result || result.length < 2) return
      await processMessage(result[1], redis, subject, clientGroup, eventHandler)
      retryMessagesThatAreIdleFor(ms)
    } catch (err) {}
  }
  return { processUnackedPendingMessages, processNewMessages, retryMessagesThatAreIdleFor }
}

const processMessage = async <T1 extends Message<Subjects>>(
  messages: any,
  redis: RedisClientType<any, any>,
  subject: T1['subject'],
  clientGroup: ClientGroups,
  eventHandler: EventHandler
) => {
  await Promise.all(
    messages.map(async (message: string[][]) => {
      const messageId = message[0].toString()
      const operationId = new Types.ObjectId(getValue('operationId', message[1]))
      const parentId = new Types.ObjectId(getValue('eventId', message[1]))
      const processingMessage = `${parentId.toString()}-${clientGroup}`
      processingMessages.push(processingMessage)
      const msgData = JSON.parse(getValue('data', message[1]))
      const ack = () => redis.sendCommand(['XACK', subject, clientGroup, messageId])
      try {
        await eventHandler({
          args: msgData,
          operationId,
          parentId,
          client: redis,
          clientGroup,
        })
        await Promise.all([ack(), MessageError.updateOne({ operationId, parentId, clientGroup }, { resolvedAt: new Date() })])
      } catch (error) {
        let { message, stack } = error as Error
        const messageError = await createMessageError({
          operationId,
          parentId,
          clientGroup,
          error: {
            message,
            stack,
          },
        })
        const { errorCount } = messageError
        console.error(`Failed ${errorCount} times, clientGroup: ${clientGroup}, errMsg: ${message} eventId:${parentId}`)
        if (errorCount > 5) {
          console.log(`Error added to dead letter queue`)
          await ack()
        }
      } finally {
        processingMessages = processingMessages.filter((pmsg) => pmsg !== processingMessage)
      }
    })
  )
}
