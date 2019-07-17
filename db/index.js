var mysql = require('mysql');

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "famstagram"
});

db.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

getAllMessages = (callback) => {
   db.query("select users.name, messages.text from users, messages where messages.userId = users.id;", function (err, result, fields) {
    if (err){
      callback(err, null);
      return;
    }
      console.log(result);
      callback(null, result);
  });
}

save = (obj) => {
  db.query(`insert into messages (userId, familyId, text) values ("${obj.userId}", "${obj.familyId}", "${obj.text}")`, function (err, result, fields) {
    if (err){
      console.error(err);
      return;
    }
  });
}


module.exports.db = db;
module.exports.save = save;
module.exports.getAllMessages = getAllMessages;