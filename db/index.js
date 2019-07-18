const db = require('./models.js');

db.sync()
  .then(() => {
    console.log('Database Connected!');
  })
  .catch((error) => {
    console.error(error);
  });

const save = (obj) => {
  db.query(`insert into messages (userId, familyId, text) values (${obj.userId}, ${obj.familyId}, "${obj.text}");`);
};

const getAllMessages = () => db.query('select users.name, messages.text from users, messages where messages.userId = users.id;');

module.exports.db = db;
module.exports.save = save;
module.exports.getAllMessages = getAllMessages;
