import { Types } from 'mongoose'
import { Blog } from '../models'
import { BlogCreatedEvent, Publisher, Subjects, PublisherInput } from '../../../common'

interface Input extends PublisherInput {
  args: {
    title: string
    content: string
    user: {
      _id: Types.ObjectId
      username: string
      firstName: string
      lastName: string
    }
  }
}

export const blogCreate = async (input: Input) => {
  const publish = Publisher<BlogCreatedEvent>({ ...input, subject: Subjects.BlogCreated })
  const blog = await new Blog(input.args).save()
  publish(blog.toObject())
  return blog
}
