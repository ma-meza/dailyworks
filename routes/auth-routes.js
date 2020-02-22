const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const sessionMiddlewares = require('../middlewares/sessionCheck');
const bcrypt = require('bcrypt');
const User = require('../models/userSchema');
const Store = require('../models/storeSchema');
const STRIPE_API = require('../stripeApi/stripe-functions.js');
const saltRoundsBcrypt = 10;
require('dotenv').config();

function createSessionCookie(userId, userType, res, comingFrom){
  var token = jwt.sign({id:userId, type:userType}, process.env.JWT_SECRET_KEY, { expiresIn: 3*60 * 60 *24 });
  res.cookie('appointmentApp', token, { maxAge: 60*60*24*3000, httpOnly: true });
  if(comingFrom == "social"){
    res.redirect('/home');
  }else{
    res.send('ok');
  }
}


router.get('/login', sessionMiddlewares.loggedInCheckForNonProtectedRoutes, function(req, res){
  res.render('clientLogin');
});

router.get('/storeLogin', sessionMiddlewares.loggedInCheckForNonProtectedRoutes, function(req, res){
  res.render('storeLogin');
});

router.get('/signup', sessionMiddlewares.loggedInCheckForNonProtectedRoutes, function(req, res){
  res.render('clientSignup');
});

router.get('/storeSignup', sessionMiddlewares.loggedInCheckForNonProtectedRoutes, function(req,res){

  STRIPE_API.getAllProductsAndPlans().then(products => {
          products = products.filter(product => {
            return product.plans.length > 0;
          });

          res.render('storeSignup', {products: products});
        });
});



router.post('/postLocalClientLogin', sessionMiddlewares.loggedInCheckForNonProtectedRoutes, function(req, res){

var email = req.body.email;
var password = req.body.password;
  User.findOne({email:email, provider:null}).then(function(currentUser){
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
                   createSessionCookie(currentUser._id, 'client', res, 'local');
                 }else{
                   res.send("passwordNoMatch");
                 }

               }
           });
         }else{
           //user doesnt exist
            res.send("userNoExist");
         }



    });


});


router.post('/postLocalStoreLogin', sessionMiddlewares.loggedInCheckForNonProtectedRoutes, function(req, res){

var email = req.body.email;
var password = req.body.password;

  Store.findOne({email:email}).then(function(currentUser){
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
                   createSessionCookie(currentUser._id, 'store', res, 'local');
                 }else{
                   res.send("passwordNoMatch");
                 }

               }
           });
         }else{
           //user doesnt exist
            res.send('userNoExist');
         }



    });


});



// router.post('/postLocalStoreSignup', sessionMiddlewares.loggedInCheckForNonProtectedRoutes, function(req, res){
//   console.log(req.body.planId);
//   var email = req.body.email;
//   var password = req.body.password;
//   var storeName = req.body.storeName;
//   var storeType = req.body.storeType;
//
//   var product = {
//           // name: req.body.productName
//         };
//   var plan = {
//     id: req.body.planId,
//     // name: req.body.planName,
//     // amount: req.body.planAmount,
//     // interval: req.body.planInterval,
//     // interval_count: req.body.planIntervalCount
//   }
//
//
//
//
//
//   Store.findOne({email:email}).then(function(currentUser){
//          if(currentUser){
//            //user exists
//            res.send('alreadyExist');
//          }else{
//            bcrypt.hash(password, saltRoundsBcrypt, function(err, hash) {
//              if(err){
//                console.log(err);
//                res.send('err');
//              }else{
//
//                STRIPE_API.createCustomerAndSubscription(req.body).then(function(stripeSubscriptionObj){
//                  var subscriptionId = stripeSubscriptionObj.id;
//                  var tasksArray = [0,1];
//                        Store.create({ storeName: storeName, email:email, password:hash, type:storeType, stripeSubscriptionId: subscriptionId, registrationTasks:tasksArray}, function (err, storeObj) {
//                        if (err){
//                          console.log(err);
//                          res.send('err');
//                        }else{
//                          res.send('ok');
//                        }
//                      });
//
//                }).catch(err => {
//                  console.log(err);
//                  res.send("err");
//                });
//
//
//              }
//          });
//          }
//     });
// });






router.post('/postLocalStoreSignup', sessionMiddlewares.loggedInCheckForNonProtectedRoutes, function(req, res){
  var email = req.body.email;
  var password = req.body.password;
  var storeName = req.body.storeName;


  Store.findOne({email:email}).then(function(currentUser){
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
    });
});




router.post('/postLocalClientSignup', sessionMiddlewares.loggedInCheckForNonProtectedRoutes, function(req, res){
  console.log(req.body);
  var email = req.body.email;
  var password = req.body.password;
  var clientName = req.body.name;


  User.findOne({email:email, provider:null}).then(function(currentUser){
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



    });
});


//auth logout
router.get('/logout', function(req,res){
res.clearCookie('appointmentApp');
res.redirect('/login');
});


//callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google', { session: false }),function(req, res){
  createSessionCookie(req.user.id, 'client', res, 'social');
});


//auth with google
router.get('/googleAuth', passport.authenticate('google', {
  scope:['profile', 'email'],
  session:false
}));



router.get('/facebookAuth', passport.authenticate('facebook',  { session: false }));

router.get('/facebook/redirect', passport.authenticate('facebook', { scope: 'email', successRedirect: '/home', failureRedirect: '/login', session: false }), function(req, res){
    createSessionCookie(req.user.id, 'client', res, 'social');
});



module.exports = router;
