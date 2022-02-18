import { Types } from 'mongoose'
import { Subjects } from '../subjects'

export interface UserLoggedInEvent {
  subject: Subjects.UserLoggedIn
  data: {
    _id: Types.ObjectId
  }
}
