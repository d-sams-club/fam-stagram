const db = require('./models.js');

db.sync()
  .then(() => {
    console.log('Database Connected!');
  })
  .catch((error) => {
    console.error(error);
  });

const saveUser = obj => db.query(`insert into users (name, email) values ("${obj.name}", "${obj.email}");`);

const saveMessage = obj => db.models.family.findOne({
  where: {
    code: obj.familyCode,
  },
}).then(data => db.query(`insert into messages (userId, familyId, parentMess, text, imageUrl) values (${obj.userId}, ${data.id}, ${obj.parentMess || null}, "${obj.text}", "undefined");`));

// const saveThreadMessage = obj => db.models.family.findOne({
//   where: {
//     code: obj.familyCode,
//   },
// }).then(data => db.query(`insert into messages (userId, familyId, text) values (${obj.userId}, ${data.id}, "${obj.text}");`));

const getAllMessages = obj => db.models.family.findOne({
  where: {
    code: obj.code,
  },
}).then(data => [db.query(`select users.name, messages.text, messages.imageUrl from users, messages where messages.userId = users.id && messages.parentMess IS NULL && messages.familyId = ${data.id}`), data.name]);

const getParentMessage = obj => db.models.family.findOne({
  where: {
    code: obj.code,
  },
}).then(data => [db.query(`select messages.id, messages.userId, messages.text from messages where messages.familyId = ${data.id} && messages.text = "${obj.parentText}" && messages.imageUrl = "${obj.imageUrl}"  `), data.name]);

const getThreadMessages = obj => db.models.family.findOne({
  where: {
    code: obj.code,
  },
}).then(data => [db.query(`select users.name, messages.text from users, messages where messages.userId = users.id && messages.parentMess = ${obj.parentId} && messages.familyId = ${data.id}`), data.name]);

const saveFamily = obj => db.models.family.findAll({
  where: {
    code: obj.code,
  },
}).then((results) => {
  if (!results.length) {
    return db.query(`insert into families (name, code) values ("${obj.name}", "${obj.code}");`);
  }
});

const getAllUsers = () => db.query('select * from users');

const getUsersEmails = () => db.query('select email from users');

const savePhoto = obj => db.query(`insert into photos (url, family) values ("${obj.name}", "${obj.code}")`);

const getPhotos = code => db.models.photo.findAll({
  where: {
    family: code,
  },
});

const saveEvent = obj => db.models.family.findOne({
  where: {
    code: obj.familyCode,
  },
}).then(data => db.query(`insert into events (text, description, start_date, end_date, userId, familyId) values ("${obj.text}", "${obj.business}", "${obj.start_date}", "${obj.end_date || obj.start_date}", ${obj.userId}, ${data.id});`));

// const getEvents = obj => db.models.family.findOne({
//   where: {
//     code: obj.code,
//   },
// }).then(data => db.query(`select * FROM events where events.familyId = ${data.id}`));

const getEvents = () => db.models.events.findAll();

const saveChatPhotos = obj => db.models.family.findOne({
  where: {
    code: obj.familyCode,
  },
}).then(data => db.query(`insert into messages (userId, text, imageUrl, familyId) values (${obj.userId}, "${obj.text}", "${obj.name}", ${data.id})`));


module.exports.db = db;
module.exports.saveUser = saveUser;
module.exports.saveFamily = saveFamily;
module.exports.saveMessage = saveMessage;
module.exports.getAllUsers = getAllUsers;
module.exports.getAllMessages = getAllMessages;
module.exports.savePhoto = savePhoto;
module.exports.getPhotos = getPhotos;
module.exports.getParentMessage = getParentMessage;
module.exports.getThreadMessages = getThreadMessages;
module.exports.saveEvent = saveEvent;
module.exports.getEvents = getEvents;
module.exports.saveChatPhotos = saveChatPhotos;
module.exports.getUsersEmails = getUsersEmails;
