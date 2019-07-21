const db = require('./models.js');

db.sync()
  .then(() => {
    console.log('Database Connected!');
  })
  .catch((error) => {
    console.error(error);
  });
const saveUser = obj => db.query(`insert into users (name , email, password) values ("${obj.name}", "${obj.email}", "${obj.password}");`);

const saveMessage = obj => db.query(`insert into messages (userId, familyId, text) values (${obj.userId}, ${obj.familyId}, "${obj.text}");`);

const getAllMessages = () => db.query('select users.name, messages.text from users, messages where messages.userId = users.id;');


module.exports.db = db;
module.exports.saveUser = saveUser;
module.exports.saveMessage = saveMessage;
module.exports.getAllMessages = getAllMessages;
