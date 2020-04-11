module.exports.latitudeValidator = function(latValue){
  latValue = parseFloat(latValue);
  if(latValue>= -90 && latValue<= 90){
    return true;
  }else{
    return false;
  }
}

module.exports.longitudeValidator = function(lngValue){
  lngValue = parseFloat(lngValue);
  if(lngValue>= -180 && lngValue<= 180){
    return true;
  }else{
    return false;
  }
}

module.exports.validatePhoneNumber(phoneNumberParam){
  if(phoneNumberParam.length == 10){
  return true;
  }else if(phoneNumberParam.length == 11 && phoneNumberParam.charAt(0)=="1"){
  return true;
  }else{
    return false;
  }
}

module.exports.validateEmailAddress(emailParam){
if(emailParam.charAt(0) != "@" && emailParam.indexOf("@")!=-1 && emailParam.charAt(emailParam.length-1)!="@"){
return true;
}else{
  return false;
}

}
