import { ForbiddenError } from 'apollo-server';
import { combineResolvers, skip } from 'graphql-resolvers';

export const isAuthenticated = (parent, args, { me }) =>
  me ? skip : new ForbiddenError('Not authenticated');

export const isAdmin = combineResolvers(
  isAuthenticated, // put the isAuthenticated guard here. Could have put it in message resolver (see src/resolvers/message.js deleteMessage example)
  (parent, args, { me: { role } }) =>
    role === 'ADMIN' ? skip : new ForbiddenError('Not admin.'),
);

export const isMessageOwner = async (
  parent,
  { id },
  { models, me },
) => {
  const message = await models.Message.findByPk(id, { raw: true });

  if (message.userId !== me.id) throw new ForbiddenError('Not owner');

  return skip;
};
