const Sequelize = require('sequelize');
const db = new Sequelize('famstagram', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
})


const User = db.define('user', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: Sequelize.STRING },
  email: { type: Sequelize.STRING, validate: {isEmail:true} },
  password: { type: Sequelize.STRING },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE
});
 

 const Family = db.define('family', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: Sequelize.STRING },
    code: { type: Sequelize.STRING, unqiue: true},
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
});

  const Message = db.define('message', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    text: { type: Sequelize.STRING },
    userId: {type: Sequelize.INTEGER, references: { model: 'users', key: 'id'} },
    familyId: {type: Sequelize.INTEGER, references: { model: 'families', key: 'id'} },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
  });

  const Photo = db.define('photo', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    text: { type: Sequelize.STRING },
    url: { type: Sequelize.STRING },
    caption: { type: Sequelize.STRING },
    userId: {type: Sequelize.INTEGER, references: { model: 'users', key: 'id'} },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
  });

  const Reaction = db.define('reaction', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    text: { type: Sequelize.STRING },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
  });

  const ReactionPhoto = db.define('reactionPhoto', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    text: { type: Sequelize.STRING },
    familyId: {type: Sequelize.INTEGER, references: { model: 'families', key: 'id'} },
    userId: {type: Sequelize.INTEGER, references: { model: 'users', key: 'id'} },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
  });

module.exports = db;