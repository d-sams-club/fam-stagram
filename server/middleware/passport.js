/* eslint-disable no-console */
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const database = require('../../db/index');


const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:

    'http://localhost:3000/callback' || `http://${process.env.HOST}:3000/callback`,  
  },
  ((accessToken, refreshToken, extraParams, profile, done) => done(null, profile)
  ),
);

passport.use(strategy);
passport.serializeUser((user, done) => {
  database.saveUser({
    name: user.displayName,
    email: user.emails[0].value,
  });
  done(null, user.id);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
