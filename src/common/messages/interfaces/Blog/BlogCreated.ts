import { Types } from 'mongoose'
import { Subjects } from '../subjects'

export interface BlogCreatedEvent {
  subject: Subjects.BlogCreated
  data: {
    _id: Types.ObjectId
    title: string
    content: string
    user: {
      _id: Types.ObjectId
      username: string
    }
    createdAt: Date
  }
}
