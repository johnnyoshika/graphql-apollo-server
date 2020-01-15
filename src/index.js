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

const me = users[1];

const schema = gql`
  type Query {
    me: User
    user(id: ID!): User
  }

  type User {
    id: ID!
    username: String!
    firstName: String
    lastName: String
    age: Int
  }
`;

const resolvers = {
  Query: {
    me: () => me,
    user: (parent, { id }) => users[id]
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers
});

server.applyMiddleware({ app, path: '/graphql' });
app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});