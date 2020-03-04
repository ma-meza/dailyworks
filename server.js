const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment');
const fileUpload = require('express-fileupload');
const passportSetup = require('./config/passport-setup');
const passport = require('passport');
const requestIp = require('request-ip');
const bcrypt = require('bcrypt');
require('dotenv').config();
var ObjectID = require('mongodb').ObjectID;
const nodemailer = require("nodemailer");

//include file for all functions
const functionsFile = require('./functions');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth-routes');

var sessionMiddlewares = require('./middlewares/sessionCheck');


const saltRoundsBcrypt = 10;

//EXPRESS SHITS
var app = express();
app.use(cookieParser());





// const express_enforces_ssl = require('express-enforces-ssl');
// const helmet = require('helmet');
// const sixtyDaysInSeconds = 5184000
// app.use(helmet.hsts({
//   maxAge: sixtyDaysInSeconds
// }));
// app.use(express_enforces_ssl());
// app.set('trust proxy', true);


app.use(express.static(__dirname + '/public')); // configure express to use public folder for all img srcs and other files
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.json()); // parse form data client in http header for post
app.use(bodyParser.urlencoded({
    parameterLimit: 10000,
    limit: '50mb',
    extended: true
}));
app.use(fileUpload()); // configure fileupload for file uploads req.files.NAMEOFINPUT

//setup routes
app.use('/', authRoutes);


//email client
var emailTransporterCustomerCare = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth:{
    user: 'customercare@dailyworks.ca',
    pass: 'Fortune2019',
  }
});

var emailTransporterAdmin = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth:{
    user: 'admin@dailyworks.ca',
    pass: 'Fortune2019',
  }
});



// mongoose connect to MONGODB

// mongoose.connect("mongodb+srv://markymark:Fortune2019@cluster0-sotud.gcp.mongodb.net/test?retryWrites=true&w=majority", {  useNewUrlParser: true, useUnifiedTopology: true}).catch(error => console.log("MONGO SERVER ERROR"+error));
mongoose.connect('mongodb://localhost:27017/appointmentApp', {useNewUrlParser: true, useUnifiedTopology: true}).catch(error => console.log("MONGO SERVER ERROR"+error));



//mongoose schemas
var Store = require('./models/storeSchema');
var Conversation = require('./models/conversationSchema');
var Event = require('./models/eventSchema');
var Client = require('./models/userSchema');
var GuestClient = require('./models/guestUserSchema');
var LocalGuestClient = require('./models/localGuestClientSchema');
var B2bPrelaunchClient = require('./models/b2bPrelaunchSchema');

function getLanguageCookieValue(req, res){
  var cookieLang = req.cookies.lang;
  if(!cookieLang){
    var localeString = req.headers['accept-language'];
    var splittedLangString = localeString.split(';');
    for(var i=0;i<splittedLangString.length;i++){
      var twiceSplittedString = splittedLangString[i].split(',');
      for(var j=0;j<twiceSplittedString.length;j++){
        if(twiceSplittedString[j] == 'en' || twiceSplittedString[j] == 'en-US'){
          res.cookie('lang', 'en', { maxAge: 60*60*24*3000, httpOnly: true });
          return 'en';
        }else if(twiceSplittedString[j] == 'fr' || twiceSplittedString[j] == 'fr-FR'){
          res.cookie('lang', 'fr', { maxAge: 60*60*24*3000, httpOnly: true });
          return 'fr';
        }else{
          res.cookie('lang', 'en', { maxAge: 60*60*24*3000, httpOnly: true });
          return 'en';
        }
      }
    }
    res.cookie('lang', 'en', { maxAge: 60*60*24*3000, httpOnly: true });
    return 'en';
  }else{
    return req.cookies.lang;
  }
}

app.get('/error', function(req,res){
res.send("oups error");
});


app.get('/index', function(req,res){
  res.render('indexTest.ejs');
});

function sendNotice(messageType, body){
var messageOptions = {
from:'"Notif server Dailyworks" <admin@dailyworks.ca>',
to:'meza.marc3103@gmail.com',
subject:"Server update"
};
if(messageType == 0){
messageOptions.text = body+" has registered for prelaunch.";
}else{
messageOptions.text = body+" visited prelaunch page";
}

emailTransporterAdmin.sendMail(messageOptions, function(err, info){
  console.log('trying send email');
  if(err){
    console.log(err);
  }

});
}


function getIpClient(req){
return req.headers["x-forwarded-for"] || "unknown ip";
}

