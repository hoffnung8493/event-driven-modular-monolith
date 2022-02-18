import { Types } from 'mongoose'
import { Blog } from '../models'
import { BlogUserUpdatedEvent, Publisher, Subjects, PublisherInput } from '../../../common'

interface Input extends PublisherInput {
  args: {
    user: {
      _id: Types.ObjectId
      firstName: string
      lastName: string
    }
  }
}

export const blogUserUpdate = async (input: Input) => {
  const publish = Publisher<BlogUserUpdatedEvent>({ ...input, subject: Subjects.BlogUserUpdated })
  await Blog.updateMany(
    { 'user._id': input.args.user._id },
    { 'user.firstName': input.args.user.firstName, 'user.lastName': input.args.user.lastName }
  )
  publish({ user: input.args.user, createdAt: new Date() })
  return
}
