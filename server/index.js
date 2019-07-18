// REQUIRED STUFF
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const db = require('../db/index');
const userInViews = require('./middleware/userInViews');
const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');



const app = express()
dotenv.config();
const PORT = 3000;

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
  saveUninitialized: true
};

if (app.get('env') === 'production') {
  sess.cookie.secure = true; // serve secure cookies, requires https
}
app.use(session(sess));

const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:
      process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
  },
  function (accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  }
);

  passport.use(strategy);
      passport.serializeUser(function(user, done) {
        console.log(user);
        done(null, user.id);
      });
      passport.deserializeUser(function(user, done) {
        done(null, user);
      });
app.use(passport.initialize());
app.use(passport.session());


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname+ '/../client/'))
app.use(bodyParser.json());
app.use(userInViews());
app.use('/', authRouter);
app.use('/', indexRouter);
app.use('/', usersRouter);

///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////




///////////////////////////////////////////////////////////////////
// ROUTE/PAGE LOADING:
///////////////////////////////////////////////////////////////////

// the home page with the join family, create family, and logout
app.get('/', (req, res) => {
  console.log('page loaded');
  res.render('index');
});

// the 'auth' page, where the login and signup will be
app.get('/login', (req, res) => {
  // once front end people give me a file for the signin/signup page i will be able to render it
  // --> res.render('templates/signLog')
  res.render('index');
});

// family page where the photos will be displayed fist, with the nav bar with: share code, leave group, chats, gallery(wont do anything ) !! might just let gallery be
//  refered to as the /family route since they are the same page
app.get('/family', (req, res) => {
  // once front end people give me a file for the family page i will be able to render it
  // --> res.render('templates/family')
});


// family page as well but when chats was clicked from /family it renders the chat room 
app.get('/chats', (req, res) => {
  // once front end people give me a file for the chats page i will be able to render it
  // --> res.render('templates/chats')
});
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////
// REQUEST HANDLING
///////////////////////////////////////////////////////////////////
app.post('/message', (req, res) => {
  // need the insert query function from the db
  /**
   * const { message } = req.body;
    db.postMessage(message)
    .then(result => {
      console.log('message added to db', result);
      dont necesarily need to send anything, but we send this so the client can log it on the page so we can see what we just posted on the console
      res.send(result.data);
    })
    .catch(err => {
      console.error('failed query: ', err);
    });
   */
});

app.get('/messages', (req, res) => {
  // need to get all the messages from the db by selecting all from the messages table
  /*
    db.getMessages()
    .then(messages => {
      // we will need to send the messages (the whole array) for the client to render all of the messages
      console.log('got all messages: ', messages);
      res.send(messages.data);
    })
    .catch(err => {
      console.error('failed to get messages: ', err);
    });
  
  */
});

app.post('/photo', (req, res) => {
    // need to see how we will be going about posting and getting the photos first
});

app.get('/photos', (req, res) => {
    // need to see how we will be going about posting and getting the photos first
});
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////




app.listen(PORT, () => {
  console.log(`app listening on ${PORT}!`)
});