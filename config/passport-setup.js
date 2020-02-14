const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth20' );
const User = require('../models/userSchema');
const FacebookStrategy = require('passport-facebook').Strategy;
require('dotenv').config();
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/google/redirect",
  },
  function(accessToken, refreshToken, profile, done) {
     User.findOne({socialNetId:profile.id}).then(function(currentUser){
            if(currentUser){
              //user already exists
              done(null, currentUser);
            }else{
              //user doesnt exist so create new one in our db
                new User({clientName:profile.displayName, socialNetId:profile.id, email:profile.emails[0].value, profilePictureLink:profile.photos[0].value, provider:'google'}).save().then(function(err, newUser){
                  done(null, newUser);
                });
            }



       });


  }
));




passport.use(new FacebookStrategy({
    clientID: process.env.FB_APP_ID,
    clientSecret: process.env.FB_APP_SECRET,
    callbackURL: "http://www.example.com/auth/facebook/callback",
    profileFields: ['id', 'emails', 'name', 'photos']
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({socialNetId:profile.id}).then(function(currentUser){
           if(currentUser){
             //user already exists
             done(null, currentUser);
           }else{
             //user doesnt exist so create new one in our db
               new User({clientName:profile.displayName, socialNetId:profile.id, email:profile.emails[0].value, profilePictureLink:profile.photos[0].value, provider:'facebook'}).save().then(function(err, newUser){
                 done(null, newUser);
               });
           }



      });
  }
));
