import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    message(id: ID!): Message!
    messages(cursor: String, limit: Int): MessageConnection!
  }

  extend type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean!
    updateMessage(message: MessageUpdateInput!): Message
  }

  extend type Subscription {
    messageCreated: MessageCreated!
  }

  type Message {
    id: ID!
    text: String!
    createdAt: Date!
    user: User!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String
  }

  type MessageConnection {
    edges: [Message!]!
    pageInfo: PageInfo!
  }

  type MessageCreated {
    message: Message!
  }

  input MessageUpdateInput {
    id: ID!
    text: String!
  }
`;
