// REQUIRED STUFF
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const db = require('../db/index');
const userInViews = require('./middleware/userInViews');
const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const passport = require('./middleware/passport');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const app = express();
dotenv.config();
const PORT = 3000;
const database = require('../db/index.js');

// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
// /////////////////////////////////////////////////////////////////
//  MIDDLEWARE AND AUTH
// /////////////////////////////////////////////////////////////////
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



// /////////////////////////////////////////////////////////////////
// ROUTE/PAGE LOADING:
// /////////////////////////////////////////////////////////////////

// the home page with the join family, create family, and logout
app.get('/', (req, res) => {
  res.render('index');
});

const makeId = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};


let currentCode = 'OUTSIDE CODE';
let currentFam = 'CURRENT FAMILY';

app.post('/fam', (req, res) => {
  console.log(req.session);
  currentCode = makeId(10);
  const famName = req.body.name;
  database.saveFamily({
    name: famName,
    code: currentCode,
  })
    .then(() => {
      res.statusCode = 200;
      res.end();
    });
});

app.post('/code', (req, res) => {
  currentCode = req.body.code;
  res.end();
});

// app.get('/fam', (req, res) => {
// });
app.post('/messages', (req, res) => {
  req.body.familyCode = currentCode;
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
  const obj = {
    code: currentCode,
  };
  database.getAllMessages(obj)
    .then((data) => {
      res.statusCode = 200;
      const promise = data[0];
      currentFam = data[1];
      promise.then(([results, metadata]) => {
        res.statusCode = 200;
        res.send({
          results,
          famName: currentFam,
        });
      });
    })
    .catch((err) => {
      res.statusCode = 404;
      console.error(err);
      res.end();
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

app.post('/sendEmail', (req, res) => {
  const msg = {
    to: req.body.recipientEmail,
    from: 'kingdweeber@gmail.com',
    subject: 'Welcome to Famstagram',
    html: `Your have been invided to join the ${currentFam} family on Famstagram. Your Join Code is <strong>${currentCode}</strong>!
    <br><br><br> Famstagram - The more intamate Instagram`,
  };
  sgMail.send(msg);


  res.statusCode = 200;
  res.end();
});

app.listen(PORT, () => {
  console.log(`app listening on ${PORT}!`);
});
