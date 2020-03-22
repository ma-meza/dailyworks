const mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var storeSchema = new Schema({
  //0 is store brand settings && 1 is scheduling settings
  registrationTasks:{type:[Number], default:[0,1]},
  stripeSubscriptionId:{type:String, default:"0"},
  dateCreated:{type:Date, default:Date.now},
  storeName: {type: String, required: true},
  storeDescription:{type:String, required:false},
  email:{type:String, required:true},
  password:{type:String, required:true},
  phoneNumber:{type:String, required:false},
  location:{type:String, required:false},
  type:{type:Number, required:false}, //maybe change this to true
  ownerName:{type:String, required:false},
  newNotifications:{type:Boolean, default:false},
  newMessageNotifications:{type:Boolean, default:false},
  clientCanPickEmployee:{type:Boolean, default:false},
  ratings: [{
    _id:{type:mongoose.Schema.Types.ObjectId,required:true},
    anonymous:{type:Boolean, required:true},
    userId: {type:mongoose.Schema.Types.ObjectId,required:true},
    ratingValue:{type: Number, required:true},
    date:{type:Date, default:Date.now},
    comment:{type:String, required:false},
    clientName:{type:String, required:false},
  }],
  notifications:[{
    _id:{type:mongoose.Schema.Types.ObjectId,required:true},
    //type 0 = event modification acceptation, type 1 = new event requested acceptation
    type:{type:Number, required:true},
    accepted:{type:Boolean, default:null},
    relatedEventId:{type:mongoose.Schema.Types.ObjectId, required:false},
    relatedClientId:{type:mongoose.Schema.Types.ObjectId, required:false},
    relatedClientName:{type:String, required:false},
    text:{type:String, required:false}
  }],
  services:[{
    _id:{type:mongoose.Schema.Types.ObjectId,required:true},
      serviceName:{type:String, required:true},
      description:{type:String, required:false},
      price:{type:Number, required:false},
      employees:[{
        employeeId:{type:mongoose.Schema.Types.ObjectId, required:true},
        employeeName:{type:String, required:true}
      }]
    }],
  employees:[{
      _id:{type:mongoose.Schema.Types.ObjectId, required:true},
      employeeName:{type:String, required:true},
      schedule:[{
        startTime:{type:Number, required:true},
        endTime:{type:Number, required:true},
        weekDay:{type:Number, required:true}
      }],
      absences:[{
        _id:{type:mongoose.Schema.Types.ObjectId, required:true},
        reason:{type:String, required:true},
        startTime:{type:Date, required:true},
        endTime:{type:Date, required:true}
      }]
    }],
  profilePictureLink:{type:String, required:false},
  backgroundPictures:{type:[String], required:false},
  unreadMessages:{type:Number, default:0},
  storeSchedule:[{
    startTime:{type:Number, required:true},
    endTime:{type:Number, required:true},
    weekDay:{type:Number, required:true}
  }],
  storeAbsences:[{
    _id:{type:mongoose.Schema.Types.ObjectId, required:true},
    reason:{type:String, default:"Absence"},
    startDate:{type:String, required:true},
    endDate:{type:String, default:-1},
    startTime:{type:Number, default:-1},
    endTime:{type:Number, default:-1}
  }],
  facebookLink:{type:String, required:false},
  instagramLink:{type:String, required:false},
  websiteLink:{type:String, required:false}
});



var Store = mongoose.model('Stores', storeSchema, 'Stores');


module.exports = Store;
