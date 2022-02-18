import { Schema, Document, Types, connection } from 'mongoose'
import { ClientGroups } from '../..'
import { database } from './database'

export interface OperationDoc extends Document {
  operationId: Types.ObjectId
  operationName: string
  variables: any
  query: string
  userId?: Types.ObjectId
  clientGroup?: ClientGroups
}

const OperationSchema = new Schema(
  {
    operationId: { type: Types.ObjectId, required: true },
    operationName: { type: String, required: true },
    variables: Schema.Types.Mixed,
    query: { type: String, required: true },
    userId: Types.ObjectId,
    clientGroup: String,
  },
  { timestamps: true }
)

export const Operation = connection.useDb(database).model<OperationDoc>('Operation', OperationSchema)

export const createOperation = (data: {
  _id: Types.ObjectId
  operationName: string
  variables: any
  query: string
  userId?: Types.ObjectId
}) => {
  if (data.query.includes('mutation ')) new Operation(data).save()
}
