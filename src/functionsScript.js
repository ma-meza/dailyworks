function validatePhoneNumber(phoneNumberParam){
  if(phoneNumberParam.length == 10){
  return true;
  }else if(phoneNumberParam.length == 11 && phoneNumberParam.charAt(0)=="1"){
  return true;
  }else{
    return false;
  }
}

function validateEmailAddress(emailParam){
if(emailParam.charAt(0) != "@" && emailParam.indexOf("@")!=-1 && emailParam.charAt(emailParam.length-1)!="@"){
return true;
}else{
  return false;
}

}
