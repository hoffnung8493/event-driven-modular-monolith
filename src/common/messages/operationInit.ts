import { Types } from 'mongoose'
import { createOperation } from './service/models/Operation'
import { Request } from 'express'

export const operationInit = (req: Request, userId?: string) => {
  const operationId = new Types.ObjectId()
  const operationBody = { operationId, userId: userId ? new Types.ObjectId(userId) : undefined }
  if (req.body.operationName === 'IntrospectionQuery') return operationId

  if (Array.isArray(req.body)) for (let node of req.body) createOperation({ operationBody, ...node })
  else createOperation({ operationBody, ...req.body })
  return operationId
}
