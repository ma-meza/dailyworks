// const cookieParser = require('cookie-parser');
// app.use(cookieParser());
const passport = require('passport');
const passportSetup = require('../config/passport-setup');
const sessionMiddlewares = require('../middlewares/sessionCheck');
const bcrypt = require('bcrypt');
const Client = require('../models/userSchema');
const Store = require('../models/storeSchema');
const ObjectID = require('mongodb').ObjectID;
var cookieFunctions = require('../cookieFunctions');
const saltRoundsBcrypt = 10;
const mongoose = require('mongoose');
const app = require('express').Router();

  app.post('/postLocalClientLogin', sessionMiddlewares.denyIfLoggedIn, function(req, res){

  var email = req.body.email;
  var password = req.body.password;
    Client.findOne({email:email, provider:null}, {password:1, _id:1, email:1}, function(errorFind, currentUser){
      if(!errorFind){
        if(currentUser){
          //user exists
          bcrypt.compare(password, currentUser.password, function(err, respBcrypt) {
              // res == true
              if(err){
                console.log(err);
                res.send('err');
              }else{
                //pass match
                if(respBcrypt == true){
                  cookieFunctions.createSessionCookie(currentUser._id, 'client', res, function(){ res.send('ok');});

                }else{
                  res.send("passwordNoMatch");
                }
              }
          });
        }else{
          //user doesnt exist
           res.send("userNoExist");
        }
      }else{
        res.send(err);
          }
      });
  });


  app.post('/postLocalStoreLogin', sessionMiddlewares.denyIfLoggedIn, function(req, res){
  var email = req.body.email;
  var password = req.body.password;
    Store.findOne({email:email}, {password:1, _id:1, email:1}, function(errorFind, currentUser){
      if(!errorFind){
        if(currentUser){
          //user exists
          bcrypt.compare(password, currentUser.password, function(err, resBcrypt) {
              // res == true
              if(err){
                console.log(err);
                res.send('err');
              }else{
                //pass match
                if(resBcrypt == true){
                  cookieFunctions.createSessionCookie(currentUser._id, 'store', res, function(){res.send('ok');});
                }else{
                  res.send("passwordNoMatch");
                }
              }
          });
        }else{
          //user doesnt exist
           res.send('userNoExist');
        }
      }else{
        res.send('err');
      }
      });
  });


  app.post('/postLocalStoreSignup', sessionMiddlewares.denyIfLoggedIn, function(req, res){
    var email = req.body.email;
    var password = req.body.password;
    var storeName = req.body.storeName;
    Store.findOne({email:email}, {email:1, _id:1, password:1}, function(errorFind, currentUser){
      if(!errorFind){
        if(currentUser){
          //user exists
          res.send('alreadyExist');
        }else{
          bcrypt.hash(password, saltRoundsBcrypt, function(err, hash) {
            if(err){
              console.log(err);
              res.send('err');
            }else{
                var tasksArray = [0,1];
                      Store.create({ storeName: storeName, email:email, password:hash, registrationTasks:tasksArray}, function (err, storeObj) {
                      if (err){
                        console.log(err);
                        res.send('err');
                      }else{
                        res.send('ok');
                      }
                    });
            }
        });
        }
      }else{
        res.send('err');
      }
      });
  });




  app.post('/postLocalClientSignup', sessionMiddlewares.denyIfLoggedIn, function(req, res){
    console.log(req.body);
    var email = req.body.email;
    var password = req.body.password;
    var clientName = req.body.name;
    Client.findOne({email:email, provider:null}, {_id:0, email:1}, function(errorFind, currentUser){
      if(!errorFind){
        if(currentUser){
          //user exists
          res.send('alreadyExist');
        }else{
          //user doesnt exist
          bcrypt.hash(password, saltRoundsBcrypt, function(err, hash) {
            console.log(hash);
            if(err){
              console.log(err);
              res.send('err');
            }else{
              User.create({ email:email, password:hash, clientName:clientName}, function (err, clientObj) {
              if (err){
                console.log(err);
                res.send('err');
              }else{
                res.send('ok');
              }
            });
            }
        });
        }
      }else{
        res.send('err');
      }
      });
  });


  //auth logout
  app.get('/logout', sessionMiddlewares.loggedInCheck, function(req, res) {
      var userType = res.locals.userType;
      res.clearCookie('appointmentApp');
      if (userType == "store") {
          res.redirect('/storeLogin');
      } else {
          res.redirect('/login');
      }
  });


  //callback route for google to redirect to
  app.get('/google/redirect', passport.authenticate('google', { session: false }),function(req, res){
    cookieFunctions.createSessionCookie(req.user.id, 'client', res, function(){res.redirect('/home');});
  });


  //auth with google
  app.get('/googleAuth', passport.authenticate('google', {
    scope:['profile', 'email'],
    session:false
  }));



  app.get('/facebookAuth', passport.authenticate('facebook',  { session: false }));

  app.get('/facebook/redirect', passport.authenticate('facebook', { scope: 'email', successRedirect: '/home', failureRedirect: '/login', session: false }), function(req, res){
      cookieFunctions.createSessionCookie(req.user.id, 'client', res, function(){res.redirect('/home');});
  });



module.exports = app;
