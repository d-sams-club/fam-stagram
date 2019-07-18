const express = require('express');

const app = express();
const bodyParser = require('body-parser');

const PORT = 3000;
const database = require('../db/index.js');

app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(express.static(__dirname + '/../client/'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('index');
  res.statusCode = 200;
});
app.post('/messages', (req, res) => {
  database.save(req.body);
  res.sendStatus(200);
});

app.get('/messages', (req, res) => {
  database.getAllMessages()
    .then(([results, metadata]) => {
      res.statusCode = 200;
      res.send(results);
    });
});

app.listen(PORT, () => {
  console.log(`app listening on ${PORT}!`);
});
