import { Types } from 'mongoose'
import { Subjects } from '../subjects'

export interface CommentUserUpdatedEvent {
  subject: Subjects.CommentUserUpdated
  data: {
    user: {
      _id: Types.ObjectId
      firstName: string
      lastName: string
    }
    createdAt: Date
  }
}
