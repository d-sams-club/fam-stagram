const multer =require('multer');
const express = require('express');
const app = express()
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs'); 
const http = require('http');
const PORT = 3000;


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname+ '/../client/'))
app.use(bodyParser.json());

const upload = multer({
  dest: __dirname + "/pictures/raw"
});

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/pictures', upload.single("file"),(req, res) => {
  console.log(req);
  const tempPath = req.file.path;
  const targetPath = path.join(__dirname, `/pictures/${req.file.originalname}`);

  if (path.extname(req.file.originalname).toLowerCase() === ".png") {
    fs.rename(tempPath, targetPath, err => {
      if (err){ 
        console.log(err);
        return handleError(err, res);
      }

      fs.appendFile(`${__dirname}/pictures/order.txt`, `${req.file.originalname}\n`)
      res.status(200)
        .contentType("text/plain")
        .end("File uploaded!");
    });
  } else {
    fs.unlink(tempPath, err => {
      if (err) {
        console.log(err);
        return handleError(err, res);
      }

      res.status(403)
        .contentType("text/plain")
        .end("Only .png files are allowed!");
    });
  }
});





app.listen(PORT, () => {
  console.log(`app listening on ${PORT}!`)
});