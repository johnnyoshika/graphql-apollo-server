import uuidv4 from 'uuid/v4';

export default {
  Query: {
    message: async (parent, { id }, { models }) =>
      await models.Mesasge.findByPk(id),
    messages: async (parent, args, { models }) =>
      await models.Message.findAll(),
  },

  Mutation: {
    createMessage: async (parent, { text }, { me, models }) =>
      await models.Message.create({
        text,
        userId: me.id,
      }),
    deleteMessage: async (parent, { id }, { models }) =>
      await models.Message.destroy({ where: { id } }),
    updateMessage: async (parent, { message: input }, { models }) => {
      const [rows, result] = await models.Message.update(
        {
          text: input.text,
        },
        {
          where: {
            id: input.id,
          },
          returning: true,
          plain: true, // https://stackoverflow.com/a/40543424/188740
        },
      );
      return result.dataValues;
    },
  },

  Message: {
    user: async (message, args, { models }) =>
      await models.User.findByPk(message.userId),
  },
};
