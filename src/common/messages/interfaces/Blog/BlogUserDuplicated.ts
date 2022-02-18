import { Types } from 'mongoose'
import { Subjects } from '../subjects'

export interface BlogUserDuplicatedEvent {
  subject: Subjects.BlogUserDuplicated
  data: {
    _id: Types.ObjectId
    username: string
  }
}