app.get('/', function(req, res){
      res.render('landingPageStorePreLaunch', {languageCookie:getLanguageCookieValue(req, res)});
      sendNotice(1, getIpClient(req));
});

app.get('/signupTestStore', function(req,res){
res.render('signupTestStore');
})

app.post('/setlangCookie', function(req, res){
  var languageChosen = req.body.lang;
res.cookie('lang', languageChosen, { maxAge: 60*60*24*3000, httpOnly: true });
res.send('ok');
});


// //render page of store
// app.get('/storePage/:id*', function(req, res) {
//   //get id from url after store and decrypt
//   var decryptedId = req.params['id'];
//   //5d8ebabf6ecd1b4b3475196d
//   console.log(decryptedId);
//
// //find store from url in mongodb mongoose
//   Store.findOne({_id:mongoose.Types.ObjectId(decryptedId)}, {_id:0,password:0},function(error, resultObj){
//     if(error){
//       console.log('error');
//       res.redirect('/error');
//     }else{
//       // object of the store
//       console.log(resultObj);
//       res.render('storePageForClientsGuest', {
//           storeObj:resultObj, languageCookie:getLanguageCookieValue(req, res)
//       });
//     }
//   });
//
// });





// app.get('/faq', function(req, res){
//   res.render('storeFaq', {languageCookie:getLanguageCookieValue(req, res)});
// });

app.get('/welcomeBusiness', function(req, res){
  res.render('indexStoreLandingPage', {languageCookie:getLanguageCookieValue(req, res)});
});


//MAIN HOme PAGE loggedin FOR CLIENT AND STORE
app.get('/home', sessionMiddlewares.loggedInCheck, function(req, res){

if(res.locals.userType == "store"){

  Event.find({storeId:mongoose.Types.ObjectId(res.locals.userId)}, {_id:1, clientName:1, startDate:1, endDate:1, fullDay:1, services:1}, function(err, eventsObj){
    if(err){
      console.log(err);
      res.redirect('/error');
    }else{
      Store.findOne({_id:mongoose.Types.ObjectId(res.locals.userId)}, {_id:0, storeName:1, newNotifications:1, notifications:1, services:1, employees:1, storeSchedule:1, storeAbsences:1},function(error, resultObj){
        if(error){
          console.log('error');
          res.redirect('/error');
        }else{
          // object of the store
          console.log(resultObj.employees);
          res.render('storeHome',{eventsObj:JSON.stringify(eventsObj), storeNotifications:JSON.stringify(resultObj.notifications), employeeObj:JSON.stringify(resultObj.employees), serverStoreObj:JSON.stringify(resultObj),storeObj:resultObj, languageCookie:getLanguageCookieValue(req, res)});
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

  res.render('clientHome',{eventsObj:eventsObj, userId:res.locals.userId, clientObj:clientObj, languageCookie:getLanguageCookieValue(req, res)});
}
      });

    }

  });
//also search for nearby stores for the client
}
});



app.get('/settings', sessionMiddlewares.loggedInCheck, function(req, res){

if(res.locals.userType == "store"){
  Store.findOne({_id:mongoose.Types.ObjectId(res.locals.userId)}, {_id:0, storeName:1, newNotifications:1, notifications:1, services:1, employees:1, storeSchedule:1, storeAbsences:1, facebookLink:1, instagramLink:1, websiteLink:1,clientCanPickEmployee:1,location:1, phoneNumber:1, email:1}, function(err, resultObj){
    if(err){
      console.log(err);
      res.redirect('/error');
    }else{
      res.render('storeSettings',{storeObj:resultObj, languageCookie:getLanguageCookieValue(req, res)});
    }

  });
}else{

res.redirect('/home');

}
});


app.get('/profile', sessionMiddlewares.loggedInCheck, function(req, res){

  if(res.locals.userType == 'store'){
    res.redirect('/home');
  }else{
    Client.findOne({_id:mongoose.Types.ObjectId(res.locals.userId)},  {password:0}, function(err, clientInfoObject){
      if(err){
        console.log(err);
        res.redirect('/error');
      }else{
    res.render('clientProfile', {clientObj:clientInfoObject, languageCookie:getLanguageCookieValue(req, res)});

      }

    });

  }


});


