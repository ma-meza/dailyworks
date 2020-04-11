require('dotenv').config();
const app = require('express').Router();
const validatorFunctions = require('../validatorFunctions');
const Client = require('../models/userSchema');
const Event = require('../models/eventSchema');
const ResetPasswordQueue = require('../models/ResetPasswordQueue');
const UnconfirmedGuestClient = require('../models/unconfirmedGuestClientSchema');
const uid = require('uid-safe');
const nodemailer = require("nodemailer");
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sessionMiddlewares = require('../middlewares/sessionCheck');
const sanitize = require("mongo-sanitize");
const shortUrl = require('node-url-shortener');
const twilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

var emailTransporterReminder = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  pool:true,
  secure: true,
  auth:{
    user: 'customercare@dailyworks.ca',
    pass: 'Fortune2019',
  }
});

var emailTransporterCustomerCare = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth:{
    user: 'customercare@dailyworks.ca',
    pass: 'Fortune2019',
  }
});

//post to set cookie in browser of client coords
app.post("/setCookieLocationClient", function(req,res){
  if(req.body.coords){
    var coords = req.body.coords;
    if(validatorFunctions.latitudeValidator(coords.latitude) && validatorFunctions.longitudeValidator(coords.longitude)){
      console.log(coords);
      res.cookie('coords', coords.latitude+";"+coords.longitude, { expires:false, httpOnly: true });
      res.send("ok");
    }else{
      res.send('error');
    }
  }else{
    res.send('error');
  }
});

//post request when client has input his email to send a password reset request (send email, create token etc.)
app.post('/clientResetPassword', function(req, res){
  if(req.body.email){
    Client.findOne({email:req.body.email}, {_id:1, email:1}, function(errorFindUser, resultUserObj){
      if(errorFindUser){
        res.send('error');
      }else{
        if(resultUserObj){
          uid(18, function (errToken, stringToken) {
            console.log(stringToken);
            if (errToken){
              res.send('error');
            }else{
              ResetPasswordQueue.create({email:resultUserObj.email, userId:resultUserObj._id, token:stringToken}, function(errorCreateReset, resetObj){
                if(errorCreateReset){
                  res.send('error');
                }else{
                  var mailOptions = {
                  from:'"Dailyworks" <customercare@dailyworks.ca>',
                  to:resultUserObj.email,
                  subject:"Password reset",
                  html:"<link href='https://fonts.googleapis.com/css?family=Roboto:400,900&display=swap' rel='stylesheet'><meta name='viewport' content='width=device-width, initial-scale=1.0'><div style='position:fixed;left:0;top:0;width:100%;height:500px;background-color:#f9f9f9;'><div id='whiteDiv' style='padding-bottom:30px;position:relative;margin-top:20px;left:20px;width:calc(100% - 40px); background-color:#fff;height:fit-content;min-height:100px;border-radius:10px;-webkit-box-shadow: 0px 7px 24px -6px rgba(0,0,0,0.75);  -moz-box-shadow: 0px 7px 24px -6px rgba(0,0,0,0.75);box-shadow: 0px 7px 24px -6px rgba(0,0,0,0.75);padding-top:20px;'><img src='https://dailyworks.ca/assets/logos/dwFullLogoBlack.svg' style='border-radius:10px;position:relative;margin-bottom:40px;margin-left:20px;margin-top:0px;height:50px;'><p class='text'style='font-size:30px;color:#000;position:relative;margin:0;margin-left:20px;margin-right:20px;font-weight:900; margin-bottom:30px;'>Dailyworks password reset</p><p class='text' style='font-size:20px;color:#000;position:relative;margin:0;margin-left:20px;margin-right:20px;font-weight:400;'>Follow this link to reset your account password:</p><br><a href='dailyworks.ca/newPassword?t="+stringToken+"'>Click here!<a/></div></div><style>*{font-family: 'Roboto', sans-serif;box-sizing:border-box;}</style>"
                  };
                  emailTransporterReminder.sendMail(mailOptions, function(err, info){
                    if(err){
                      console.log(err);
                    }
                  });
                  res.send('ok');
                }
              });
            }
          });
        }else{
          //user doesnt exist
          res.send("noExist");
        }
      }
    });
  }
});

