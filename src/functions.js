function formatFullDayDate(dateString, timeString){


if(dateString==""|| timeString==""){
  return "";
}else{


  //received as JJ-MM-AAAA
    //want AAAA-MM-JJ
  var splittedDateArray = dateString.split('/');
  var splittedDateString = "";
  var splittedTimeString = "";
  var beforeFinalFormatTime = "";

  //remove am and pm from time
  if(timeString.charAt(timeString.length-1).toUpperCase() != timeString.charAt(timeString.length-1).toLowerCase() && timeString.charAt(timeString.length-2).toUpperCase() != timeString.charAt(timeString.length-2).toLowerCase()){
  for(var i=0;i<timeString.length-2;i++){
  beforeFinalFormatTime+= timeString.charAt(i);
  }
  }

  //add 0 if only one char
  var timeArray = beforeFinalFormatTime.split(':');
  for(var r=0;r<timeArray.length;r++){
    if(timeArray[r].length<2){
      splittedTimeString+="0"+timeArray[r]+":";
    }else{
      splittedTimeString+=timeArray[r]+":";
    }
  }



  for(var w=0;w<splittedDateArray.length;w++){
    if(splittedDateArray[w].length<2){
      splittedDateArray[w] = "0"+splittedDateArray[w];
    }
  }

  splittedDateString = splittedDateArray[2]+"-"+splittedDateArray[1]+"-"+splittedDateArray[0];

  return splittedDateString+"T"+splittedTimeString+"00";
  }
}



module.exports.formatFullDayDate = formatFullDayDate;
