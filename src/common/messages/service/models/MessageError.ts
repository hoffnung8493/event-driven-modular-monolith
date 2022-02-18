import { connection, Schema, Document, Types } from 'mongoose'
import { database } from './database'

export interface MessageErrorDoc extends Document {
  _id: Types.ObjectId
  operationId: Types.ObjectId
  parentId: Types.ObjectId
  clientGroup: string
  errorCount: number
  error: {
    message: string
    stack?: string
    createdAt: Date
  }[]
  resolvedAt?: Date
}

const MessageErrorSchema = new Schema(
  {
    operationId: { type: Types.ObjectId, required: true },
    parentId: { type: Types.ObjectId, required: true },
    clientGroup: { type: String, required: true },
    errorCount: { type: Number, required: true },
    error: [
      {
        message: { type: String, required: true },
        stack: String,
        createdAt: { type: Date, required: true },
      },
    ],
    resolvedAt: Date,
  },
  { timestamps: true }
)

export const MessageError = connection.useDb(database).model<MessageErrorDoc>('MessageError', MessageErrorSchema)

export const createMessageError = async (data: {
  operationId: Types.ObjectId
  parentId: Types.ObjectId
  clientGroup: string
  error: {
    message: string
    stack?: string
  }
}) => {
  const messageError = await MessageError.findOneAndUpdate(
    {
      operationId: data.operationId,
      parentId: data.parentId,
      clientGroup: data.clientGroup,
    },
    {
      $push: { error: { ...data.error, createdAt: new Date() } },
      $inc: { errorCount: 1 },
    },
    { new: true }
  )
  if (messageError) return messageError.toObject()

  const newMessageError = await new MessageError({
    operationId: data.operationId,
    parentId: data.parentId,
    clientGroup: data.clientGroup,
    errorCount: 1,
    error: [{ ...data.error, createdAt: new Date() }],
  }).save()
  return newMessageError
}
