const Sequelize = require('sequelize');

const db = new Sequelize('famstagram', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});


const User = db.define('user', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: Sequelize.STRING },
  email: { type: Sequelize.STRING, validate: { isEmail: true } },
  password: { type: Sequelize.STRING },
  createdAt: {
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
  },
  updatedAt: {
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
  },
});

const Family = db.define('family', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: Sequelize.STRING },
  code: { type: Sequelize.STRING, unqiue: true },
  createdAt: {
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
  },
  updatedAt: {
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
  },
});

const Message = db.define('message', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  text: { type: Sequelize.STRING },
  userId: { type: Sequelize.INTEGER, references: { model: 'users', key: 'id' } },
  familyId: { type: Sequelize.INTEGER, references: { model: 'families', key: 'id' } },
  createdAt: {
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
  },
  updatedAt: {
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
  },
});

const Photo = db.define('photo', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  text: { type: Sequelize.STRING },
  url: { type: Sequelize.STRING },
  caption: { type: Sequelize.STRING },
  userId: { type: Sequelize.INTEGER, references: { model: 'users', key: 'id' } },
  createdAt: {
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
  },
  updatedAt: {
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
  },
});

const Reaction = db.define('reaction', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  text: { type: Sequelize.STRING },
  createdAt: {
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
  },
  updatedAt: {
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
  },
});

const ReactionPhoto = db.define('reactionPhoto', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  text: { type: Sequelize.STRING },
  familyId: { type: Sequelize.INTEGER, references: { model: 'families', key: 'id' } },
  userId: { type: Sequelize.INTEGER, references: { model: 'users', key: 'id' } },
  createdAt: {
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
  },
  updatedAt: {
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
  },
});


//   db.query('CREATE DATABASE IF NOT EXISTS famstagram;')
// .then(() => console.log('Database created'))
// .catch((error) => console.log(`There was an error creating the database`, error))


module.exports = db;
