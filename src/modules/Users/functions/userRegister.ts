import { User } from '../models'
import { PublisherInput, Publisher } from 'event-driven'
import { UserRegisteredEvent, Subjects, ClientGroups } from '../../../interfaces'

interface UserRegisterInput extends PublisherInput<ClientGroups> {
  input: {
    username: string
    hashedPassword: string
    firstName: string
    lastName: string
  }
}

export const userRegister = async ({ client, clientGroup, parentId, operationId, input }: UserRegisterInput) => {
  const publish = Publisher<Subjects.UserRegistered, ClientGroups, UserRegisteredEvent>({
    client,
    clientGroup,
    operationId,
    parentId,
    subject: Subjects.UserRegistered,
  })
  const user = await new User({ ...input, username: input.username.toLowerCase().trim() }).save()
  publish({
    _id: user._id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    createdAt: user.createdAt,
  })
  return user
}
