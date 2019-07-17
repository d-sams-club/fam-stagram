const express = require('express');
const app = express()
const path = require('path');
const bodyParser = require('body-parser');
const PORT = 3000;
// needs to handle routes for all pages\\
// routes: sign-log, homepage, groups, chats

//signup/login page
/*data handlers: /sign-log/:newUser (post) post request bc we are putting a new user on the user table in the db
                /sign-log/:user (get) <<--- maybe get request because we already have that user on the db
                /

*/
// probably wont use just /
app.use('/static', express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  console.log('got index.html');
  res.sendFile(path.join(__dirname + '/../client/index.html'));
});





app.listen(PORT, () => {
  console.log(`app listening on ${PORT}!`)});