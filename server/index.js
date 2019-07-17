const express = require('express');
const app = express()
const path = require('path');
const bodyParser = require('body-parser');
const PORT = 3000;
const database = require('../db/index.js')
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname+ '/../client/'))
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('index');
  res.statusCode = 200;
});
app.post('/messages', (req, res) => {
  database.save(req.body)
  res.statusCode = 200;
  res.end()
});

app.get('/messages', (req, res) => {
  database.getAllMessages((err, data) => {
    if(err){
      console.error(err);
      res.statusCode = 404;
      res.end();
    }
    res.statusCode = 200;
    res.send(data)
  })
});






app.listen(PORT, () => {
  console.log(`app listening on ${PORT}!`)
});