// app.get('/newConvo', sessionMiddlewares.loggedInCheck, function(req,res){
//   var currentDate = new Date();
//   Conversation.create({ storeId: "5d6d52f3e7d9db1a4441e748", storeName:"Marco Barber", clientId:"5d77b74647b471418c6afa21" , clientName:"Marc-André Meza", messages:[{message:"YO MATE", messageType:0,senderIsStore:false}]}, function (err, storeObj) {
//                  if (err){
//                    console.log(err);
//                    res.send('err');
//                  }else{
//                    res.redirect('/messages');
//                  }
//                });
//
//
// });






app.get('/agenda', sessionMiddlewares.loggedInCheck,function(req, res){
if(res.locals.userType == "store"){
res.redirect('/home');
}else{
  Event.find({clientId:mongoose.Types.ObjectId(res.locals.userId), startDate:{"$gte":new Date()}}, {},{sort: {'startDate': 1}, limit: 20},function(err, resultObj){
    if(err){
      console.log(err);
      res.redirect('/error');
    }else{
      res.render('clientAgenda',{eventsObj:resultObj, languageCookie:getLanguageCookieValue(req, res)});
    }

  });
}
});











// app.get('/messages', sessionMiddlewares.loggedInCheck, function(req, res){
// if(res.locals.userType == "store"){
//
//               Store.updateOne({_id:mongoose.Types.ObjectId(res.locals.userId)}, {newMessageNotifications: false}, function(errorUpdate, responseObj){
//                 if(errorUpdate){
//                   console.log('error');
//                   console.log(errorUpdate);
//               res.send('err');
//               }else{
//
//                 Conversation.find({storeId:mongoose.Types.ObjectId(res.locals.userId)}, {},{sort: {'timestampLastMessage': 1}, limit: 20}, function(err, resultObj){
//                   if(err){
//                     console.log(err);
//                     res.redirect('/error');
//                   }else{
//                     res.render('storeMessenger',{conversation:resultObj, languageCookie:getLanguageCookieValue(req, res)});
//                   }
//
//                 });
//               }
//
//               });
//
// }else{
//   Conversation.find({clientId:mongoose.Types.ObjectId(res.locals.userId)},{}, {sort: {'timestampLastMessage': 1}, limit: 20}, function(err, resultObj){
//     if(err){
//       console.log(err);
//       res.redirect('/error');
//     }else{
//       res.render('clientMessenger',{conversation:resultObj, languageCookie:getLanguageCookieValue(req, res)});
//     }
//
//   });
// }
// });






// app.get('/analytics', sessionMiddlewares.loggedInCheck, function(req, res){
// if(res.locals.userType == "store"){
//   Store.findOne({_id:mongoose.Types.ObjectId(res.locals.userId)}, {password:0}, function(err, resultObj){
//     if(err){
//       console.log(err);
//       res.redirect('/error');
//     }else{
//       console.log(resultObj);
//       res.render('storeAnalytics', {storeObj:resultObj, languageCookie:getLanguageCookieValue(req, res)});
//     }
//
//   });
// }else{
//   res.redirect('/home');
// }
// });


app.get('/warZone4', function(req, res) {
    res.render('myCalendarView', {languageCookie:getLanguageCookieValue(req, res)});

});




// app.post('/addEvent', function(req, res) {
//
//     if (req.body) {
//
//         var title = req.body.title;
//         var startDate = req.body.startDate;
//         var endDate = req.body.endDate;
//         var startTime = req.body.startTime;
//         var endTime = req.body.endTime;
//
//
//
//
//         var startString = functionsFile.formatFullDayDate(startDate, startTime);
//         var endString = functionsFile.formatFullDayDate(endDate, endTime);
//         console.log(startString);
//         console.log(endString);
//
//         res.send({
//             title: title,
//             startString: startString,
//             endString: endString
//         });
//     } else {
//         console.log('error');
//
//         res.status(500).send('error');
//     }
//
// });




// app.post('/modifyEvent', function(req, res) {
//
//     if (req.body) {
//
//         var title = req.body.title;
//         var startDate = req.body.startDate;
//         var endDate = req.body.endDate;
//
//         console.log(endDate);
//         console.log(startDate);
//
//         res.send("ok");
//
//     } else {
//         console.log('error');
//
//         res.status(500).send('error');
//     }
//
// });








