import { gql } from 'apollo-server-express'

export const blogSchema = gql`
  type Blog {
    id: ID!
    title: String!
    content: String!
    user: BlogUserNested!
  }

  type BlogUserNested {
    id: ID!
    username: String!
    firstName: String!
    lastName: String!
    user: User!
  }

  extend type Query {
    blogs: [Blog!]!
    blog(id: String!): Blog!
  }

  extend type Mutation {
    blogCreate(title: String!, content: String!): Blog!
  }
`
