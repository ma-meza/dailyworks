const mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var storeSchema = new Schema({
  registrationTasks:{
    type:Array
    //0 is store brand settings && 1 is scheduling settings
  },
  stripeSubscriptionId:{type:String, default:"0"},
  dateCreated:{type:Date, default:Date.now},
  storeName: { type: String, required: true},
  storeDescription:{type:String},
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
    anonymous:{type:Boolean, required:true},
    userId: {type:mongoose.Schema.Types.ObjectId,required:true},
    ratingValue:{type: Number, required:true},
    date:{type:Date, default:Date.now},
    comment:{type:String, default:null},
    clientName:{type:String, required:true},
    flags:[{
      userId:{type:mongoose.Schema.Types.ObjectId, required:true},
      date:{type:Date, default:Date.now}
    }]
  }],
  notifications:[{
    //type 0 = event modification acceptation, type 1 = new event requested acceptation
    type:{type:Number, required:true},
    accepted:{type:Boolean, default:null},
    relatedEventId:{type:Number, default:null},
    relatedClientId:{type:Number, default:null},
    relatedClientName:{type:String, default:null},
    text:{type:String, default:null}
  }],
  localGuestClients:[{
    fullName:{type:String, default:null},
    email:{type:String, default:null},
    phoneNumber:{type:String, default:null},
    address:{type:String},
    birthDate:{type:mongoose.Schema.Types.Date},
    appointmentReminderTypes:[{type:Number}],
    customerSince:{type:mongoose.Schema.Types.Date}
    }
  ],
  services:[{

      serviceName:{type:String, required:true},
      description:{type:String, required:true},
      price:{type:mongoose.Schema.Types.Decimal128, required:true},
      employeeId:{type:mongoose.Schema.Types.ObjectId, required:true},
      employeeName:{type:String, required:true}
    }],
  employees:[{
      _id:{type:mongoose.Schema.Types.ObjectId, required:true},
      employeeName:{type:String, required:true},
      schedule:[{
        startTime:{type:String, required:true},
        endTime:{type:String, required:true},
        weekDay:{type:Number, required:true}
      }],
      servicesOffered:[{
          _id:{type:mongoose.Schema.Types.ObjectId, required:true},
          name:{type:String, required:true}
      }],
      absences:[{
        reason:{type:String, required:true},
        startTime:{type:String, required:true},
        endTime:{type:String, required:true}
      }]
    }],
  profilePictureLink:{type:String, required:false},
  backgroundPictures:[{
    link:{type:String, required:true}
  }],
  unreadMessages:{type:Number, default:0},
  storeSchedule:[{
    startTime:{type:Number, required:true},
    endTime:{type:Number, required:true},
    weekDay:{type:Number, required:true}
  }],
  storeAbsences:[{
    _Id:{type:mongoose.Schema.Types.ObjectId, required:true},
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
