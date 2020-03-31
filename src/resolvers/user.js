import jwt from 'jsonwebtoken';

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

  User: {
    messages: async (user, args, { models }) =>
      await models.Message.findAll({
        where: {
          userId: user.id,
        },
      }),
  },
};
