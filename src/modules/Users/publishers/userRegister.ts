import { Types } from 'mongoose'
import { User } from '../models'
import { UserRegisteredEvent, Subjects, PublisherInput, Publisher } from '../../../common'

interface UserRegisterInput extends PublisherInput {
  input: {
    username: string
    hashedPassword: string
    firstName: string
    lastName: string
  }
}

export const userRegister = async ({ client, clientGroup, parentId, operationId, input }: UserRegisterInput) => {
  const publish = Publisher<UserRegisteredEvent>({
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
