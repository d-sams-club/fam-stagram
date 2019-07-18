const Sequelize = require('sequelize');

const db = new Sequelize('famstagram', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

const User = db.define('user', {
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: Sequelize.STRING },
  email: { type: Sequelize.STRING, validate: { isEmail: true } },
  password: { type: Sequelize.STRING },
});


const Family = db.define('family', {
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: Sequelize.STRING },
  code: { type: Sequelize.STRING, unqiue: true },
});

const Message = db.define('message', {
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  text: { type: Sequelize.STRING },
  userId: { type: Sequelize.INTEGER, references: { model: 'users', key: 'id' } },
  familyId: { type: Sequelize.INTEGER, references: { model: 'families', key: 'id' } },
});

const Photo = db.define('photo', {
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  text: { type: Sequelize.STRING },
  url: { type: Sequelize.STRING },
  caption: { type: Sequelize.STRING },
  userId: { type: Sequelize.INTEGER, references: { model: 'users', key: 'id' } },
});

const Reaction = db.define('reaction', {
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  text: { type: Sequelize.STRING },
});

const ReactionPhoto = db.define('reactionPhoto', {
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  text: { type: Sequelize.STRING },
  familyId: { type: Sequelize.INTEGER, references: { model: 'families', key: 'id' } },
  userId: { type: Sequelize.INTEGER, references: { model: 'users', key: 'id' } },
});

module.exports = db;
