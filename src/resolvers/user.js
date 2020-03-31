import jwt from 'jsonwebtoken';
import { AuthenticationError, UserInputError } from 'apollo-server';

const createToken = async (user, secret, expiresIn) => {
  const { id, email, username } = user;
  return await jwt.sign({ id, email, username }, secret, {
    expiresIn,
  });
};

export default {
  Query: {
    me: async (parent, args, { models, me }) =>
      me ? await models.User.findByPk(me.id) : null,
    user: async (parent, { id }, { models }) =>
      await models.User.findByPk(id),
    users: async (parent, args, { models }) =>
      await models.User.findAll(),
  },

  Mutation: {
    signUp: async (
      parent,
      { username, email, password },
      { models, secret },
    ) => {
      const user = await models.User.create({
        username,
        email,
        password,
      });

      return { token: createToken(user, secret, '30m') }; // expires in 30 minutes
    },

    signIn: async (
      parent,
      { login, password },
      { models, secret },
    ) => {
      const user = await models.User.findByLogin(login);

      if (!user) {
        throw new UserInputError('Invalid login.');
      }

      if (!(await user.validatePassword(password)))
        throw new AuthenticationError('Invalid password.');

      return { token: createToken(user, secret, '30m') };
    },
  },

  User: {
    messages: async (user, args, { models }) =>
      await models.Message.findAll({
        where: {
          userId: user.id,
        },
      }),
  },
};
