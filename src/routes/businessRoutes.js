const sessionMiddlewares = require('../middlewares/sessionCheck');
const cookieFunctions = require('../cookieFunctions');
const STRIPE_API = require('../stripeApi/stripe-functions.js');
const Store = require('../models/storeSchema');
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const yj = require('yieldable-json');
const app = require('express').Router();

app.get('/storeLogin', sessionMiddlewares.denyIfLoggedIn, function (req, res) {
  res.render('storeLogin');
});

app.get('/storeSignup', sessionMiddlewares.denyIfLoggedIn, function (req, res) {
  STRIPE_API.getAllProductsAndPlans().then((products) => {
    products = products.filter((product) => {
      return product.plans.length > 0;
    });

    res.render('storeSignup', { products: products });
  });
});

app.get('/signupTestStore', function (req, res) {
  res.render('signupTestStore');
});

app.get('/welcomeBusiness', function (req, res) {
  res.render('indexStoreLandingPage', {
    languageCookie: cookieFunctions.getLanguageCookieValue(req, res),
  });
});

app.get('/settings', sessionMiddlewares.loggedInCheck, function (req, res) {
  if (res.locals.userType == 'store') {
    Store.findOne(
      { _id: mongoose.Types.ObjectId(res.locals.userId) },
      {
        _id: 0,
        storeName: 1,
        newNotifications: 1,
        notifications: 1,
        services: 1,
        employees: 1,
        storeSchedule: 1,
        storeAbsences: 1,
        facebookLink: 1,
        instagramLink: 1,
        websiteLink: 1,
        clientCanPickEmployee: 1,
        location: 1,
        phoneNumber: 1,
        email: 1,
      },
      function (err, resultObj) {
        if (err) {
          console.log(err);
          res.redirect('/error');
        } else {
          res.render('storeSettings', {
            storeObj: resultObj,
            languageCookie: cookieFunctions.getLanguageCookieValue(req, res),
          });
        }
      }
    );
  } else {
    res.redirect('/home');
  }
});

// app.get('/analytics', sessionMiddlewares.loggedInCheck, function(req, res){
// if(res.locals.userType == "store"){
//   Store.findOne({_id:mongoose.Types.ObjectId(res.locals.userId)}, {password:0}, function(err, resultObj){
//     if(err){
//       console.log(err);
//       res.redirect('/error');
//     }else{
//       console.log(resultObj);
//       res.render('storeAnalytics', {storeObj:resultObj, languageCookie:cookieFunctions.getLanguageCookieValue(req, res)});
//     }
//
//   });
// }else{
//   res.redirect('/home');
// }
// });

module.exports = app;
