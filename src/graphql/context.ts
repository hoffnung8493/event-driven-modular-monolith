import dataloader from 'dataloader'
import { Types } from 'mongoose'
import { BlogDoc } from '../modules/Blogs/models'
import { UserDoc } from '../modules/Users/models'

export interface MyContext {
  userId?: string
  operationId: Types.ObjectId
  userLoader: dataloader<string, UserDoc>
  blogLoader: dataloader<string, BlogDoc>
}
