const sessionMiddlewares = require('../middlewares/sessionCheck');
const cookieFunctions = require('../cookieFunctions');
const Client = require('../models/userSchema');
const Event = require('../models/eventSchema');
const GuestClient = require('../models/guestUserSchema');
const UnconfirmedGuestClient = require('../models/unconfirmedGuestClientSchema');
const Store = require('../models/storeSchema');
const ObjectID = require('mongodb').ObjectID;
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const levenshtein = require('fast-levenshtein');
const sanitize = require('mongo-sanitize');
const router = require('express').Router();
const yj = require('yieldable-json');

//page index of website
router.get('/', function (req, res) {
  console.log('yp');
  var coordsCookie = req.cookies.coords;
  if (coordsCookie) {
    var coordsArray = coordsCookie.split(';');
    var coordsObj = { latitude: coordsArray[0], longitude: coordsArray[1] };
    res.render('clientIndex', {
      languageCookie: cookieFunctions.getLanguageCookieValue(req, res),
      coords: coordsObj,
    });
  } else {
    res.render('clientIndex', { languageCookie: cookieFunctions.getLanguageCookieValue(req, res) });
  }
});

//NOT ASYNC YET!!!
router.get('/feed', function (req, res) {
  if (req.query.stype) {
    res.render('clientFeedSearch', {
      languageCookie: cookieFunctions.getLanguageCookieValue(req, res),
    });
  } else {
    res.redirect('/');
  }
});

//page where client can login
router.get('/login', sessionMiddlewares.denyIfLoggedIn, function (req, res) {
  res.render('clientLogin', { languageCookie: cookieFunctions.getLanguageCookieValue(req, res) });
});

//page where client can signup
router.get('/signup', sessionMiddlewares.denyIfLoggedIn, function (req, res) {
  res.render('clientSignup', { languageCookie: cookieFunctions.getLanguageCookieValue(req, res) });
});

//page where client inputs his email to reset password
router.get('/resetPassword', sessionMiddlewares.denyIfLoggedIn, function (req, res) {
  res.render('clientResetPassword', {
    languageCookie: cookieFunctions.getLanguageCookieValue(req, res),
  });
});

//page where client inputs his new password if token is OK
router.get('/newPassword', sessionMiddlewares.denyIfLoggedIn, function (req, res) {
  console.log(req.query.t);
  if (req.query.t) {
    var maxDateToken = new Date();
    maxDateToken = maxDateToken.setHours(maxDateToken.getHours() - 6);
    ResetPasswordQueue.findOne(
      { token: req.query.t, dateCreated: { $gte: maxDateToken } },
      { _id: 1, email: 1 },
      function (errorFind, findObj) {
        if (errorFind) {
          res.redirect('/error');
        } else {
          if (findObj) {
            res.render('clientNewPassword', {
              languageCookie: cookieFunctions.getLanguageCookieValue(req, res),
              status: 'ok',
              token: req.query.t,
              email: findObj.email,
            });
          } else {
            res.render('clientNewPassword', {
              languageCookie: cookieFunctions.getLanguageCookieValue(req, res),
              status: 'expired',
            });
          }
        }
      }
    );
  } else {
    res.redirect('/');
  }
});

//page where client can see his profile
router.get('/profile', sessionMiddlewares.loggedInCheck, function (req, res) {
  if (res.locals.userType == 'store') {
    res.redirect('/home');
  } else {
    Client.findOne({ _id: mongoose.Types.ObjectId(res.locals.userId) }, { password: 0 }, function (
      err,
      clientInfoObject
    ) {
      if (err) {
        console.log(err);
        res.redirect('/error');
      } else {
        res.render('clientProfile', {
          clientObj: clientInfoObject,
          languageCookie: cookieFunctions.getLanguageCookieValue(req, res),
        });
      }
    });
  }
});

