import { Types } from 'mongoose'
import { Subjects } from '../subjects'

export interface BlogUserUpdatedEvent {
  subject: Subjects.BlogUserUpdated
  data: {
    user: {
      _id: Types.ObjectId
      firstName: string
      lastName: string
    }
    createdAt: Date
  }
}