app.get('/getMoreEventsLater', sessionMiddlewares.loggedInCheck, function(req, res){
var nbEventsAlreadyFetched = 0;
var nbEventsQueryLimit = 10;
if(req.query.lastEventId){
  nbEventsAlreadyFetched = req.query.lastEventId;
}
if(req.query.limitNumber){
  nbEventsQueryLimit = req.query.limitNumber;
}
if(res.locals.userType == "store"){
  Event.find({storeId:mongoose.Types.ObjectId(res.locals.userId), startDate:{"$gte":new Date()}}, {_id:1, clientName:1, startDate:1, endDate:1, fullDay:1, services:1},{sort: {'startDate': 1}, limit: nbEventsQueryLimit, skip:nbEventsAlreadyFetched},function(err, resultObj){
    if(err){
      console.log(err);
    }else{
      console.log(resultObj);
    }

  });
}else{
  Event.find({clientId:mongoose.Types.ObjectId(res.locals.userId), startDate:{"$gte":new Date()}}, {},{sort: {'startDate': 1}, limit: nbEventsQueryLimit, skip:nbEventsAlreadyFetched},function(err, resultObj){
    if(err){
      console.log(err);
    }else{
      console.log(resultObj);
    }

  });

}
});



app.get('/getAllStoreEvents', sessionMiddlewares.loggedInCheck, function(req, res){
if(res.locals.userType == "store"){

  var dateInLocal = moment().toDate();

  Event.find({storeId:mongoose.Types.ObjectId(res.locals.userId), startDate:{"$gte":dateInLocal}}, {_id:1, clientName:1, startDate:1, endDate:1, fullDay:1, services:1},{sort: {'startDate': 1}},function(err, resultObj){
    if(err){
      res.send('error');
    }else{
      res.send(resultObj);
    }

  });
}else{
res.send('error');

}
});

app.get('/getAllStoreFutureEvents', sessionMiddlewares.loggedInCheck, function(req, res){
if(res.locals.userType == "store"){

  var dateInLocal = moment().toDate();

  Event.find({storeId:mongoose.Types.ObjectId(res.locals.userId), startDate:{"$gte":dateInLocal}}, {_id:1, clientName:1, startDate:1, endDate:1, fullDay:1, services:1},{sort: {'startDate': 1}},function(err, resultObj){
    if(err){
      res.send('error');
    }else{
      res.send(resultObj);
    }

  });
}else{
res.send('error');

}
});




// app.get('/getMoreEventsBefore', sessionMiddlewares.loggedInCheck, function(req, res){
// var nbEventsAlreadyFetched = 0;
// var nbEventsQueryLimit = 10;
// if(req.query.lastEventId){
//   nbEventsAlreadyFetched = req.query.lastEventId;
// }
// if(req.query.limitNumber){
//   nbEventsQueryLimit = req.query.limitNumber;
// }
// if(res.locals.userType == "store"){
//   Event.find({storeId:mongoose.Types.ObjectId(res.locals.userId), startDate:{"$lte":new Date()}}, {},{sort: {'startDate': -1}, limit: nbEventsQueryLimit, skip:nbEventsAlreadyFetched},function(err, resultObj){
//     if(err){
//       console.log(err);
//     }else{
//       console.log(resultObj);
//     }
//
//   });
// }else{
//   Event.find({clientId:mongoose.Types.ObjectId(res.locals.userId), startDate:{"$lte":new Date()}}, {},{sort: {'startDate': -1}, limit: nbEventsQueryLimit, skip:nbEventsAlreadyFetched},function(err, resultObj){
//     if(err){
//       console.log(err);
//     }else{
//       console.log(resultObj);
//     }
//
//   });
// }
// });









// app.get('/getMoreConversations', sessionMiddlewares.loggedInCheck, function(req, res){
//   var nbEventsAlreadyFetched = 0;
//   var nbEventsQueryLimit = 10;
//   if(req.query.lastEventId){
//     nbEventsAlreadyFetched = req.query.lastEventId;
//   }
//   if(req.query.limitNumber){
//     nbEventsQueryLimit = req.query.limitNumber;
//   }
// if(res.locals.userType == "store"){
//   Conversation.find({storeId:mongoose.Types.ObjectId(res.locals.userId)}, {},{sort: {'timestampLastMessage': 1}, limit: nbEventsQueryLimit, skip:nbEventsAlreadyFetched}, function(err, resultObj){
//     if(err){
//       console.log(err);
//     }else{
//       console.log(resultObj);
//     }
//
//   });
// }else{
//   Conversation.find({clientId:mongoose.Types.ObjectId(res.locals.userId)}, {},{sort: {'timestampLastMessage': 1}, limit: nbEventsQueryLimit, skip:nbEventsAlreadyFetched}, function(err, resultObj){
//     if(err){
//       console.log(err);
//     }else{
//       console.log(resultObj);
//     }
//
//   });
// }
// });




