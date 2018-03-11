/**
 * Refresh Token App
 *
 * Run this to get a user's refresh token
 * for Google Calendar
 */

/* Node modules */

/* Third-party modules */
const express = require('express');
const Google = require('passport-google-oauth').OAuth2Strategy;
const passport = require('passport');

/* Files */

passport.use(new Google({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/callback',
  skipUserProfile: true,
}, (accessToken, refreshToken, profile, done) => {
  console.log({
    accessToken,
    refreshToken,
    profile,
    done,
  });

  done();
}));

const app = express();

app.get('/auth/google', passport.authenticate('google', {
  accessType: 'offline',
  prompt: 'consent',
  scope: [
    'https://www.googleapis.com/auth/calendar',
  ]
}));

app.get('/auth/callback', passport.authenticate('google', {
  failureRedirect: '/'
}), function(req, res) {
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Listening');
});
