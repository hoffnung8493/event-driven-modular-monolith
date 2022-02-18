import { Document, Types, Schema, connection } from 'mongoose'
import { database } from './database'

export interface CommentDoc extends Document {
  blogId: Types.ObjectId
  content: string
  user: {
    _id: Types.ObjectId
    id: string
    username: string
    firstName: string
    lastName: string
  }
  createdAt: Date
}

const CommentSchema = new Schema(
  {
    blogId: { type: Types.ObjectId, required: true },
    content: { type: String, required: true },
    user: new Schema({
      username: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    }),
  },
  { timestamps: true }
)

export const Comment = connection.useDb(database).model<CommentDoc>('comment', CommentSchema)
