import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';

const app = express();
app.use(cors());

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    models,
    // me: models.users[1],
  },
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
