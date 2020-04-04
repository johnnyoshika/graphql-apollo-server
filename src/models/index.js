import Sequelize from 'sequelize';

// process.env.DATABASE_URL is not in our .env file, but Heroku sets this.
// To see it, install the Heroku CLI and run: heroku config:get DATABASE_URL
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
    })
  : new Sequelize(
      process.env.DATABASE,
      process.env.DATABASE_USER,
      process.env.DATABASE_PASSWORD,
      {
        dialect: 'postgres',
      },
    );

const models = {
  User: sequelize.import('./user'),
  Message: sequelize.import('./message'),
};

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) models[key].associate(models);
});

export { sequelize };

export default models;
