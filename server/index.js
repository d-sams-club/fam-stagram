const multer =require('multer');
// REQUIRED STUFF
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs'); 
const http = require('http');
const session = require('express-session');
const dotenv = require('dotenv');
const db = require('../db/index');
const userInViews = require('./middleware/userInViews');
const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const passport = require('./middleware/passport');



const app = express();
dotenv.config();
const PORT = 3000;
const database = require('../db/index.js');

// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
///////////////////////////////////////////////////////////////////
//  MIDDLEWARE AND AUTH
///////////////////////////////////////////////////////////////////
/*
// secret: JACK nut VISA jack music TOKYO 5 APPLE MUSIC BESTBUY VISA xbox 6 7 3 7 6 visa 3 COFFEE ROPE BESTBUY queen apple nut TOKYO hulu skype KOREAN 
// 7 queen XBOX tokyo TOKYO hulu music bestbuy bestbuy golf ROPE XBOX ROPE korean LAPTOP golf USA apple usa
*/
const sess = {
  secret: 'JnVjmT5AMBVx67376v3CRBqanThsK7qXtThmbbgRXRkLgUau',
  cookie: {},
  resave: false,
  saveUninitialized: true,
};

if (app.get('env') === 'production') {
  sess.cookie.secure = true; // serve secure cookies, requires https
}
app.use(session(sess));

app.use(passport.initialize());
app.use(passport.session());



app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(express.static(`${__dirname}/../client/`));
app.use(bodyParser.json());
app.use(userInViews());
app.use('/', authRouter);
app.use('/', indexRouter);
app.use('/', usersRouter);


///////////////////////////////////////////////////////////////////
// ROUTE/PAGE LOADING:
///////////////////////////////////////////////////////////////////

const upload = multer({
  dest: __dirname + "/pictures/raw"
});

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

// the home page with the join family, create family, and logout
app.get('/', (req, res) => {
  console.log('page loaded');
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

// the 'auth' page, where the login and signup will be
// app.get('/login', (req, res) => {
//   // once front end people give me a file for the signin/signup page i will be able to render it
//   // --> res.render('templates/signLog')
//   res.statusCode = 200;
// });

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