import { Types } from 'mongoose'
import { Blog } from '../models'
import { Publisher, PublisherInput } from 'event-driven'
import { BlogUserUpdatedEvent, ClientGroups, Subjects } from '../../../interfaces'

interface Input extends PublisherInput<ClientGroups> {
  args: {
    user: {
      _id: Types.ObjectId
      firstName: string
      lastName: string
    }
  }
}

export const blogUserUpdate = async (input: Input) => {
  const publish = Publisher<Subjects.BlogUserUpdated, ClientGroups, BlogUserUpdatedEvent>({
    ...input,
    subject: Subjects.BlogUserUpdated,
  })
  await Blog.updateMany(
    { 'user._id': input.args.user._id },
    { 'user.firstName': input.args.user.firstName, 'user.lastName': input.args.user.lastName }
  )
  publish({ user: input.args.user, createdAt: new Date() })
  return
}
