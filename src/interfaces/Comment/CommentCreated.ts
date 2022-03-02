import { Types } from 'mongoose'
import { Subjects } from '../subjects'

export interface CommentCreatedEvent {
  subject: Subjects.CommentCreated
  data: {
    _id: Types.ObjectId
    blogId: Types.ObjectId
    content: string
    user: {
      _id: Types.ObjectId
      username: string
    }
    createdAt: Date
  }
}
