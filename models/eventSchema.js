const mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var eventSchema = new Schema({
  storeId:{type:mongoose.Schema.Types.ObjectId, required:true},
  storeName:{type:String, required:true},
  backendDateObjStart:{type:Date, required:true},
  backendDateObjEnd:{type:Date, required:true},
  clientId:{type:mongoose.Schema.Types.ObjectId, required:true},
  clientName:{type:String, required:true},
  employeeId:{type:mongoose.Schema.Types.ObjectId, required:true},
  employeeName:{type:String, required:true},
  recurring:{type:Boolean, required:true},
  fullDay:{type:Boolean, default:false},
  frequencyRecurring:{type:Number, default:null},
    //(0 = everyDay, 1 = once a week, 2 = once a month, 3 = once a year)
  services:[{
    serviceName:{type:String, required:true},
    serviceDescription:{type:String, required:true},
    price:{type:mongoose.Schema.Types.Decimal128, required:true},
    durationDays:{type:Number, default:0},
    durationHours:{type:Number, default:0},
    durationMinutes:{type:Number, default:0}
  }],
  numberTimesMissedOrMoved:{type:Number, default:0}
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
var Event = mongoose.model('Event', eventSchema, 'Events');


module.exports = Event;
