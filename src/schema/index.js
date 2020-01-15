import { gql } from 'apollo-server-express';

export default gql`
  type Query {
    me: User
    user(id: ID!): User
    users: [User!]!

    message(id: ID!): Message!
    messages: [Message!]!
  }

  type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean!
    updateMessage(message: MessageUpdateInput!): Message
  }

  type User {
    id: ID!
    username: String!
    name: String
    firstName: String
    lastName: String
    age: Int
    messages: [Message!]
  }

  type Message {
    id: ID!
    text: String!
    user: User!
  }

  input MessageUpdateInput {
    id: ID!
    text: String!
  }
`;