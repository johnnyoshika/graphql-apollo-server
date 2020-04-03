import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import {
  ApolloServer,
  AuthenticationError,
} from 'apollo-server-express';
import jwt from 'jsonwebtoken';

import schema from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';

const getMe = async req => {
  const token = req.headers['x-token'];
  if (!token) return undefined;
  try {
    return await jwt.verify(token, process.env.SECRET);
  } catch (e) {
    throw new AuthenticationError('Session expired.');
  }
};

const app = express();
app.use(cors());

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  formatError: error => ({
    // remove the internal 'Validation error: ' part and leave only the important message
    ...error,
    message: error.message.replace('Validation error: ', ''),
  }),
  context: async ({ req, connection }) => {
    // subscription websocket request
    if (connection) return { models };

    // http request
    if (req)
      return {
        models,
        me: await getMe(req), // The context is generated  with every new request, so we don’t have to clean up. Source: https://www.apollographql.com/docs/apollo-server/security/authentication/
        secret: process.env.SECRET,
      };
  },
});

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const eraseDatabaseOnSync = true;

sequelize
  .sync({
    force: eraseDatabaseOnSync,
  })
  .then(async () => {
    if (eraseDatabaseOnSync) createUsersWithMessages(new Date());

    httpServer.listen({ port: 8000 }, () => {
      console.log('Apollo Server on http://localhost:8000/graphql');
    });
  });

const createUsersWithMessages = async date => {
  await models.User.create(
    {
      username: 'louferigno',
      email: 'lou@email.com',
      password: '1Password',
      role: 'ADMIN',
      messages: [
        {
          text: 'The ultimate hulk!',
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
      ],
    },
    { include: [models.Message] },
  );

  await models.User.create(
    {
      username: 'bradpitt',
      email: 'brad@email.com',
      password: '1Password',
      messages: [
        {
          text: 'A legend of the fall',
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
        {
          text: '12 monkeys!',
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
      ],
    },
    {
      include: [models.Message],
    },
  );
};
