import { Types } from 'mongoose'
import { BlogUserDuplicatedEvent, Subjects, PublisherInput, Publisher } from '../../../common'

interface Input extends PublisherInput {
  args: {
    user: {
      _id: Types.ObjectId
      username: string
    }
  }
}

export const blogUserDuplicate = async (input: Input) => {
  try {
    const publish = Publisher<BlogUserDuplicatedEvent>({ ...input, subject: Subjects.BlogUserDuplicated })
    //store duplicated user
    await publish(input.args.user)
    return input.args.user
  } catch (err) {
    console.error(err)
  }
}
