const express = require('express');
const app = express()
const path = require('path');
const bodyParser = require('body-parser');
const db = require('../db/index');
const PORT = 3000;

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname+ '/../client/'))
app.use(bodyParser.json());

// will handle all authenticating in server
// domain: dev-sn985q6v.auth0.com
// client id: EhZnOVZG6gBJZvh0tRLL5mSJVUAMFMb2
// client secret: my7ovaY3uSVSYDrE4K0VRJanVqf208kP356mxy5qSQT2BORh


///////////////////////////////////////////////////////////////////
// ROUTE/PAGE LOADING:
///////////////////////////////////////////////////////////////////

// the home page with the join family, create family, and logout
app.get('/', (req, res) => {
  res.render('index');
});

// the 'auth' page, where the login and signup will be
app.get('/signLog', (req, res) => {
  // once front end people give me a file for the signin/signup page i will be able to render it
  // --> res.render('templates/signLog')
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