//not optimized
app.post('/updateClientInfo', sessionMiddlewares.loggedInCheck, function(req, res){
if(!req.body.newPassword && !req.body.currentPassword && !req.body.email && !req.body.phone && !req.body.location && !req.body.lat && !req.body.long){
  res.send('err');
}else{

  if(req.body.newPassword && req.body.newPassword != null && req.body.currentPassword && req.body.currentPassword != null){


var saidCurrentPassword = req.body.currentPassword;
var wantedNewPassword = req.body.newPassword;

                        Client.findOne({_id:mongoose.Types.ObjectId(res.locals.userId)}, {password:1},function(error, responsePassword){
                          console.log("Said current password : " + saidCurrentPassword);
                          console.log("Real current password : " + responsePassword.password);
                          console.log("New wanted password : " + wantedNewPassword);
                          if(error){
                            console.log("the ERROR : "+error);
                            res.send('err');
                          }else{


                            bcrypt.compare(responsePassword.password, wantedNewPassword, function(errBcryptSamePass, resBcryptSameOldPass) {
                                // res == true == same pass
                                if(errBcryptSamePass){
                                  console.log(errBcryptSamePass);
                                  res.send('err');
                                }else{
                                  //pass match
                                  if(resBcryptSameOldPass == true){
                                    //already same password
                                    console.log('same pass no need to change');
                                    res.send('samePass');

                                  }else{



                                    bcrypt.compare(saidCurrentPassword, responsePassword.password, function(errBcryptCompareOld, resBcryptCompareOld) {
                                        // res == true == same pass
                                        if(errBcryptCompareOld){
                                          console.log(errBcryptCompareOld);
                                          res.send('err');
                                        }else{
                                          console.log(resBcryptCompareOld);
                                          //od pass no match
                                          if(resBcryptCompareOld == false){
                                            console.log('current pass is not good');
                                            res.send('noGoodCurrentPass');

                                          }else{
                                            //all good change pass

                                            bcrypt.hash(wantedNewPassword, saltRoundsBcrypt, function(errorHashing, newHashedPassword) {
                                              if(errorHashing){
                                                console.log(errorHashing);
                                                res.send('err');
                                              }else{
                                                Client.updateOne({_id:mongoose.Types.ObjectId(res.locals.userId)}, {password:newHashedPassword}, function(errorUpdate, responseObj){
                                                  if(errorUpdate){
                                                    console.log(errorUpdate);
                                                res.send('err');
                                                }else{
                                                  res.send('ok');
                                                }

                                                });
                                              }
                                          });
                                          }
                                        }
                                    });
                                  }

                                }
                            });
                          }
                        });




  }else if(req.body.email && req.body.email != null){
    if(functionsFile.validateEmail(req.body.email) == true){
      Client.updateOne({_id:mongoose.Types.ObjectId(res.locals.userId)}, {email:req.body.email}, function(errorUpdate, responseObj){
        if(errorUpdate){
          console.log(errorUpdate);
      res.send('err');
      }else{
        res.send('ok');
      }

      });
    }else{
      res.send('notValid');
    }
    }else if(req.body.phone && req.body.phone != null){
      if(functionsFile.validatePhoneNumber(req.body.phone) == true){
        Client.updateOne({_id:mongoose.Types.ObjectId(res.locals.userId)}, {phoneNumber:req.body.phone}, function(errorUpdate, responseObj){
          if(errorUpdate){
            console.log(errorUpdate);
        res.send('err');
        }else{
          res.send('ok');
        }

        });
      }else{
        res.send('notValid');
      }

    }else if(req.body.location && req.body.location != null){
      console.log(req.body.lat+"%"+req.body.long);
      var newLocation = req.body.location+"%"+req.body.lat+","+req.body.long;
          Client.updateOne({_id:mongoose.Types.ObjectId(res.locals.userId)}, {location:newLocation}, function(errorUpdate, responseObj){
            if(errorUpdate){
              console.log(errorUpdate);
          res.send('err');
          }else{
            res.send('ok');
          }

          });
    }

  }

});





