const jwt = require('jsonwebtoken');

 function getLanguageCookieValue(req, res){
  var cookieLang = req.cookies.lang;
  if(!cookieLang){
    // var localeString = req.headers['accept-language'];
    // var splittedLangString = localeString.split(';');
    // for(var i=0;i<splittedLangString.length;i++){
    //   var twiceSplittedString = splittedLangString[i].split(',');
    //   for(var j=0;j<twiceSplittedString.length;j++){
    //     if(twiceSplittedString[j] == 'en' || twiceSplittedString[j] == 'en-US'){
    //       res.cookie('lang', 'en', { maxAge: 60*60*24*3000, httpOnly: true });
    //       return 'en';
    //     }else if(twiceSplittedString[j] == 'fr' || twiceSplittedString[j] == 'fr-FR'){
    //       res.cookie('lang', 'fr', { maxAge: 60*60*24*3000, httpOnly: true });
    //       return 'fr';
    //     }else{
    //       res.cookie('lang', 'en', { maxAge: 60*60*24*3000, httpOnly: true });
    //       return 'en';
    //     }
    //   }
    // }
    res.cookie('lang', 'en', { maxAge: 60*60*24*3000, httpOnly: true });
    return 'en';
  }else{
    return req.cookies.lang;
  }
}


function createSessionCookie(userId, userType, res, callback){
  var token = jwt.sign({id:userId, type:userType}, process.env.JWT_SECRET_KEY, { expiresIn: 3*60 * 60 *24 });
  res.cookie('appointmentApp', token, { maxAge: 60*60*24*3000, httpOnly: true });
  callback();
}

module.exports.getLanguageCookieValue = getLanguageCookieValue;
module.exports.createSessionCookie = createSessionCookie;
