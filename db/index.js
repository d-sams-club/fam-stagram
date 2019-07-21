const db = require('./models.js');

db.sync()
  .then(() => {
    console.log('Database Connected!');
  })
  .catch((error) => {
    console.error(error);
  });

const saveUser = (obj) => {
  db.models.user.findAll({
    where: {
      name: obj.name,
      email: obj.email,
    },
  }).then((results) => {
    if (!results.length) {
      return db.query(`insert into users (name, email) values ("${obj.name}", "${obj.email}");`);
    }
  });
};

const saveMessage = (obj) => {
  return db.models.family.findOne({
    where: {
      code: obj.familyCode,
    },
  }).then((data) => {
    return db.query(`insert into messages (userId, familyId, text) values (${obj.userId}, ${data.id}, "${obj.text}");`);
  });
};

const getAllMessages = (obj) => {
  return db.models.family.findOne({
    where: {
      code: obj.code,
    },
  }).then((data) => {
    return [db.query(`select users.name, messages.text from users, messages where messages.userId = users.id && messages.familyId = ${data.id}`), data.name];
  });
};

const saveFamily = (obj) => {
  return db.models.family.findAll({
    where: {
      code: obj.code,
    },
  }).then((results) => {
    if (!results.length) {
      return db.query(`insert into families (name, code) values ("${obj.name}", "${obj.code}");`);
    }
  });
};

const savePhoto = obj => db.query(`insert into photos (url, family) values ("${obj.name}", "${obj.code}")`);

const getPhotos = code => db.models.photo.findAll({
  where: {
    family: code,
  },
});

module.exports.db = db;
module.exports.saveUser = saveUser;
module.exports.saveFamily = saveFamily;
module.exports.saveMessage = saveMessage;
module.exports.getAllMessages = getAllMessages;
module.exports.savePhoto = savePhoto;
module.exports.getPhotos = getPhotos;