// app.post('/postChatMessage', sessionMiddlewares.loggedInCheck, function(req, res){
// if(!req.body.messageContent && req.body.messageContent != null && req.body.senderIsStore != null && !req.body.conversationId && req.body.conversationId != null && !req.body.messageType && req.body.messageType != null){
// res.send('err');
// }else{
// if(req.body.conversationId == -1){
// //new convo that doesnt exist
//
// }else{
//   //conversation already exists
//             var messageObj = {message:req.body.messageContent, messageType:req.body.messageType, senderIsStore:req.body.senderIsStore}
//             Conversation.findOne({_id:mongoose.Types.ObjectId(req.body.conversationId)}).then(function(theConversation){
//           theConversation.messages.push(messageObj);
//           theConversation.save();
//         }).then(function(){
//
//           Conversation.updateOne({_id:mongoose.Types.ObjectId(req.body.conversationId)}, {timestampLastMessage:new Date()}, function(errorUpdate, responseObj){
//             if(errorUpdate){
//               console.log(errorUpdate);
//           res.send('err');
//           }else{
//             res.send('ok');
//           }
//
//           });
//
//         });
//
//
//
// }
// }
// });




app.post('/removeNotificationAlertFromStore', sessionMiddlewares.loggedInCheck, function(req, res){

  Store.updateOne({_id:mongoose.Types.ObjectId(res.locals.userId)}, {newNotifications: false}, function(errorUpdate, responseObj){
    if(errorUpdate){
      console.log('error');
      console.log(errorUpdate);
  res.send('err');
  }else{

    console.log(responseObj);
    res.send('ok');
  }

  });
});



app.post('/addStoreAbsence', sessionMiddlewares.loggedInCheck, function(req,res){
  //[startDate, startTime, endDate, endTime, reason]
    var absenceObjId = new ObjectID();
    var absenceObj = req.body.absenceObj;
    absenceObj['_id'] = absenceObjId;
    if(absenceObj){
      Store.updateOne({_id:mongoose.Types.ObjectId(res.locals.userId)}, {$push:{storeAbsences:absenceObj}}, function(errorUpdate, responseObjUpdated){
        if(errorUpdate){
          console.log(errorUpdate);
          res.send({status:'error'});
        }else{
          console.log(responseObjUpdated);
          res.send({status:'ok', absenceId:absenceObjId});
        }
      });
    }
});

app.post('/deleteStoreAbsence', sessionMiddlewares.loggedInCheck, function(req, res){
  var absenceId = req.body.absenceId;
  Store.updateOne({ _id:mongoose.Types.ObjectId(res.locals.userId)}, {$pull: { storeAbsences: { _id:mongoose.Types.ObjectId(absenceId)} } }, function(errorUpdate, responseObjUpdated){
    if(errorUpdate){
      console.log(errorUpdate);
      res.send('error');
    }else{
      console.log(responseObjUpdated);
      res.send("ok");
    }
  });
});


