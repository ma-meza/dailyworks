const Store = require('./models/storeSchema');
const Event = require('./models/eventSchema');
const LocalGuestClient = require('./models/localGuestClientSchema');
const ObjectID = require('mongodb').ObjectID;
const mongoose = require('mongoose');
const app = require('express').Router();
const bcrypt = require('bcrypt');
const sessionMiddlewares = require('../middlewares/sessionCheck');
const sanitize = require("mongo-sanitize");


//remove notification boolean db for notification
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

// store posts new absence
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

//post store removes one or many absences
app.post('/deleteStoreAbsence', sessionMiddlewares.loggedInCheck, function(req, res){
  var absenceId = sanitize(req.body.absenceId);
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

//post store modifies some absence parameters
app.post('/updateStoreAbsencesSettings', sessionMiddlewares.loggedInCheck, function(req, res){
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
});


//post store adds service
app.post('/addStoreService', sessionMiddlewares.loggedInCheck, function(req,res){
  //[startDate, startTime, endDate, endTime, reason]
    var serviceObjId = new ObjectID();
    var serviceObj = req.body.serviceObj;
    serviceObj['_id'] = serviceObjId;
    if(serviceObj){
      Store.updateOne({_id:mongoose.Types.ObjectId(res.locals.userId)}, {$push:{services:serviceObj}}, function(errorUpdate, responseObjUpdated){
        if(errorUpdate){
          console.log(errorUpdate);
          res.send({status:'error'});
        }else{
          console.log(responseObjUpdated);
          res.send({status:'ok', serviceId:serviceObjId});
        }
      });
    }
});

//post store removes service
app.post('/deleteStoreService', sessionMiddlewares.loggedInCheck, function(req, res){
  var serviceId = sanitize(req.body.serviceId);
  Store.updateOne({ _id:mongoose.Types.ObjectId(res.locals.userId)}, {$pull: { services: { _id:mongoose.Types.ObjectId(serviceId)} } }, function(errorUpdate, responseObjUpdated){
    if(errorUpdate){
      console.log(errorUpdate);
      res.send('error');
    }else{
      console.log(responseObjUpdated);
      res.send("ok");
    }
  });
});

//post store updates some services parameters
app.post('/updateStoreServicesSettings', sessionMiddlewares.loggedInCheck, function(req,res){
  if(req.body.services){

    Store.findOne({_id:mongoose.Types.ObjectId(res.locals.userId)}, function(err, storeObj){
      if(err){

      }else{
      for(var w=0;w<req.body.services.length;w++){
        var targetId = req.body.services[w].id;
        for(var x=0;x<storeObj.services.length;x++){
          if(storeObj.services[x]._id == targetId){

          storeObj.services[x].serviceName = sanitize(req.body.services[w].name);
          storeObj.services[x].price = sanitize(req.body.services[w].price);
            break;
          }
        }
      }
      Store.updateOne({_id:mongoose.Types.ObjectId(res.locals.userId)}, {services:storeObj.services}, function(errorUpdate, responseObjUpdated){
        if(errorUpdate){
          console.log(errorUpdate);
          res.send('error');
        }else{
          res.send('ok');
        }
      });
      }
    });

  }else{
    res.send('error');
  }
});

//post store updates its general settings
app.post('/updateStoreGeneralSettings', sessionMiddlewares.loggedInCheck, function(req, res){
//bName, bLocation, bPhone,fbLink, instaLink, websiteLink, bEmail, oldPass, newPass, ownerName
var bName = sanitize(req.body.bname);
var bLocation = sanitize(req.body.bLocation);
var bPhone = sanitize(req.body.bPhone);
var fbLink = sanitize(req.body.fbLink);
var instaLink = sanitize(req.body.instaLink);
var websiteLink = sanitize(req.body.websiteLink);
var oldPass = sanitize(req.body.oldPass);
var newPass = sanitize(req.body.newPass);
var bEmail = sanitize(bEmail);
var ownerName = sanitize(ownerName);
  if(oldPass != "" && newPass != ""){
    Store.findOne({_id:mongoose.Types.ObjectId(res.locals.userId)}, {_id:0, storeName:1, ownerName:1, facebookLink:1, instagramLink:1, websiteLink:1,clientCanPickEmployee:1,location:1, phoneNumber:1, email:1}, function(error, responseObj){
      if(responseObj){
        bcrypt.compare(oldPass, responseObj.password, function(err, respBcrypt) {
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

                    if(bName !=""){
                      updateString["storeName"] = bName;
                    }
                    if(bLocation != ""){
                      updateString["location"] = bLocation;
                    }
                    if(bPhone != ""){
                      updateString["phoneNumber"] = bPhone;
                    }
                    if(fbLink != ""){
                      updateString["facebookLink"] = fbLink;
                    }
                    if(instaLink != ""){
                      updateString["instagramLink"] = instaLink;
                    }
                    if(websiteLink != ""){
                      updateString["websiteLink"] = websiteLink;
                    }
                    if(bEmail != ""){
                      updateString["email"] = bEmail;
                    }
                    if(ownerName != ""){
                      updateString["ownerName"] = ownerName;
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
      if(bName !=""){
        updateString["storeName"] = bName;
      }
      if(bLocation != ""){
        updateString["location"] = bLocation;
      }
      if(bPhone != ""){
        updateString["phoneNumber"] = bPhone;
      }
      if(fbLink != ""){
        updateString["facebookLink"] = fbLink;
      }
      if(instaLink != ""){
        updateString["instagramLink"] = instaLink;
      }
      if(websiteLink != ""){
        updateString["websiteLink"] = websiteLink;
      }
      if(bEmail != ""){
        updateString["email"] = bEmail;
      }
      if(ownerName != ""){
        updateString["ownerName"] = ownerName;
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

//store post updates store week schedule
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
          res.send('ok');
        }
      });
    }else{
      res.send('error');
    }
});

//store posts new appointment made in store (in-person) aka local guet client
app.post('/postNewAppointmentLocal', sessionMiddlewares.loggedInCheck, function(req, res){
  var servicesObj = new Array();
  for(var i=0;i<req.body.appointmentInfos.servicesObj.length;i++){
    var oneServiceObj = new Object();
    oneServiceObj.serviceId = mongoose.Types.ObjectId(req.body.appointmentInfos.servicesObj[i].id);
    oneServiceObj.price = req.body.appointmentInfos.servicesObj[i].price;
    oneServiceObj.serviceName = req.body.appointmentInfos.servicesObj[i].serviceName;
    oneServiceObj.duaration = req.body.appointmentInfos.servicesObj[i].duration;
    servicesObj.push(oneServiceObj);
  }
  var employeeId = '';
  var employeeName = "";
  if(req.body.appointmentInfos.employeeId == 'null'){
    employeeId = null;
    employeeName = null;
  }else{
    employeeId = mongoose.Types.ObjectId(req.body.appointmentInfos.employeeId);
    employeeName = req.body.appointmentInfos.employeeName;
  }

  if(req.body.clientInfos.newClient == true){
        Event.create({storeId:mongoose.Types.ObjectId(res.locals.userId), startDate:req.body.appointmentInfos.startDate, endDate:req.body.appointmentInfos.endDate, clientId:mongoose.Types.ObjectId(req.body.clientInfos.clientId), employeeId:employeeId, employeeName:employeeName, services:servicesObj, addNote:req.body.appointmentInfos.addNote}, function(errorEvent, eventObj){
          if(errorEvent){
            console.log(errorEvent);
            res.send('err');
          }else{
            res.send('ok');
          }
        });

  }else{
    LocalGuestClient.create({fullName:req.body.clientInfos.name, email:req.body.clientInfos.email, phoneNumber:req.body.clientInfos.phoneNumber, customerSince:new Date(), storeId:mongoose.Types.ObjectId(res.locals.userId)}, function(errorClient, clientObj){
      if(errorClient){
        console.log(errorClient);
        res.send('err');
      }else{
        Event.create({storeId:mongoose.Types.ObjectId(res.locals.userId), startDate:req.body.appointmentInfos.startDate, endDate:req.body.appointmentInfos.endDate, clientId:clientObj._id, employeeId:employeeId, employeeName:employeeName, services:servicesObj, addNote:req.body.appointmentInfos.addNote}, function(errorEvent, eventObj){
          if(errorEvent){
            console.log(errorEvent);
            res.send('err');
          }else{
            res.send('ok');
          }
        });
      }
    });
  }
});
module.exports = app;
