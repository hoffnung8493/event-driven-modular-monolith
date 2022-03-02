import { Types } from 'mongoose'
import { Publisher, PublisherInput } from 'event-driven'
import { BlogUserDuplicatedEvent, ClientGroups, Subjects } from '../../../interfaces'

interface Input extends PublisherInput<ClientGroups> {
  args: {
    user: {
      _id: Types.ObjectId
      username: string
    }
  }
}

export const blogUserDuplicate = async (input: Input) => {
  try {
    const publish = Publisher<Subjects.BlogUserDuplicated, ClientGroups, BlogUserDuplicatedEvent>({
      ...input,
      subject: Subjects.BlogUserDuplicated,
    })
    //store duplicated user
    await publish(input.args.user)
    return input.args.user
  } catch (err) {
    console.error(err)
  }
}
