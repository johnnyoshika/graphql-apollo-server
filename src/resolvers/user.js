export default {
  Query: {
    me: async (parent, args, { models, me }) =>
      await models.User.findByPk(me.id),
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
