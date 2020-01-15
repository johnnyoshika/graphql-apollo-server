import express from 'express';
import cors from 'cors';
import { ApolloServer, gql } from 'apollo-server-express';
import uuidv4 from 'uuid/v4';

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
    userId: '1'
  },
  2: {
    id: '2',
    text: 'By World',
    userId: '2'
  }
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

  type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean!
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

  Mutation: {
    createMessage: (parent, { text }, { me }) => {
      const id = uuidv4();
        const message = {
        id: id,
        text,
        userId: me.id
      }

      messages[id] = message;
      return message;
    },
    deleteMessage: (parent, { id }) => {
      const { [id]: message, ...otherMessages } = messages;

      if (!message) return false;

      messages = otherMessages;

      return true;
    }
  },

  User: {
    name: user => `${user.firstName} ${user.lastName}`,
    messages: user => Object.values(messages).filter(
      message => message.userId === user.id
    )
  },

  Message: {
    user: message => users[message.userId]
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