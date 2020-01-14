import express from 'express';
import cors from 'cors';
import { ApolloServer, gql } from 'apollo-server-express';

const app = express();
app.use(cors());

const schema = gql`
  type Query {
    me: User
  }
  type User {
    username: String!
    firstName: String
    lastName: String
    age: Int
  }
`;

const resolvers = {
  Query: {
    me: () => {
      return {
        username: 'johnnyoshika',
        firstName: 'Johnny',
        lastName: 'Oshika'
      };
    }
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