//page where client can see his agenda
router.get('/agenda', sessionMiddlewares.loggedInCheck, function (req, res) {
  if (res.locals.userType == 'store') {
    res.redirect('/home');
  } else {
    Event.find(
      { clientId: mongoose.Types.ObjectId(res.locals.userId), startDate: { $gte: new Date() } },
      {},
      { sort: { startDate: 1 }, limit: 20 },
      function (err, resultObj) {
        if (err) {
          console.log(err);
          res.redirect('/error');
        } else {
          res.render('clientAgenda', {
            eventsObj: resultObj,
            languageCookie: cookieFunctions.getLanguageCookieValue(req, res),
          });
        }
      }
    );
  }
});

//page where client lands after making appointment while not logged in and then logged in
router.get('/successAppointmentLoggedIn', sessionMiddlewares.loggedInCheck, function (req, res) {
  if (req.query.aid) {
    var appointmentId = sanitize(req.query.aid);
    Event.findOne({ _id: mongoose.Types.ObjectId(appointmentId) }, function (err, eventObj) {
      if (err) {
        console.log(err);
        res.redirect('/error');
      } else {
        console.log('_____________');
        console.log(eventObj);

        res.render('successAppointmentLoggedIn', { eventObj: eventObj });
      }
    });
  } else {
    res.redirect('/home');
  }
});

//page where client can modify appointment
router.get('/modifyAppointment', function (req, res) {
  if (req.query.aid) {
    var appointmentId = sanitize(req.query.aid);
    Event.findOne({ _id: mongoose.Types.ObjectId(appointmentId) }, function (err, eventObj) {
      if (err) {
        console.log(err);
        res.redirect('/error');
      } else {
        console.log('_____________');
        console.log(eventObj);
        res.render('clientModifyAppointment', { eventObj: eventObj });
      }
    });
  } else {
    res.redirect('/home');
  }
});

