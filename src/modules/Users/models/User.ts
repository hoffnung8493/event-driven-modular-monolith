import { Document, Schema, connection } from 'mongoose'
import { database } from './database'

export interface UserDoc extends Document {
  username: string
  hashedPassword: string
  firstName: string
  lastName: string
  createdAt: Date
}

const UserSchema = new Schema(
  {
    username: { type: String, required: true, index: true, unique: true },
    hashedPassword: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  { timestamps: true }
)

export const User = connection.useDb(database).model<UserDoc>('user', UserSchema)
