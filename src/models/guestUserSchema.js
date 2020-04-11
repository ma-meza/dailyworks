const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
//for people who book online but don't create account


// create a schema
var guestUserSchema = new Schema({
  dateCreated:{type:Date, default:Date.now},
  clientName:{type:String, required:false},
  email:{type:String, required:false},
  phoneNumber:{type:String, required:false},
  points:{type:Number, default:0}
});


var GuestClient = mongoose.model('GuestClient', guestUserSchema, 'GuestClients');


module.exports = GuestClient;
