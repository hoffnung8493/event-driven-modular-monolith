import { MessageError, Message } from '../models'
import express from 'express'
import { RedisClientType } from 'redis'

export const errorRouter = (redis: RedisClientType<any, any>) => {
  const router = express.Router()

  router.get('/', async (req, res) => {
    const errors = await MessageError.find({ resolvedAt: { $exists: false } })
    return res.json(errors)
  })

  router.put('/:errorId/retry', async (req, res) => {
    const { errorId } = req.params
    const msgError = await MessageError.findById(errorId)
    if (!msgError) throw new Error('Cannot find msgError')
    const message = await Message.findById(msgError.parentId)
    if (!message) throw new Error('Cannot find message')
    await redis.sendCommand([
      'XADD',
      `${message.subject}.retry.${message.clientGroup}`,
      'operationId',
      msgError.operationId.toHexString(),
      'eventId',
      msgError.parentId.toHexString(),
      'data',
      Buffer.from(message.data),
    ])
    msgError.updateOne(
      { _id: msgError._id },
      { $push: { republish: { targetClientGroup: msgError.clientGroup, createdAt: new Date() } } }
    )
  })

  router.put('/:errorId/refresh', async (req, res) => {
    const { errorId } = req.params
    const msgError = await MessageError.findById(errorId)
    if (!msgError) throw new Error('Cannot find msgError')
    const message = await Message.findOne({ parentId: msgError.parentId, clientGroup: msgError.clientGroup })
    if (!message) return res.json(msgError.toObject())
    msgError.resolvedAt = message.publishedAt
    await msgError.save()
    return res.json(msgError.toObject())
  })

  return router
}
