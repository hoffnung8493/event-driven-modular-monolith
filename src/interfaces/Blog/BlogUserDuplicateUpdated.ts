import { Types } from 'mongoose'
import { Subjects } from '../subjects'

export interface BlogUserDuplicateUpdatedEvent {
  subject: Subjects.BlogUserDuplicateUpdated
  data: {
    _id: Types.ObjectId
    username: string
  }
}
