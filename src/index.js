import 'dotenv/config';
import express from 'express';
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
  context: async ({ req }) => ({
    models,
    me: await getMe(req),
    secret: process.env.SECRET,
  }),
});

server.applyMiddleware({ app, path: '/graphql' });

const eraseDatabaseOnSync = true;

sequelize
  .sync({
    force: eraseDatabaseOnSync,
  })
  .then(async () => {
    if (eraseDatabaseOnSync) createUsersWithMessages();

    app.listen({ port: 8000 }, () => {
      console.log('Apollo Server on http://localhost:8000/graphql');
    });
  });

const createUsersWithMessages = async () => {
  await models.User.create(
    {
      username: 'louferigno',
      email: 'lou@email.com',
      password: '1Password',
      messages: [
        {
          text: 'The ultimate hulk!',
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
        },
        { text: '12 monkeys!' },
      ],
    },
    {
      include: [models.Message],
    },
  );
};
