const mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var conversationSchema = new Schema({
  storeId:{type:mongoose.Schema.Types.ObjectId, required:true},
  storeName:{type:String, required:true},
  clientId:{type:mongoose.Schema.Types.ObjectId, required:true},
  clientName:{type:String, required:true},
  timestampLastMessage:{type:Date, default:Date.now},
  messages:[{
    timestamp:{type:Date, default:Date.now},
    message:{type:String, default:null},
    messageType:{type:Number, required:true},
      //0 = textmessage, 1 = approval automatic message
    eventRelatedId:{type:mongoose.Schema.Types.ObjectId, default:null},
    senderIsStore:{type:Boolean, required:true}
  }]
});





//
//
// storeSchema.pre('save', function(next) {
//   // get the current date
//   var currentDate = new Date();
//   // if created_at doesn't exist, add to that field
//   if (!this.dateAccountCreated){
//     this.dateAccountCreated = currentDate;
// }
//   next();
// });
var Conversation = mongoose.model('Conversation', conversationSchema,'Conversations');


module.exports = Conversation;
