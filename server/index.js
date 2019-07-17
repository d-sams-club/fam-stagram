const express = require('express');
const app = express()
const path = require('path');
const bodyParser = require('body-parser');
const PORT = 3000;

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname+ '/../client/'))
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(PORT, () => {
  console.log(`app listening on ${PORT}!`)
});