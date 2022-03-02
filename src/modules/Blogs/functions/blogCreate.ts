import { Types } from 'mongoose'
import { Blog } from '../models'
import { Publisher, PublisherInput } from 'event-driven'
import { BlogCreatedEvent, ClientGroups, Subjects } from '../../../interfaces'

interface Input extends PublisherInput<ClientGroups> {
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
  const publish = Publisher<Subjects.BlogCreated, ClientGroups, BlogCreatedEvent>({
    ...input,
    subject: Subjects.BlogCreated,
  })
  const blog = await new Blog(input.args).save()
  await publish(blog.toObject())
  return blog
}
