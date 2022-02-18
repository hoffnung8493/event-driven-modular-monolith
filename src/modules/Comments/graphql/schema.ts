import { gql } from 'apollo-server-express'

export const commentSchema = gql`
  type Comment {
    id: ID!
    blogId: String!
    content: String!
    user: CommentUserNested!
  }

  type CommentUserNested {
    id: ID!
    username: String!
    firstName: String!
    lastName: String!
    user: User!
  }

  extend type Query {
    comments(blogId: String!): [Comment!]!
  }

  extend type Mutation {
    commentCreate(blogId: String!, content: String!): Comment!
  }
`