app.post('/updateStoreGeneralSettings', sessionMiddlewares.loggedInCheck, function(req, res){
//bName, bLocation, bPhone,fbLink, instaLink, websiteLink, bEmail, oldPass, newPass, ownerName
  if(req.body.oldPass != "" && req.body.newPass != ""){
    Store.findOne({_id:mongoose.Types.ObjectId(res.locals.userId)}, {_id:0, storeName:1, ownerName:1, facebookLink:1, instagramLink:1, websiteLink:1,clientCanPickEmployee:1,location:1, phoneNumber:1, email:1}, function(error, responseObj){
      if(responseObj){
        bcrypt.compare(req.body.oldPass, responseObj.password, function(err, respBcrypt) {
            // res == true
            if(err){
              console.log(err);
              res.send('error');
            }else{
              //pass match
              if(respBcrypt == true){
                var updateString = new Object();
                bcrypt.hash(req.body.newPass, saltRoundsBcrypt, function(errorHash, hash) {
                  if(errorHash){
                    console.log(errorHash);
                    res.send('error');
                  }else{

                    updateString["password"] = hash;

                    if(req.body.bName !=""){
                      updateString["storeName"] = req.body.bName;
                    }
                    if(req.body.bLocation != ""){
                      updateString["location"] = req.body.bLocation;
                    }
                    if(req.body.bPhone != ""){
                      updateString["phoneNumber"] = req.body.bPhone;
                    }
                    if(req.body.fbLink != ""){
                      updateString["facebookLink"] = req.body.fbLink;
                    }
                    if(req.body.instaLink != ""){
                      updateString["instagramLink"] = req.body.instaLink;
                    }
                    if(req.body.websiteLink != ""){
                      updateString["websiteLink"] = req.body.websiteLink;
                    }
                    if(req.body.bEmail != ""){
                      updateString["email"] = req.body.bEmail;
                    }
                    if(req.body.ownerName != ""){
                      updateString["ownerName"] = req.body.ownerName;
                    }

                    console.log(updateString);

                    Store.updateOne({_id:mongoose.Types.ObjectId(res.locals.userId)}, updateString, function(errorUpdate, responseObjUpdated){
                      if(errorUpdate){
                        console.log(errorUpdate);
                        res.send('error');
                      }else{
                        console.log('yesss');
                        console.log(responseObjUpdated);
                        res.send('ok');
                      }
                    });



                  }
              });



              }else{
                res.send("oldPassNoMatch");
              }

            }
        });

      }else{
        res.send("error");
      }
    });

  }else{
      var updateString = new Object();
      if(req.body.bName !=""){
        updateString["storeName"] = req.body.bName;
      }
      if(req.body.bLocation != ""){
        updateString["location"] = req.body.bLocation;
      }
      if(req.body.bPhone != ""){
        updateString["phoneNumber"] = req.body.bPhone;
      }
      if(req.body.fbLink != ""){
        updateString["facebookLink"] = req.body.fbLink;
      }
      if(req.body.instaLink != ""){
        updateString["instagramLink"] = req.body.instaLink;
      }
      if(req.body.websiteLink != ""){
        updateString["websiteLink"] = req.body.websiteLink;
      }
      if(req.body.bEmail != ""){
        updateString["email"] = req.body.bEmail;
      }
      if(req.body.ownerName != ""){
        updateString["ownerName"] = req.body.ownerName;
      }

      Store.updateOne({_id:mongoose.Types.ObjectId(res.locals.userId)}, updateString, function(errorUpdate, responseObjUpdated){
        if(errorUpdate){
          console.log(errorUpdate);
          res.send('error');
        }else{
          console.log(responseObjUpdated);
          res.send('ok');
        }
      });

  }


});





app.post('/updateStoreScheduleSettings', sessionMiddlewares.loggedInCheck, function(req, res){

  if(req.body.dailySchedule){
    var dailyScheduleArrayLength = req.body.dailySchedule.length;
    var updateScheduleObj = new Object();

      for(var i=0;i<dailyScheduleArrayLength;i++){
        var startTime = req.body.dailySchedule[i][0];
        var endTime = req.body.dailySchedule[i][1];
        var weekDay = req.body.dailySchedule[i][2];

        updateScheduleObj['storeSchedule.'+weekDay+'.startTime'] = startTime;
        updateScheduleObj['storeSchedule.'+weekDay+'.endTime'] = endTime;
      }
      console.log(updateScheduleObj);

      Store.updateOne({_id:mongoose.Types.ObjectId(res.locals.userId)}, updateScheduleObj, function(errorUpdate, responseObjUpdated){
        if(errorUpdate){
          console.log(errorUpdate);
          res.send('error');
        }else{
          if(req.body.absences){
            var absencesArrayLength = req.body.absences.length;
            if(absencesArrayLength>0){
              for(var i=0;i<absencesArrayLength;i++){
                res.send('ok');
              }
            }
          }

        }
      });

  }else{
    if(req.body.absences){
      var absencesArrayLength = req.body.absences.length;if(absencesArrayLength>0){
        var absencesObj = new Object();

        Store.findOne({_id:mongoose.Types.ObjectId(res.locals.userId)}, function(err, storeObj){
          if(err){
            console.log(err);
            res.send('error');
          }else{

            for(var w=0;w<absencesArrayLength;w++){
              var targetId = req.body.absences[w][3];
              for(var x=0;x<storeObj.storeAbsences.length;x++){
                console.log(storeObj.storeAbsences[x]._id+" vs "+targetId);
                if(storeObj.storeAbsences[x]._id == targetId){
                  console.log('yeeee');
                  if(req.body.absences[w][2]!=""){
                    absencesObj['storeAbsences.'+x+'.reason'] = req.body.absences[w][2];
                  }
                  absencesObj['storeAbsences.'+x+'.startTime'] = req.body.absences[w][0][1];
                  absencesObj['storeAbsences.'+x+'.startDate'] = req.body.absences[w][0][0];
                  absencesObj['storeAbsences.'+x+'.endTime'] = req.body.absences[w][1][1];
                  absencesObj['storeAbsences.'+x+'.endDate'] = req.body.absences[w][1][0];
                  //startDateTimeArray, endDateTimeArray, reasonInput.value, absenceId
                  break;
                }
              }
            }
            console.log(absencesObj);
            Store.updateOne({_id:mongoose.Types.ObjectId(res.locals.userId)}, absencesObj, function(errorUpdate, responseObjUpdated){
              if(errorUpdate){
                console.log(errorUpdate);
                res.send('error');
              }else{
                res.send('ok');
              }
            });
          }

        });
      }
    }
  }
});



