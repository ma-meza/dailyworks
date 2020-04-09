const STRIPE_API = require('../stripeApi/stripe-functions.js');
const Store = require('../models/storeSchema');
const Event = require('../models/eventSchema');
const Client = require('../models/userSchema');
const ObjectID = require('mongodb').ObjectID;
const mongoose = require('mongoose');
const sessionMiddlewares = require('../middlewares/sessionCheck');
const cookieFunctions = require('../cookieFunctions');

const app = require('express').Router();

  app.get('/home', sessionMiddlewares.loggedInCheck, function(req, res){
  if(res.locals.userType == "store"){

    Event.find({storeId:mongoose.Types.ObjectId(res.locals.userId)}, {_id:1, clientName:1, startDate:1, endDate:1, fullDay:1, services:1}, function(err, eventsObj){
      if(err){
        console.log(err);
        res.redirect('/error');
      }else{
        Store.findOne({_id:mongoose.Types.ObjectId(res.locals.userId)}, {_id:0, storeName:1, newNotifications:1, notifications:1, services:1, employees:1, storeSchedule:1, clientCanPickEmployee:1, storeAbsences:1},function(error, resultObj){
          if(error){
            console.log('error');
            res.redirect('/error');
          }else{
            // object of the store
            res.render('storeHome',{eventsObj:JSON.stringify(eventsObj), storeNotifications:JSON.stringify(resultObj.notifications), employeeObj:JSON.stringify(resultObj.employees), serverStoreObj:JSON.stringify(resultObj),storeObj:resultObj, languageCookie:cookieFunctions.getLanguageCookieValue(req, res)});
          }
        });
      }

    });
  }else{
    Event.find({clientId:mongoose.Types.ObjectId(res.locals.userId)}, {_id:1, storeName:1, employeeName:1, startDate:1, endDate:1, fullDay:1, services:1},{sort: {'startDate': 1}, limit: 3}, function(err, eventsObj){
      if(err){
        console.log(err);
        res.redirect('/error');
      }else{

        Client.findOne({_id:mongoose.Types.ObjectId(res.locals.userId)}, {_id:0},function(error, clientObj){
  if(error){
    console.log(error);
    res.redirect('/error');
  }else{

    res.render('clientHome',{eventsObj:eventsObj, userId:res.locals.userId, clientObj:clientObj, languageCookie:cookieFunctions.getLanguageCookieValue(req, res)});
  }
        });

      }

    });
  //also search for nearby stores for the client
  }
  });

//hybrid error route
  app.get('/error', function(req,res){
    res.send("oups error");
  });
module.exports = app;