//reset the password of client in db
app.post('/postClientResetNewPassword', function(req, res){
if(req.body.password && req.body.email && req.body.token){
  var maxDateToken = new Date();
  maxDateToken = maxDateToken.setHours(maxDateToken.getHours() - 6);
  ResetPasswordQueue.findOne({token:req.body.token, dateCreated:{$gte:maxDateToken}, email:req.body.email}, {_id:1}, function(errorFind, findObj){
    if(errorFind){
      res.send('error');
    }else{
      if(findObj){
        bcrypt.hash(req.body.password, saltRoundsBcrypt, function(errHash, hash) {
          if(errHash){
            console.log(err);
            res.send('error');
          }else{
            ResetPasswordQueue.deleteOne({token:req.body.token, email:req.body.email}, function(errorDelete){
              if(errorDelete){
                res.send('error');
              }else{
                Client.updateOne({email:req.body.email, _id:findObj._id}, {passwoord:hash},function(errUpdatePass, resultNewUpdate){
                  if(errUpdatePass){
                    res.send('error');
                  }else{
                    res.send('ok');
                  }
                });
              }
            });
          }
      });
      }else{
        res.send('error');
      }
    }
  });
}
});

//TO DO !!!!!!! update client info
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
    if(validatorFunctions.validateEmail(req.body.email) == true){
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
      if(validatorFunctions.validatePhoneNumber(req.body.phone) == true){
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




//client posts new appointment (can be logged in or not)
app.post('/clientCreateAppointment', function(req, res){
  if(req.body.appointmentInfos){
    if(req.cookies.appointmentApp){
      var appointmentInfos = req.body.appointmentInfos;
      jwt.verify(req.cookies.appointmentApp, process.env.JWT_SECRET_KEY, function(errCookie,decryptedToken){
        if(errCookie){
          res.send('error');
        }else{
          if(decryptedToken){
            Client.findOne({_id:mongoose.Types.ObjectId(decryptedToken.id)}, {_id:1, clientName:1, email:1, phoneNumber:1}, function(errorFindUser, userResultObj){
              if(errorFindUser){
                res.send('error');
              }else{
                if(userResultObj){
                  //create appointment
                  var employeeId;
                  var employeeName;
                  if(appointmentInfos.employee == null || appointmentInfos.employee._id == -1){
                    employeeId = null;
                    employeeName = null;
                  }else{
                    employeeId = appointmentInfos.employee._id;
                    employeeName = appointmentInfos.employee.employeeName;
                  }
                  var servicesArray = [];
                  for(var i=0;i<appointmentInfos.services.length;i++){
                    var serviceObj = {serviceId:mongoose.Types.ObjectId(appointmentInfos.services[i].id), serviceName:appointmentInfos.services[i].serviceName, price:appointmentInfos.services[i].price, duration:appointmentInfos.services[i].duration,};
                    servicesArray.push(serviceObj);
                  }
                  Event.create({storeId:mongoose.Types.ObjectId(sanitize(appointmentInfos.storeId)), clientId:userResultObj._id, clientName:userResultObj.clientName, reminderEmail:userResultObj.email, reminderPhone:userResultObj.phoneNumber, startDate:appointmentInfos.fullStartDate, endDate: appointmentInfos.fullEndDate, services:servicesArray, storeName:appointmentInfos.storeName, employeeId:employeeId, employeeName:employeeName}, function(errorEvent, eventObj){
                    if(errorEvent){
                      console.log(errorEvent);
                      res.send('error');
                    }else{
                      res.send({appointmentId: eventObj._id});
                    }
                  });
                }else{
                  res.send("error");
                }
              }
            });
          }
        }
      });
    }else{
      var appointmentInfos = req.body.appointmentInfos;
      console.log(appointmentInfos.fullStartDate +" "+appointmentInfos.fullEndDate);
      if(appointmentInfos.tryLogin == "true"){
        //login user
        var tryEmail = sanitize(appointmentInfos.clientInfo.email);
        var tryPassword = sanitize(appointmentInfos.clientInfo.password);
        Client.findOne({email:tryEmail, provider:null}, {password:1, clientName:1,_id:1, email:1, phoneNumber:1}, function(errorFindUser, currentUser){
          if(errorFindUser){
            res.send('error');
          }else{
            if(currentUser){
              //user exists
              bcrypt.compare(tryPassword, currentUser.password, function(err, respBcrypt) {
                  // res == true
                  if(err){
                    console.log(err);
                    res.send('error');
                  }else{
                    //password match
                    if(respBcrypt == true){
                      var token = jwt.sign({id:currentUser._id, type:"client"}, process.env.JWT_SECRET_KEY, { expiresIn: 3*60 * 60 *24 });
                      res.cookie('appointmentApp', token, { maxAge: 60*60*24*3000, httpOnly: true });
                      //create appointment
                      var employeeId;
                      var employeeName;
                      if(appointmentInfos.employee == null || appointmentInfos.employee._id == -1){
                        employeeId = null;
                        employeeName = null;
                      }else{
                        employeeId = appointmentInfos.employee._id;
                        employeeName = appointmentInfos.employee.employeeName;
                      }
                      var servicesArray = [];
                      for(var i=0;i<appointmentInfos.services.length;i++){
                        var serviceObj = {serviceId:mongoose.Types.ObjectId(appointmentInfos.services[i].id), serviceName:appointmentInfos.services[i].serviceName, price:appointmentInfos.services[i].price, duration:appointmentInfos.services[i].duration,};
                        servicesArray.push(serviceObj);
                      }
                      Event.create({storeId:mongoose.Types.ObjectId(sanitize(appointmentInfos.storeId)), startDate: appointmentInfos.fullStartDate, reminderEmail:currentUser.email, reminderPhone:currentUser.phoneNumber, endDate: appointmentInfos.fullEndDate, services:servicesArray, storeName:appointmentInfos.storeName, clientId:mongoose.Types.ObjectId(currentUser._id), clientName:currentUser.clientName, employeeId:employeeId, employeeName:employeeName}, function(errorEvent, eventObj){
                        if(errorEvent){
                          console.log(errorEvent);
                          res.send('error');
                        }else{
                          res.send({appointmentId: eventObj._id});
                        }
                      });
                    }else{
                      res.send("passwordNoMatch");
                    }
                  }
              });
            }else{
              //user doesnt exist
               res.send("userNoExist");
            }
          }
        });
      }else{
        //as guest checkout guest user no login
        var createQueryBuilder = {clientName:appointmentInfos.clientInfo.name};
        if(appointmentInfos.clientInfo.email){
          createQueryBuilder.email = sanitize(appointmentInfos.clientInfo.email);
        }
        if(appointmentInfos.clientInfo.phone){
          createQueryBuilder.phoneNumber = sanitize(appointmentInfos.clientInfo.phone);
        }
        var employeeId;
        var employeeName;
        if(appointmentInfos.employee == null || appointmentInfos.employee._id == -1){
          employeeId = null;
          employeeName = null;
        }else{
          employeeId = appointmentInfos.employee._id;
          employeeName = appointmentInfos.employee.employeeName;
        }
        var servicesArray = [];
        for(var i=0;i<appointmentInfos.services.length;i++){
          var serviceObj = {serviceId:mongoose.Types.ObjectId(appointmentInfos.services[i].id), serviceName:appointmentInfos.services[i].serviceName, price:appointmentInfos.services[i].price, duration:appointmentInfos.services[i].duration,};
          servicesArray.push(serviceObj);
        }
        uid(18, function (err, stringToken) {
          if (err){
            res.send('error');
          }else{

            createQueryBuilder.confirmationToken = stringToken;
            UnconfirmedGuestClient.create(createQueryBuilder, function (errorCreateUser, newUnconfirmedClientObj) {
              if (errorCreateUser){
                console.log(errorCreateUser);
                res.send('error');
              }else{
                //createAppointment
                Event.create({storeId:mongoose.Types.ObjectId(sanitize(appointmentInfos.storeId)), confirmed:true, startDate: appointmentInfos.fullStartDate, endDate: appointmentInfos.fullEndDate, services:servicesArray, storeName:appointmentInfos.storeName, clientId:mongoose.Types.ObjectId(newUnconfirmedClientObj._id), clientName:newUnconfirmedClientObj.clientName, employeeId:employeeId, employeeName:employeeName}, function(errorEvent, eventObj){
                  if(errorEvent){
                    console.log(errorEvent);
                    res.send('error');
                  }else{
                    //send confirmations
                    if(appointmentInfos.clientInfo.email){
                      //email only given
                      var emailContent = "<link href='https://fonts.googleapis.com/css?family=Roboto:400,900&display=swap' rel='stylesheet'><meta name='viewport' content='width=device-width, initial-scale=1.0'><p class='text'style='font-size:30px;color:#000;position:relative;margin:0;margin-left:20px;margin-right:20px;font-weight:900; margin-bottom:30px;'>Here's your appointment confirmation!</p>"
                      +"<p style='font-size:20px;color:#000;position:relative;margin:0;margin-left:10px;margin-right:10px;font-weight:400;'>Please click the following link within the next 12 hours to confirm your appointment, otherwise your appointment will be cancelled.<br></p>"
                      +"<a href='dailyworks.ca/appointmentConfirmation?conf="+stringToken+"' style='font-size:20px;color:blue;position:relative;margin:0;margin-left:10px;margin-right:10px;font-weight:400;'>Click here to confirm your appointment</a>"
                      +"<p style='font-size:20px;color:#000;position:relative;margin:0;margin-left:10px;margin-right:10px;font-weight:400;'><br><br><br>"
                      +"Business name: "+eventObj.storeName
                      +"<br><br>Services: ";
                      for(var t=0;t<eventObj.services.length;t++){
                        if(t == eventObj.services.length -1){
                          emailContent+=eventObj.services[t].serviceName;
                        }else{
                          emailContent+=eventObj.services[t].serviceName+", ";
                        }
                      }
                      emailContent += "<br><br>"
                      +"Start time: "+eventObj.startDate
                      +"<br><bt>End time: "+eventObj.endDate
                      +"</p><style>*{font-family: 'Roboto', sans-serif;box-sizing:border-box;}</style>";

                      var mailOptions = {
                      from:'"Dailyworks" <customercare@dailyworks.ca>',
                      to:newUnconfirmedClientObj.email,
                      subject:"Appointment confirmation",
                      html:emailContent
                      };

                      emailTransporterCustomerCare.sendMail(mailOptions, function(err, info){
                        console.log('trying send email');
                        if(err){
                          console.log(err);
                          res.send('error');
                        }else{
                          res.send({appointmentId: eventObj._id, unconfirmedUserId:newUnconfirmedClientObj._id});
                        }
                      });
                    }else{
                      //phone nb only given
                      var fullLink = "dailyworks.ca/appointmentConfirmation?conf="+stringToken;
                      shortUrl.short(fullLink, function(errorUrlShortener, urlConfirm){
                        if(errorUrlShortener){
                          twilioClient.messages
                            .create({
                               body: "This is Dailyworks! Please click the following link within 12 hours or it will be cancelled. "+fullLink,
                               from: '+14388069608',
                               to: appointmentInfos.clientInfo.phone
                             }).then(function(message){
                               console.log(message.status);
                               res.send({appointmentId: eventObj._id, unconfirmedUserId:newUnconfirmedClientObj._id});
                          });
                        }else{
                          twilioClient.messages
                            .create({
                               body: "This is Dailyworks! Please click the following link within 12 hours or it will be cancelled. "+urlConfirm,
                               from: '+14388069608',
                               to: appointmentInfos.clientInfo.phone
                             }).then(function(message){
                               console.log(message.status);
                               res.send({appointmentId: eventObj._id, unconfirmedUserId:newUnconfirmedClientObj._id});
                          });
                        }
                      });
                    }
                  }
                });
              }
            });
          }
        })
      }
    }
  }
});

module.exports = app;