app.get('/changeLanguage', function(req,res){
  var languageRequested = req.query.locale;
  res.cookie('lang', languageRequested, { maxAge: 90000000000, httpOnly: true });
  res.redirect('/home');
});



// app.get('/searchAllRegisteredUsers', sessionMiddlewares.loggedInCheck, function(req, res){
//   console.log(req.query);
// Client.find({$or:[{ "phoneNumber": { $regex: '.*' + req.query.searchQuery + '.*' } },{ "clientName": { $regex: '.*' + req.query.searchQuery + '.*' } }, { "email": { $regex: '.*' + req.query.searchQuery + '.*' } }]}, {_id:0},function(error, clientObj){
//             if(error){
//             console.log(error);
//             res.send('error');
//             }else{
//             res.send(clientObj);
//             }
//         });
// });


app.post('/registerPrelaunchB2bEmails', function(req, res){
console.log(req.body.email);
var mailOptions = {
from:'"Dailyworks Pre-launch" <customercare@dailyworks.ca>',
to:req.body.email,
subject:"Welcome to Dailyworks!",
html:"<link href='https://fonts.googleapis.com/css?family=Roboto:400,900&display=swap' rel='stylesheet'><meta name='viewport' content='width=device-width, initial-scale=1.0'><div style='position:fixed;left:0;top:0;width:100%;height:500px;background-color:#f9f9f9;'><div id='whiteDiv' style='padding-bottom:30px;position:relative;margin-top:20px;left:20px;width:calc(100% - 40px); background-color:#fff;height:fit-content;min-height:100px;border-radius:10px;-webkit-box-shadow: 0px 7px 24px -6px rgba(0,0,0,0.75);  -moz-box-shadow: 0px 7px 24px -6px rgba(0,0,0,0.75);box-shadow: 0px 7px 24px -6px rgba(0,0,0,0.75);padding-top:20px;'><img src='https://dailyworks.ca/assets/logos/dwFullLogoBlack.jpg' style='border-radius:10px;position:relative;margin-bottom:40px;margin-left:20px;margin-top:0px;height:50px;'><p class='text'style='font-size:30px;color:#000;position:relative;margin:0;margin-left:20px;margin-right:20px;font-weight:900; margin-bottom:30px;'>Thank you for joining our vip pre-launch list!</p><p class='text' style='font-size:20px;color:#000;position:relative;margin:0;margin-left:20px;margin-right:20px;font-weight:400;'>We'll contact you again when we launch in March. Hope you're ready to make your business thrive.</p></div></div><style>*{font-family: 'Roboto', sans-serif;box-sizing:border-box;}</style>"
};


  B2bPrelaunchClient.findOne({email:req.body.email}).then(function(currentUser){
       if(currentUser){
         if(currentUser.emailSent == true){
           res.send('alreadyExist');
         }else{
           //email data


           emailTransporterCustomerCare.sendMail(mailOptions, function(err, info){
             console.log('trying send email');
             if(err){
               console.log(err);
               res.send('error');
             }else{
               console.log('email sent'+info.response);
               sendNotice(0, req.body.email);
               res.send('ok');
             }

           });
         }
       }else{

           B2bPrelaunchClient.create({ email: req.body.email}, function (err, clientObj) {
             if (err){
               console.log(err);
               res.send('error');
             }else{
               emailTransporterCustomerCare.sendMail(mailOptions, function(err, info){
                 console.log('trying send email');
                 if(err){
                   console.log(err);
                   B2bPrelaunchClient.updateOne({email:req.body.email}, {emailSent:false}, function(errorUpdate, responseObj){
                     res.send('error');
                   });
                 }else{
                   sendNotice(0, req.body.email);
                   res.send('ok');
                 }
               });

             }
         });
       }
  });
});


app.use(function(req, res, next) {
  return res.status(404).render('404page.ejs', {languageCookie:getLanguageCookieValue(req, res)});
});



app.listen(process.env.PORT || 8080, function() {
    console.log('Listening to port:  ' + 8080);
});
