const mongoose = require('mongoose');
var Schema = mongoose.Schema;
//for people who dont want to book online


// create a schema
var resetPasswordQueue = new Schema({
  email:{type:String, required:false},
  token:{type:String, required:true},
  dateCreated:{type:Date, default:Date.now},
  userId:{type:mongoose.Schema.Types.ObjectId, required:true}
});


var ResetPasswordQueue = mongoose.model('ResetPasswordQueue', resetPasswordQueue, 'ResetPasswordQueue');


module.exports = ResetPasswordQueue;
