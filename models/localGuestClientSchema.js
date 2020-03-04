const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// create a schema
var localGuestClientSchema = new Schema({
  fullName:{type:String, required:true},
  email:{type:String, required:false},
  phoneNumber:{type:String, required:false},
  address:{type:String, required:false},
  birthDate:{type:Date, required:false},
  customerSince:{type:Date, required:false},
  storeId:{type:mongoose.Schema.Types.ObjectId, required:true},
  points:{type:Number, default:0},
  appointmentReminderType:{type:[Number], required:false}
});


var LocalGuestClient = mongoose.model('LocalGuestClient', localGuestClientSchema, 'LocalGuestClients');


module.exports = LocalGuestClient;
