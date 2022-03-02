import { Types } from 'mongoose'
import { Comment } from '../models'
import { Publisher, PublisherInput } from 'event-driven'
import { ClientGroups, CommentUserUpdatedEvent, Subjects } from '../../../interfaces'

interface Input extends PublisherInput<ClientGroups> {
  args: {
    user: {
      _id: Types.ObjectId
      firstName: string
      lastName: string
    }
  }
}

export const commentUserUpdate = async (input: Input) => {
  const publish = Publisher<Subjects.CommentUserUpdated, ClientGroups, CommentUserUpdatedEvent>({
    ...input,
    subject: Subjects.CommentUserUpdated,
  })
  const { user } = input.args
  await Comment.updateMany({ 'user._id': user._id }, { 'user.firstName': user.firstName, 'user.lastName': user.lastName })
  publish({ user, createdAt: new Date() })
  return
}
