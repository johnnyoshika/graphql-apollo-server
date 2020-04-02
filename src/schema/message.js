import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    message(id: ID!): Message!
    messages(cursor: String, limit: Int): [Message!]!
  }

  extend type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean!
    updateMessage(message: MessageUpdateInput!): Message
  }

  type Message {
    id: ID!
    text: String!
    createdAt: Date!
    user: User!
  }

  input MessageUpdateInput {
    id: ID!
    text: String!
  }
`;
