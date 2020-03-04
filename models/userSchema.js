const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// create a schema
var userSchema = new Schema({
  dateCreated:{type:Date, default:Date.now},
  clientName:{type:String, required:true},
  password:{type:String, required:false},
  email:{type:String, required:false},
  phoneNumber:{type:String, required:false},
  location:{type:String, required:false},
  profilePictureLink:{type:String, required:false},
  provider:{type:Number, default:null},
  socialNetId:{type:String, required:false},
  points:{type:Number, default:0}
});


var Client = mongoose.model('Client', userSchema, 'Clients');


module.exports = Client;
