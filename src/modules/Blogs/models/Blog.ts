import { Document, Types, Schema, connection } from 'mongoose'
import { database } from './database'

export interface BlogDoc extends Document {
  title: string
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

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    user: new Schema({
      username: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    }),
  },
  { timestamps: true }
)

export const Blog = connection.useDb(database).model<BlogDoc>('blog', BlogSchema)
