require('dotenv').config();
const multer = require('multer');
// REQUIRED STUFF
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const session = require('express-session');
const sgMail = require('@sendgrid/mail');
const http = require('http');
const axios = require('axios');
const db = require('../db/index');
const userInViews = require('./middleware/userInViews');
const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const passport = require('./middleware/passport');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const app = express();
const PORT = 3000;
const database = require('../db/index.js');

// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
// /////////////////////////////////////////////////////////////////
//  MIDDLEWARE AND AUTH
// /////////////////////////////////////////////////////////////////
/*

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
app.use(express.static(`${__dirname}/../client/templates`));
app.use(bodyParser.json());
app.use(userInViews());
app.use('/', authRouter);
app.use('/', indexRouter);
app.use('/', usersRouter);


// /////////////////////////////////////////////////////////////////
// ROUTE/PAGE LOADING:
// /////////////////////////////////////////////////////////////////

const upload = multer({
  dest: `${__dirname}/pictures/raw`,
});

const handleError = (err, res) => {
  res
    .status(500)
    .contentType('text/plain')
    .end('Oops! Something went wrong!');
};

let picNumber = 0;
// the home page with the join family, create family, and logout
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/photos', upload.single('file'), (req, res) => {
  console.log(req);
  const tempPath = req.file.path;
  const targetPath = path.join(__dirname, `/pictures/${picNumber}.png`);

  if (path.extname(req.file.originalname).toLowerCase() === '.png') {
    fs.rename(tempPath, targetPath, (err) => {
      if (err) {
        console.log(err);
        return handleError(err, res);
      }

      fs.appendFile(`${__dirname}/pictures/order.txt`, `${picNumber}\n`);
      db.savePhoto({
        name: picNumber,
        code: currentCode,
      })
        .then(() => {
          // res.statusCode = 200;
          res.redirect('/#!/photos');
          picNumber += 1;
        })
        .catch((err) => {
          console.log(err);
          res.redirect('/#!/photos');
        });
    });
  } else {
    fs.unlink(tempPath, (err) => {
      if (err) {
        console.log(err);
        return handleError(err, res);
      }

      res.statusCode = 403;
      res.end('Only .png files are allowed!');
    });
  }
});

app.get('/photos', (req, res) => {
  db.getPhotos(currentCode)
    .then((photos) => {
      console.log(photos);
      res.send(photos);
    });
});

app.get('/photo/:id', (req, res) => {
  res.sendFile(path.join(__dirname, `./pictures/${req.params.id}.png`));
});

app.get('/photo', (req, res) => {
  console.log(req.params);
});



// the 'auth' page, where the login and signup will be
// app.get('/login', (req, res) => {
//   // once front end people give me a file for the signin/signup page i will be able to render it
//   // --> res.render('templates/signLog')
//   res.statusCode = 200;
// });
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
  currentFam = famName;
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

app.post('/threadmessages', (req, res) => {
  req.body.familyCode = currentCode;
  const { familyCode, text, userId } = req.body;
  // use req.body.parentText to get the parent id
  // const parentName = req.body.parentText.name;
  const parentText = req.body.parentText.text;
  const obj = {
    code: currentCode,
    parentText,
  };
  database.getParentMessage(obj)
    .then((data) => {
      data[0].then(([results, metadata]) => {
        const message = {
          familyCode,
          text,
          parentMess: results[0].id,
          userId,
        };
        if (message.text) {
          database.saveMessage(message)
            .then(() => {
              res.status(200);
              res.json({ parentId: results[0].id });
            })
            .catch((error) => {
              console.error(error);
              res.sendStatus(404);
            });
        } else {
          res.json({ parentId: results[0].id });
        }
      });
    });
});

app.get('/events', (re, res) => {


  const obj = {
    code: currentCode,
  };
  database.getEvents()
    .then((data) => { 
        res.statusCode = 200;
        res.json(data[0]);
    })
    .catch((err) => {
      // an err here just means the current fam has no messages so roomName wont show
      res.send({
        results: [
          [],
        ],
        famName: currentFam,
      });
    });
});

app.post('/events', (req, res) => {
  req.body.familyCode = currentCode;
  database.saveEvent(req.body)
    .then((data) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(404);
    });
app.post('/chatphotos', upload.single('file'), (req, res) => {
  console.log(req);
  const tempPath = req.file.path;
  const targetPath = path.join(__dirname, `/pictures/${picNumber}.png`);

  if (path.extname(req.file.originalname).toLowerCase() === '.png') {
    fs.rename(tempPath, targetPath, (err) => {
      if (err) {
        console.log(err);
        return handleError(err, res);
      }

      fs.appendFile(`${__dirname}/pictures/order.txt`, `${picNumber}\n`);
      db.saveChatPhotos({
        name: picNumber,
        familyCode: currentCode,
      })
        .then(() => {
          // res.statusCode = 200;
          // res.redirect('/#!/photos');
          picNumber += 1;
        })
        .catch((err) => {
          console.log(err);
          // res.redirect('/#!/photos');
        });
    });
  } else {
    fs.unlink(tempPath, (err) => {
      if (err) {
        console.log(err);
        return handleError(err, res);
      }

      res.statusCode = 403;
      res.end('Only .png files are allowed!');
    });
  } 
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
      // an err here just means the current fam has no messages so roomName wont show
      res.send({
        results: [
          [],
        ],
        famName: currentFam,
      });
    });
});

app.get('/threadmessages', (req, res) => {
  const obj = {
    parentId: req.query.parentId,
    code: currentCode,
  };
  database.getThreadMessages(obj)
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
      // an err here just means the current fam has no messages so roomName wont show
      res.send({
        results: [
          [],
        ],
        famName: currentFam,
      });
    });
});

app.post('/users', (req, res) => {
  database.saveUser(req.body)
    .then((data) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(404);
    });
});

app.get('/currentUser', (req, res) => {
  console.log('current user');
  database.getAllUsers()
    .then((data) => {
      const latestId = data[0][data[0].length - 1].id;
      res.send({ personId: latestId });
    });
  res.statusCode = 200;
});

app.get('/getActivities', (req, res) => {
  const AuthStr = 'Bearer '.concat(process.env.YELP);
  console.log(AuthStr, req.query.location);
  axios.get('https://api.yelp.com/v3/businesses/search', {
    headers: { Authorization: AuthStr },
    params: {
      location: req.query.location,
      term: 'Active Life',
      limit: 5,
    },
  })
    .then((response) => {
      res.statusCode = 200;
      console.log(response);
      res.send(response.data.businesses);
    })
    .catch((error) => {
      console.error(error);
      res.end();
    });
});

app.post('/sendEmail', (req, res) => {
  const msg = {
    to: req.body.recipientEmail,
    from: 'FamstagramMail@gmail.com',
    subject: 'Welcome to Famstagram',
    html: `Your have been invited to join the ${currentFam} family on Famstagram. Your Join Code is <strong>${currentCode}</strong>!
    <br><br><br> Famstagram - The more intimate Instagram`,
  };
  sgMail.send(msg);
  res.statusCode = 200;
  res.end();
});

app.listen(PORT, () => {
  console.log(`app listening on ${PORT}!`);
});
