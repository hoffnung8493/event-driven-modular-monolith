import { Types } from 'mongoose'
import { Comment } from '../models'
import { CommentCreatedEvent, Publisher, Subjects, PublisherInput } from '../../../common'

interface Input extends PublisherInput {
  args: {
    blogId: string
    content: string
    user: { _id: Types.ObjectId; username: string; firstName: string; lastName: string }
  }
}

export const commentCreate = async (input: Input) => {
  const publish = Publisher<CommentCreatedEvent>({ ...input, subject: Subjects.CommentCreated })
  const comment = await new Comment(input.args).save()
  publish(comment.toObject())
  return comment
}
