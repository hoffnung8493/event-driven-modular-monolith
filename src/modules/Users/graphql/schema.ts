import { gql } from 'apollo-server-express'

export const userSchema = gql`
  type User {
    id: ID!
    username: String!
    firstName: String!
    lastName: String!
  }

  extend type Query {
    users(ids: [String!]!): [User!]!
    user(id: String!): User!
  }

  extend type Mutation {
    userRegister(username: String!, password: String!, firstName: String!, lastName: String!): UserAuth!
    userLogin(username: String!, password: String!): UserAuth!
    userUpdateNames(firstName: String!, lastName: String!): User!
  }

  type UserAuth {
    accessToken: String!
    refreshToken: String!
    user: User!
  }
`
