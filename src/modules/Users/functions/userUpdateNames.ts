import { User } from '../models'
import { PublisherInput, Publisher } from 'event-driven'
import { UserNameUpdatedEvent, Subjects, ClientGroups } from '../../../interfaces'

interface UserUpdateNameInput extends PublisherInput<ClientGroups> {
  input: {
    userId: string
    firstName: string
    lastName: string
  }
}

export const userUpdateNames = async ({ client, clientGroup, parentId, operationId, input }: UserUpdateNameInput) => {
  const publish = Publisher<Subjects.UserNameUpdated, ClientGroups, UserNameUpdatedEvent>({
    client,
    clientGroup,
    operationId,
    parentId,
    subject: Subjects.UserNameUpdated,
  })
  const user = await User.findOneAndUpdate(
    { _id: input.userId },
    { firstName: input.firstName, lastName: input.lastName },
    { new: true }
  )
  if (!user) throw new Error('Cannot find user')
  publish({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
  })
  return user
}
