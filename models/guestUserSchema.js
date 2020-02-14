const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// create a schema
var userSchema = new Schema({
  dateCreated:{type:Date, default:Date.now},
  clientName:{type:String, required:true},
  password:{type:String, required:false},
  email:{type:String, required:true},
  phoneNumber:{type:String, required:false},
  location:{type:String, required:false},
  unreadMessages:{type:Number, default:0},
  profilePictureLink:{type:String, required:false},
  socialNetId:{type:String, required:false},
  points:{type:Number, default:0}
});


var Client = mongoose.model('Client', userSchema, 'Clients');


module.exports = Client;
