export default {
  Query: {
    me: (parent, args, { me }) => me,
    user: (parent, { id }, { models }) => models.users[id],
    users: (parent, args, { models }) => Object.values(models.users)
  },

  User: {
    name: user => `${user.firstName} ${user.lastName}`,
    messages: (user, args, { models }) => Object.values(models.messages).filter(
      message => message.userId === user.id
    )
  }
};