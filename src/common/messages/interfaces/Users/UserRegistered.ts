import { Types } from 'mongoose'
import { Subjects } from '../subjects'

export interface UserRegisteredEvent {
  subject: Subjects.UserRegistered
  data: {
    _id: Types.ObjectId
    username: string
    firstName: string
    lastName: string
    createdAt: Date
  }
}
