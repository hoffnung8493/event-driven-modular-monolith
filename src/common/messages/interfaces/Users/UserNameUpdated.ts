import { Types } from 'mongoose'
import { Subjects } from '../subjects'

export interface UserNameUpdatedEvent {
  subject: Subjects.UserNameUpdated
  data: {
    _id: Types.ObjectId
    firstName: string
    lastName: string
  }
}
