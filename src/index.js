import express from 'express';
import cors from 'cors';
import { ApolloServer, gql } from 'apollo-server-express';

const app = express();
app.use(cors());

let users = {
  1: {
    id: '1',
    username: 'johnnyoshika',
    firstName: 'Johnny',
    lastName: 'Oshika'
  },
  2: {
    id: '2',
    username: 'supermario'
  }
};

let messages = {
  1: {
    id: '1',
    text: 'Hello World',
  },
  2: {
    id: '2',
    text: 'By World',
  },
};

//#region Schema

const schema = gql`
  type Query {
    me: User
    user(id: ID!): User
    users: [User!]!

    message(id: ID!): Message!
    messages: [Message!]!
  }

  type User {
    id: ID!
    username: String!
    name: String
    firstName: String
    lastName: String
    age: Int
  }

  type Message {
    id: ID!
    text: String!
  }
`;

//#endregion

const resolvers = {
  Query: {
    me: (parent, args, { me }) => me,
    user: (parent, { id }) => users[id],
    users: () => Object.values(users),
    message: (parent, { id }) => messages[id],
    messages: () => Object.values(messages)
  },

  User: {
    name: user => `${user.firstName} ${user.lastName}`
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    me: users[1]
  }
});

server.applyMiddleware({ app, path: '/graphql' });
app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});