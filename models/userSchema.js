const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// create a schema
var userSchema = new Schema({
  dateCreated:{type:Date, default:Date.now},
  clientName:{type:String, required:true},
  password:{type:String, required:false},
  email:{type:String, default:null},
  phoneNumber:{type:String, default:null},
  location:{type:String, default:null},
  profilePictureLink:{type:String, default:null},
  socialNetId:{type:String, required:false},
  points:{type:Number, default:0}
});


var Client = mongoose.model('Client', userSchema, 'Clients');


module.exports = Client;
