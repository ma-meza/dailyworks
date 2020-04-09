const cluster = require("cluster");
cluster.schedulingPolicy = cluster.SCHED_RR;
const numCPUs = require("os").cpus().length;
var cron = require("node-cron");


//clusters for all numCPUs
if (cluster.isMaster) {

  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();
  }


  cluster.on('online', function(worker) {
      console.log('Worker ' + worker.process.pid + ' is online');
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    cluster.fork(); // Create a New Worker, If Worker is Dead
  });



  //cron jobs
  cron.schedule("0 */1 * * *", function(){
    cluster.workers[Object.keys(cluster.workers)[0]].send({msgType:0, msgContent:"do cron job unconfirmed apptmnts/guest clients"});
    cluster.workers[Object.keys(cluster.workers)[1]].send({msgType:2, msgContent:"do cron job apptmnts reminders"});
  });


  function restartAllWorkers(){
    var wid, workerIds = [];

    for(wid in cluster.workers) {
        workerIds.push(wid);
    }
    workerIds.forEach(function(wid) {
        cluster.workers[wid].send({
            msgType:1,
            msgContent:"Restart worker"
        });
        setTimeout(function() {
            if(cluster.workers[wid]) {
                cluster.workers[wid].kill('SIGKILL');
            }
        }, 5000);
    });
  }


} else {
//cluster is worker


const cronJobs = require('./cronJobs');
  process.on("message", function(message){
    if(message.msgType == 0){
      //cron job message for old unconfirmed
      cronJobs.deleteOlderUnconfirmedAppointmentsAndClients();
    }else if(message.msgType == 1){
      //restart message
      process.exit(0);
    }else if(message.msgType == 2){
      cronJobs.appointmentReminderFinder()
    }
  });

  require('dotenv').config();

  //modules
  const express = require('express');
  const bodyParser = require('body-parser');
  const mongoose = require('mongoose');
  const moment = require('moment');
  const fileUpload = require('express-fileupload');
  const ObjectID = require('mongodb').ObjectID;
  const nodemailer = require("nodemailer");
  const sanitize = require("mongo-sanitize");
  const i18n = require('./i18n');
  const compression = require('compression');
  const cookieParser = require('cookie-parser');

  //include file for all functions

  const cookieFunctions = require('./cookieFunctions');
  const sessionMiddlewares = require('./middlewares/sessionCheck');

  //EXPRESS
  var app = express();
  app.use(cookieParser());
  app.use(i18n.init);
  // app.use(compression);
  app.use(express.static(__dirname + '/public')); // configure express to use public folder for all img srcs and other files
  app.set('view engine', 'ejs'); // configure template engine
  app.use(bodyParser.json()); // parse form data client in http header for post
  app.use(bodyParser.urlencoded({
      parameterLimit: 10000,
      limit: '50mb',
      extended: true
  }));
  app.use(fileUpload()); // configure fileupload for file uploads req.files.NAMEOFINPUT


  //include all get routes
  var businessRoutes = require('./routes/businessRoutes');
  var clientRoutes = require('./routes/clientRoutes');
  var authRoutes = require('./routes/authRoutes');
  var hybridRoutes = require('./routes/hybridRoutes');

  app.use('/', clientRoutes);
  app.use('/', businessRoutes);
  app.use('/', authRoutes);
  app.use('/', hybridRoutes);


  //mongoose schemas
  var Store = require('./models/storeSchema');
  var Conversation = require('./models/conversationSchema');
  var Event = require('./models/eventSchema');
  var Client = require('./models/userSchema');
  var LocalGuestClient = require('./models/localGuestClientSchema');
  var B2bPrelaunchClient = require('./models/b2bPrelaunchSchema');


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


// mongoose.connect("mongodb+srv://markymark:Fortune2019@cluster0-sotud.gcp.mongodb.net/test?retryWrites=true&w=majority", {  useNewUrlParser: true, useUnifiedTopology: true}).catch(error => console.log("MONGO SERVER ERROR"+error));
mongoose.connect('mongodb://localhost:27017/appointmentApp', {useNewUrlParser: true, useUnifiedTopology: true}).catch(error => console.log("MONGO SERVER ERROR"+error));

// const express_enforces_ssl = require('express-enforces-ssl');
// const helmet = require('helmet');
// const sixtyDaysInSeconds = 5184000
// app.use(helmet.hsts({
//   maxAge: sixtyDaysInSeconds
// }));
// app.use(express_enforces_ssl());
// app.set('trust proxy', true);











app.get('/warzone', function(req, res) {
    res.render('warzone', {languageCookie:cookieFunctions.getLanguageCookieValue(req, res)});
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

app.get('/1', function(req, res){
      res.render('landingPageStorePreLaunch', {languageCookie:cookieFunctions.getLanguageCookieValue(req, res)});
      sendNotice(1, getIpClient(req));
});


app.post('/registerPrelaunchB2bEmails', function(req, res){
if(req.body.email){
  var targetEmail = sanitize(req.body.email);
var mailOptions = {
from:'"Dailyworks Pre-launch" <customercare@dailyworks.ca>',
to:targetEmail,
subject:"Welcome to Dailyworks!",
html:"<link href='https://fonts.googleapis.com/css?family=Roboto:400,900&display=swap' rel='stylesheet'><meta name='viewport' content='width=device-width, initial-scale=1.0'><div style='position:fixed;left:0;top:0;width:100%;height:500px;background-color:#f9f9f9;'><div id='whiteDiv' style='padding-bottom:30px;position:relative;margin-top:20px;left:20px;width:calc(100% - 40px); background-color:#fff;height:fit-content;min-height:100px;border-radius:10px;-webkit-box-shadow: 0px 7px 24px -6px rgba(0,0,0,0.75);  -moz-box-shadow: 0px 7px 24px -6px rgba(0,0,0,0.75);box-shadow: 0px 7px 24px -6px rgba(0,0,0,0.75);padding-top:20px;'><img src='https://dailyworks.ca/assets/logos/dwFullLogoBlack.jpg' style='border-radius:10px;position:relative;margin-bottom:40px;margin-left:20px;margin-top:0px;height:50px;'><p class='text'style='font-size:30px;color:#000;position:relative;margin:0;margin-left:20px;margin-right:20px;font-weight:900; margin-bottom:30px;'>Thank you for joining our vip pre-launch list!</p><p class='text' style='font-size:20px;color:#000;position:relative;margin:0;margin-left:20px;margin-right:20px;font-weight:400;'>We'll contact you again when we launch in March. Hope you're ready to make your business thrive.</p></div></div><style>*{font-family: 'Roboto', sans-serif;box-sizing:border-box;}</style>"
};


  B2bPrelaunchClient.findOne({email:targetEmail}).then(function(currentUser){
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
               sendNotice(0, targetEmail);
               res.send('ok');
             }

           });
         }
       }else{

           B2bPrelaunchClient.create({ email: targetEmail}, function (err, clientObj) {
             if (err){
               console.log(err);
               res.send('error');
             }else{
               emailTransporterCustomerCare.sendMail(mailOptions, function(err, info){
                 console.log('trying send email');
                 if(err){
                   console.log(err);
                   B2bPrelaunchClient.updateOne({email:targetEmail}, {emailSent:false}, function(errorUpdate, responseObj){
                     res.send('error');
                   });
                 }else{
                   sendNotice(0, targetEmail);
                   res.send('ok');
                 }
               });

             }
         });
       }
  });
}
});














