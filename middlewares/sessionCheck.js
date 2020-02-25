const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
app.use(cookieParser());

require('dotenv').config();


exports.loggedInCheckForNonProtectedRoutes = function(req, res, next){
  if(!req.cookies.appointmentApp){
    //if user not logged in
    next();
  }else{
    var theCookie = req.cookies.appointmentApp;
    jwt.verify(theCookie, process.env.JWT_SECRET_KEY, function(err,decryptedToken){
      if(err){
        res.redirect('/logout');
      }else{
        res.locals.userId = decryptedToken.id;
        res.locals.userType = decryptedToken.type;

        res.redirect('/home');
      }

    });

  }

};



exports.loggedInCheck = function(req, res, next){

if(!req.cookies.appointmentApp){
  //if user not logged in
  res.redirect('/login');
}else{
  var theCookie = req.cookies.appointmentApp;
  jwt.verify(theCookie, process.env.JWT_SECRET_KEY, function(err,decryptedToken){
    if(err){
      res.redirect('logout');
    }else{
      res.locals.userId = decryptedToken.id;
      res.locals.userType = decryptedToken.type;
      console.log(res.locals.userType);
      next();
    }

  });

}

};
