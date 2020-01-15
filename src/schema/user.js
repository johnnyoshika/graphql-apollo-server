import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    me: User
    user(id: ID!): User
    users: [User!]!
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
`;