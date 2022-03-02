import { Types } from 'mongoose'
import { Comment } from '../models'
import { Publisher, PublisherInput } from 'event-driven'
import { ClientGroups, CommentCreatedEvent, Subjects } from '../../../interfaces'

interface Input extends PublisherInput<ClientGroups> {
  args: {
    blogId: string
    content: string
    user: { _id: Types.ObjectId; username: string; firstName: string; lastName: string }
  }
}

export const commentCreate = async (input: Input) => {
  const publish = Publisher<Subjects.CommentCreated, ClientGroups, CommentCreatedEvent>({
    ...input,
    subject: Subjects.CommentCreated,
  })
  const comment = await new Comment(input.args).save()
  publish(comment.toObject())
  return comment
}
