const app = require('express').Router();
const mongoose = require('mongoose');

//post to set language cookie of client or business
app.post('/setlangCookie', function(req, res){
  var languageChosen = req.body.lang;
  if(languageChosen && (languageChosen == 'fr' || languageChosen == "en")){
    res.cookie('lang', languageChosen, { maxAge: 60*60*24*3000, httpOnly: true });
    res.send('ok');
  }else{
    res.send('error');
  }
});


module.exports = app;
