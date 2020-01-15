import uuidv4 from 'uuid/v4';

export default {
  Query: {
    message: (parent, { id }, { models }) => models.messages[id],
    messages: (parent, args, { models }) => Object.values(models.messages)
  },

  Mutation: {
    createMessage: (parent, { text }, { me, models }) => {
      const id = uuidv4();
        const message = {
        id: id,
        text,
        userId: me.id
      }

      models.messages[id] = message;
      return message;
    },
    deleteMessage: (parent, { id }, { models }) => {
      const { [id]: message, ...otherMessages } = models.messages;

      if (!message) return false;

      models.messages = otherMessages;

      return true;
    },
    updateMessage: (parent, { message: input }, { models }) => {
      const message = models.messages[input.id];
      if (!message) return null;

      message.text = input.text;
      return message;
    }
  },

  Message: {
    user: (message, args, { models }) => models.users[message.userId]
  }
};