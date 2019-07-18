const express = require('express');

const app = express();
const bodyParser = require('body-parser');

const PORT = 3000;
const database = require('../db/index.js');

app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(express.static(`${__dirname}/../client/`));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('index');
  res.statusCode = 200;
});

app.post('/messages', (req, res) => {
  database.saveMessage(req.body)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(404);
    });
});

app.get('/messages', (req, res) => {
  database.getAllMessages()
    .then(([results, metadata]) => {
      res.statusCode = 200;
      res.send(results);
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(404);
    });
});

app.post('/users', (req, res) => {
  database.saveUser(req.body)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(404);
    });
});

app.listen(PORT, () => {
  console.log(`app listening on ${PORT}!`);
});