// app.get('/faq', function(req, res){
//   res.render('storeFaq', {languageCookie:cookieFunctions.getLanguageCookieValue(req, res)});
// });

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

app.get('/getMoreEventsLater', sessionMiddlewares.loggedInCheck, function(req, res){
var nbEventsAlreadyFetched = 0;
var nbEventsQueryLimit = 10;
if(req.query.lastEventId){
  nbEventsAlreadyFetched = sanitize(req.query.lastEventId);
}
if(req.query.limitNumber){
  nbEventsQueryLimit = sanitize(req.query.limitNumber);
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

app.get('/getStoreEventsOfDate', function(req, res){
//api for clients
if(req.query.storeId && req.query.dateWanted && req.query.employeeId){
  var dateParam = new Date(sanitize(req.query.dateWanted));
  var storeId = sanitize(req.query.storeId);
  var employeeId = sanitize(req.query.employeeId);
  var day = dateParam.getDate();
  var month = dateParam.getMonth()+1;
  var year = dateParam.getFullYear();
  var dateString = year+"-";
  if(month<10){
    dateString+="0"+month+"-";
  }else{
    dateString+=month+"-";
  }
  if(day<10){
    dateString+="0"+day;
  }else{
    dateString+=day;
  }
  var minDate = new Date(dateString+"T00:00:00.000");

  var maxDate = new Date(dateString+"T23:59:59.000");
  if(req.query.employeeId == -1){
    Event.find({storeId:mongoose.Types.ObjectId(storeId), startDate:{"$gte":minDate}, endDate:{"$lte":maxDate}}, {_id:1, clientName:1, startDate:1, endDate:1, fullDay:1, services:1},{sort: {'startDate': 1}},function(err, resultObj){
      if(err){
        console.log(err);
        res.send('error');
      }else{
        res.send(resultObj);
      }
    });
  }else{
    Event.find({storeId:mongoose.Types.ObjectId(storeId), startDate:{"$gte":minDate}, endDate:{"$lte":maxDate}, employeeId:req.query.employeeId},{_id:1, clientName:1, startDate:1, endDate:1, fullDay:1, services:1},{sort: {'startDate': 1}},function(error, resultObj){
      if(error){
        console.log(error)
        res.send('error');
      }else{
        res.send(resultObj);
      }
    });
  }
}else{
  res.send("error");
}
});

app.get('/changeLanguage', function(req,res){
  var languageRequested = req.query.locale;
  res.cookie('lang', languageRequested, { maxAge: 90000000000, httpOnly: true });
  res.redirect('/home');
});

app.get('/getAllStoreLocalGuestClients', sessionMiddlewares.loggedInCheck,function(req, res){
  LocalGuestClient.find({storeId:mongoose.Types.ObjectId(res.locals.userId)},{}, function(error, clientsObj){
    if(error){
      res.send('error');
    }else{
      res.send(JSON.stringify(clientsObj));
    }
  });
});

app.get('/clientGeneralSearch', function(req, res){
  if(req.query.searchQuery){
    var searchQuery = sanitize(req.query.searchQuery);
    console.log("Search query: "+searchQuery);

    Store.find({storeName:{ $regex: searchQuery, $options: "i" }}, {_id:1, storeName:1}, function(err, resultsObj){
      if(err){
        console.log(err);
        res.send('error');
      }else{
        res.send(resultsObj);
      }
    });
  }else{
    res.send("error");
  }
});




app.use(function(req, res, next) {
  return res.status(404).render('404page.ejs', {languageCookie:cookieFunctions.getLanguageCookieValue(req, res)});
});

app.listen(process.env.PORT || 3000, function() {
    console.log('Worker started! id:'+cluster.worker.id);
});


//closing bracket for end of cluster type child
}
