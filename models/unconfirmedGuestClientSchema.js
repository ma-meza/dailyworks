const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
//for people who book online but don't create account


// create a schema
var unconfirmedGuestUserSchema = new Schema({
  dateCreated:{type:Date, default:Date.now},
  clientName:{type:String, required:false},
  email:{type:String, required:false},
  phoneNumber:{type:String, required:false},
  points:{type:Number, default:0},
  confirmationToken:{type:String, required:true}
});


var UnconfirmedGuestClient = mongoose.model('UnconfirmedGuestClient', unconfirmedGuestUserSchema, 'UnconfirmedGuestClients');


module.exports = UnconfirmedGuestClient;