//script and page when user clicks on confirmation link email after making guets client appointment
router.get('/appointmentConfirmation', function (req, res) {
  if (req.query.conf) {
    var confirmationToken = sanitize(req.query.conf);
    UnconfirmedGuestClient.findOne({ confirmationToken: confirmationToken }, function (
      errorFind,
      unconfirmedGuestObj
    ) {
      if (errorFind) {
        res.redirect('/error');
      } else {
        if (unconfirmedGuestObj) {
          // unconfirmed user found
          GuestClient.find(
            {
              $or: [
                { phoneNumber: unconfirmedGuestObj.phoneNumber },
                { email: unconfirmedGuestObj.email },
              ],
            },
            function (errorFindGuest, foundGuestsObj) {
              if (errorFindGuest) {
                res.redirect('/error');
              } else {
                if (foundGuestsObj && foundGuestsObj.length > 0) {
                  //existing guests found
                  for (var y = 0; y < foundGuestsObj.length; y++) {
                    var distanceProbability =
                      1 -
                      levenshtein.get(
                        foundGuestsObj[y].clientName,
                        unconfirmedGuestObj.clientName
                      ) /
                      foundGuestsObj[y].clientName.length;
                    console.log('PROBAB :' + distanceProbability);
                    foundGuestsObj[y].clientNameDistance = distanceProbability;
                    console.log(foundGuestsObj[y]);
                  }
                  function compare(a, b) {
                    const distanceA = a.clientNameDistance;
                    const distanceB = b.clientNameDistance;

                    let comparison = 0;
                    if (distanceA > distanceB) {
                      comparison = 1;
                    } else if (distanceA < distanceB) {
                      comparison = -1;
                    }
                    return comparison;
                  }
                  foundGuestsObj.sort(compare);
                  var highestProbabilityGuestClient = foundGuestsObj[foundGuestsObj.length - 1];
                  console.log('HIGHEST PROBABILITY: ' + highestProbabilityGuestClient);
                  if (highestProbabilityGuestClient.clientNameDistance < 0.6) {
                    //not enough certainty exact match so create new guest
                    GuestClient.create(
                      {
                        dateCreated: unconfirmedGuestObj.dateCreated,
                        clientName: unconfirmedGuestObj.clientName,
                        email: unconfirmedGuestObj.email,
                        phoneNumber: unconfirmedGuestObj.phoneNumber,
                      },
                      function (errorCreate, newGuestClientObj) {
                        if (errorCreate) {
                          res.redirect('/error');
                        } else {
                          if (newGuestClientObj) {
                            Event.updateOne(
                              { clientId: mongoose.Types.ObjectId(unconfirmedGuestObj._id) },
                              {
                                confirmed: true,
                                reminderPhone: unconfirmedGuestObj.phoneNumber,
                                reminderEmail: unconfirmedGuestObj.email,
                                clientId: mongoose.Types.ObjectId(newGuestClientObj._id),
                              },
                              { new: true },
                              function (err, eventObj) {
                                if (err) {
                                  console.log(err);
                                  res.redirect('/error');
                                } else {
                                  UnconfirmedGuestClient.deleteOne(
                                    { _id: mongoose.Types.ObjectId(unconfirmedGuestObj._id) },
                                    function (errorDeleted) { }
                                  );
                                  res.render('guestClientConfirmationAppointment', {
                                    eventObj: eventObj,
                                  });
                                }
                              }
                            );
                          } else {
                            res.redirect('/error');
                          }
                        }
                      }
                    );
                  } else {
                    //enough probability match so merge guests
                    GuestClient.updateOne(
                      { _id: highestProbabilityGuestClient._id },
                      {
                        clientName: unconfirmedGuestObj.clientName,
                        phoneNumber: unconfirmedGuestObj.phoneNumber,
                        email: unconfirmedGuestObj.email,
                      },
                      { new: true },
                      function (errorUpdateGuest, newGuestClientObj) {
                        if (errorUpdateGuest) {
                          res.redirect('/error');
                        } else {
                          Event.updateOne(
                            { clientId: mongoose.Types.ObjectId(unconfirmedGuestObj._id) },
                            {
                              confirmed: true,
                              reminderEmail: unconfirmedGuestObj.email,
                              reminderPhone: unconfirmedGuestObj.phoneNumber,
                              clientId: mongoose.Types.ObjectId(highestProbabilityGuestClient._id),
                            },
                            { new: true },
                            function (err, eventObj) {
                              if (err) {
                                console.log(err);
                                res.redirect('/error');
                              } else {
                                UnconfirmedGuestClient.deleteOne(
                                  { _id: mongoose.Types.ObjectId(unconfirmedGuestObj._id) },
                                  function (errorDeleted) { }
                                );
                                res.render('guestClientConfirmationAppointment', {
                                  eventObj: eventObj,
                                });
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                } else {
                  //no guest found
                  GuestClient.create(
                    {
                      dateCreated: unconfirmedGuestObj.dateCreated,
                      clientName: unconfirmedGuestObj.clientName,
                      email: unconfirmedGuestObj.email,
                      phoneNumber: unconfirmedGuestObj.phoneNumber,
                    },
                    function (errorCreate, newGuestClientObj) {
                      if (errorCreate) {
                        res.redirect('/error');
                      } else {
                        if (newGuestClientObj) {
                          Event.updateOne(
                            { clientId: mongoose.Types.ObjectId(unconfirmedGuestObj._id) },
                            {
                              confirmed: true,
                              reminderEmail: unconfirmedGuestObj.email,
                              reminderPhone: unconfirmedGuestObj.phoneNumber,
                              clientId: mongoose.Types.ObjectId(newGuestClientObj._id),
                            },
                            { new: true },
                            function (err, eventObj) {
                              if (err) {
                                console.log(err);
                                res.redirect('/error');
                              } else {
                                UnconfirmedGuestClient.deleteOne(
                                  { _id: mongoose.Types.ObjectId(unconfirmedGuestObj._id) },
                                  function (errorDeleted) { }
                                );
                                res.render('guestClientConfirmationAppointment', {
                                  eventObj: eventObj,
                                });
                              }
                            }
                          );
                        } else {
                          res.redirect('/error');
                        }
                      }
                    }
                  );
                }
              }
            }
          );
        } else {
          //unconfirmed user not found
          res.redirect('/home');
        }
      }
    });
  } else {
    res.redirect('/home');
  }
});

//page where client sees profile of store
router.get('/store/:storeId', function (req, res) {
  var businessId = sanitize(req.params.storeId);
  if (!req.cookies.appointmentApp) {
    //not logged in
    Store.findOne(
      { _id: businessId },
      {
        _id: 1,
        claimed: 1,
        storeName: 1,
        type: 1,
        storeDescription: 1,
        services: 1,
        location: 1,
        employees: 1,
        clientCanPickEmployee: 1,
        storeSchedule: 1,
        facebookLink: 1,
        instagramLink: 1,
        phoneNumber: 1,
        storeAbsences: 1,
      },
      function (error, resultObj) {
        if (error) {
          console.log(error);
          res.render('/home');
        } else {
          // object of the store
          if (resultObj) {
            if (resultObj.claimed == false) {
              Store.updateOne(
                { _id: businessId },
                { $inc: { weeklyPageClicksUnclaimed: 1, monthlyPageClicksUnclaimed: 1 } },
                function (errorUpdate, resultObj) {
                  console.log(errorUpdate);
                }
              );
            }
            res.render('storeProfile', {
              storeObj: resultObj,
              languageCookie: cookieFunctions.getLanguageCookieValue(req, res),
              loggedIn: false,
            });
          } else {
            res.redirect('/home');
          }
        }
      }
    );
  } else {
    jwt.verify(req.cookies.appointmentApp, process.env.JWT_SECRET_KEY, function (
      err,
      decryptedToken
    ) {
      if (err) {
        res.redirect('/home');
      } else {
        if (decryptedToken.type == 'store') {
          //not logged in as client
          Store.findOne(
            { _id: businessId },
            {
              _id: 1,
              claimed: 1,
              storeName: 1,
              type: 1,
              storeDescription: 1,
              services: 1,
              location: 1,
              employees: 1,
              clientCanPickEmployee: 1,
              storeSchedule: 1,
              facebookLink: 1,
              instagramLink: 1,
              phoneNumber: 1,
              storeAbsences: 1,
            },
            function (error, resultObj) {
              if (error) {
                console.log(error);
                res.render('/home');
              } else {
                // object of the store
                if (resultObj) {
                  if (resultObj.claimed == false) {
                    Store.updateOne(
                      { _id: businessId },
                      { $inc: { weeklyPageClicksUnclaimed: 1, monthlyPageClicksUnclaimed: 1 } },
                      function (errorUpdate, resultObj) {
                        console.log(errorUpdate);
                      }
                    );
                  }
                  res.render('storeProfile', {
                    storeObj: resultObj,
                    languageCookie: cookieFunctions.getLanguageCookieValue(req, res),
                    loggedIn: false,
                  });
                } else {
                  res.redirect('/home');
                }
              }
            }
          );
        } else {
          //logged in as client
          Store.findOne(
            { _id: businessId },
            {
              _id: 1,
              claimed: 1,
              storeName: 1,
              type: 1,
              storeDescription: 1,
              services: 1,
              location: 1,
              employees: 1,
              clientCanPickEmployee: 1,
              storeSchedule: 1,
              facebookLink: 1,
              instagramLink: 1,
              phoneNumber: 1,
              storeAbsences: 1,
            },
            function (error, resultObj) {
              if (error) {
                console.log(error);
                res.render('/home');
              } else {
                // object of the store
                if (resultObj) {
                  if (resultObj.claimed == false) {
                    Store.updateOne(
                      { _id: businessId },
                      { $inc: { weeklyPageClicksUnclaimed: 1, monthlyPageClicksUnclaimed: 1 } },
                      function (errorUpdate, resultObj) {
                        console.log(errorUpdate);
                      }
                    );
                  }
                  res.render('storeProfile', {
                    storeObj: resultObj,
                    languageCookie: cookieFunctions.getLanguageCookieValue(req, res),
                    loggedIn: true,
                  });
                } else {
                  res.redirect('/home');
                }
              }
            }
          );
        }
      }
    });
  }
});

module.exports = router;
