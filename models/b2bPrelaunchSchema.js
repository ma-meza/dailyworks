const mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var b2bPrelaunchSchema = new Schema({
  dateRegistered:{type:Date, default:Date.now},
  email:{type:String, default:null},
  emailSent:{type:Boolean, default:true}
});


var B2bPrelaunchClient = mongoose.model('B2bPrelaunchClient', b2bPrelaunchSchema, 'B2bPrelaunchClients');


module.exports = B2bPrelaunchClient;
