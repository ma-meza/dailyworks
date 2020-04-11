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
//                     res.render('storeMessenger',{conversation:resultObj, languageCookie:cookieFunctions.getLanguageCookieValue(req, res)});
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
//       res.render('clientMessenger',{conversation:resultObj, languageCookie:cookieFunctions.getLanguageCookieValue(req, res)});
//     }
//
//   });
// }
// });
