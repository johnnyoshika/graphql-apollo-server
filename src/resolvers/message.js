import Sequelize from 'sequelize';
import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, isMessageOwner } from './authorization';
import pubsub, { EVENTS } from '../subscription';

const toCursorHash = string => Buffer.from(string).toString('base64');
const fromCursorHash = string =>
  Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    message: async (parent, { id }, { models }) =>
      await models.Mesasge.findByPk(id),
    messages: async (parent, { cursor, limit = 100 }, { models }) => {
      const messages = await models.Message.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit + 1,
        where: cursor
          ? {
              createdAt: {
                [Sequelize.Op.lt]: fromCursorHash(cursor),
              },
            }
          : null,
      });

      const hasNextPage = messages.length > limit;
      const edges = hasNextPage ? messages.slice(0, -1) : messages;

      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor: edges.length
            ? toCursorHash(
                edges[edges.length - 1].createdAt.toString(),
              )
            : null,
        },
      };
    },
  },

  Mutation: {
    createMessage: combineResolvers(
      isAuthenticated,
      async (parent, { text }, { me, models }) => {
        const message = await models.Message.create({
          text,
          userId: me.id,
        });

        pubsub.publish(EVENTS.MESSAGE.CREATED, {
          messageCreated: { message },
        });

        return message;
      },
    ),
    deleteMessage: combineResolvers(
      isAuthenticated,
      isMessageOwner,
      async (parent, { id }, { models }) =>
        await models.Message.destroy({ where: { id } }),
    ),
    updateMessage: async (parent, { message: input }, { models }) => {
      try {
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
      } catch (error) {
        if (error.name === 'SequelizeValidationError')
          throw new Error(
            `Custom message: ${error.errors
              .map(e => e.message)
              .join('|')}`,
          );
        else throw new Error(error);
      }
    },
  },

  Message: {
    user: async (message, args, { loaders }) =>
      await loaders.user.load(message.userId),
  },

  Subscription: {
    messageCreated: {
      subscribe: () => pubsub.asyncIterator(EVENTS.MESSAGE.CREATED),
    },
  },
};
