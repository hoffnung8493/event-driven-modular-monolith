import { Schema, Document, Types, connection } from 'mongoose'
import { database } from './database'

export interface OperationErrorDoc extends Document {
  operationId: Types.ObjectId
  errMessage: string
  errStack?: string
}

const OperationErrorSchema = new Schema({
  operationId: { type: Types.ObjectId, required: true },
  errMessage: { type: String, required: true },
  errStack: String,
})

export const OperationError = connection.useDb(database).model<OperationErrorDoc>('OperationError', OperationErrorSchema)

export const operationErrorCreate = ({ operationId, error }: { operationId: Types.ObjectId; error: any }) =>
  new OperationError({ operationId, errMessage: error.message, errStack: error.stack }).save()
