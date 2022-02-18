import express from 'express'
import { RedisClientType } from 'redis'
import { Subjects, ClientGroups } from '../..'
import { getValue, getEntry } from '../../../redisParser'

export const infoRouter = (redis: RedisClientType<any, any>) => {
  const router = express.Router()

  router.get('/client-groups', async (req, res) => {
    return res.json(Object.values(ClientGroups))
  })

  router.get('/subjects', async (req, res) => {
    return res.json(Object.values(Subjects))
  })

  router.get('/subjects/:subject', async (req, res) => {
    const { subject } = req.params
    const streamInfo = await getFullStreamInfo(subject, redis)
    res.json(streamInfo)
  })

  return router
}

const getFullStreamInfo = async (subject: string, redis: RedisClientType<any, any>) => {
  try {
    const [streamInfo, clientGroupInfo] = (await Promise.all([
      redis.sendCommand(['XINFO', 'STREAM', subject]),
      redis.sendCommand(['XINFO', 'GROUPS', subject]),
    ])) as [string[], string[][]]
    const subscribedClientGroups = await Promise.all(
      clientGroupInfo.map(async (data: string[]) => {
        const clientGroupName = getValue('name', data)
        const consumers = (await redis.sendCommand(['XINFO', 'CONSUMERS', subject, clientGroupName])) as string[][]
        return {
          name: getValue('name', data),
          pendingMessagesCount: getValue('pending', data),
          lastDeliveredId: getValue('last-delivered-id', data),
          consumers: consumers.map((cData: string[]) => ({
            name: getValue('name', cData),
            pendingMessagesCount: getValue('pending', cData),
            idle: getValue('idle', cData),
          })),
        }
      })
    )
    return {
      subject,
      messagesCount: getValue('length', streamInfo),
      lastGeneratedId: getValue('last-generated-id', streamInfo),
      subscribedClientGroups,
      firstEntry: getEntry(getValue('first-entry', streamInfo)),
      lastEntry: getEntry(getValue('last-entry', streamInfo)),
    }
  } catch (err) {
    if (err instanceof Error && err.message === 'ERR no such key') return null
    console.error(err)
  }
}
