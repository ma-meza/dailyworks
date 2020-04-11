function createMoreInfoEventDiv(appointmentMoreInfo){

var appointmentMoreInfoStartDate = new Date(appointmentMoreInfo.backendDateObjStart);
var appointmentMoreInfoEndDate = new Date(appointmentMoreInfo.backendDateObjEnd);

  var dateTimeString = "";
  var employeeName = "";
  var recurringString = "";
  if(appointmentMoreInfo.employeeName == null){
    employeeName = "Attended by a random employee";
  }else{

    employeeName = "Attended by "+appointmentMoreInfo.employeeName;
  }


  if(appointmentMoreInfo.recurring ==true){
    //(0 = everyDay, 1 = once a week, 2 = once a month, 3 = once a year)
    if(appointmentMoreInfo.frequencyRecurring == 0){
      recurringString = "<p class='moreInfoRegularText'>Occurs every day</p>";
    }else if(appointmentMoreInfo.frequencyRecurring == 1){
      recurringString = "<p class='moreInfoRegularText'>Occurs every week</p>";
    }else if(appointmentMoreInfo.frequencyRecurring == 2){
      recurringString = "<p class='moreInfoRegularText'>Occurs every month</p>";
    }else if(appointmentMoreInfo.frequencyRecurring == 3){
      recurringString = "<p class='moreInfoRegularText'>Occurs every year</p>";
    }

  }


  if(appointmentMoreInfo.fullDay == true){
    //all day
    dateTimeString = weekDayName[appointmentMoreInfoStartDate.getDay()]+", "+monthsName[appointmentMoreInfoStartDate.getMonth()]+" "+appointmentMoreInfoStartDate.getDate()+" &#9679; "+appointmentMoreInfoStartDate.getHours()+":"+appointmentMoreInfoStartDate.getMinutes()+" - all day";

  }else if(appointmentMoreInfoEndDate == null){
    dateTimeString = weekDayName[appointmentMoreInfoStartDate.getDay()]+", "+monthsName[appointmentMoreInfoStartDate.getMonth()]+" "+appointmentMoreInfoStartDate.getDate()+" &#9679; "+appointmentMoreInfoStartDate.getHours()+":"+appointmentMoreInfoStartDate.getMinutes()+" - TBD";


  }else if(sameDate(appointmentMoreInfoEndDate, appointmentMoreInfoStartDate)){
    var dateTimeString = weekDayName[appointmentMoreInfoStartDate.getDay()]+", "+monthsName[appointmentMoreInfoStartDate.getMonth()]+" "+appointmentMoreInfoStartDate.getDate()+" &#9679; "+appointmentMoreInfoStartDate.getHours()+":"+appointmentMoreInfoStartDate.getMinutes()+" - "+appointmentMoreInfoEndDate.getHours()+":"+appointmentMoreInfoEndDate.getMinutes();
  }else if(!sameDate(appointmentMoreInfoEndDate, appointmentMoreInfoStartDate)){
    var dateTimeString = weekDayName[appointmentMoreInfoStartDate.getDay()]+", "+monthsName[appointmentMoreInfoStartDate.getMonth()]+" "+appointmentMoreInfoStartDate.getDate()+" &#9679; "+appointmentMoreInfoStartDate.getHours()+":"+appointmentMoreInfoStartDate.getMinutes()+" - "+weekDayName[appointmentMoreInfoStartDate.getDay()]+", "+monthsName[appointmentMoreInfoEndDate.getMonth()]+" "+appointmentMoreInfoEndDate.getDate()+" &#9679; "+appointmentMoreInfoEndDate.getHours()+":"+appointmentMoreInfoEndDate.getMinutes();
  }



  var eventMoreInfoMainDiv = document.createElement('div');
  eventMoreInfoMainDiv.classList.add("eventMoreInfoMainDiv");

  var cardContentString = "<p class='moreInfoDivTitle'>Your appointment</p><p class='moreInfoTitle'>"+appointmentMoreInfo.storeName+"</p><p class='moreInfoSubText'>"+"876 JL Lapierre"+"</p><p class='moreInfoSubText'>"+employeeName+"</p><p class='moreInfoRegularText'>"+dateTimeString+"</p>"+recurringString+"<p id='moreInfoTitleMoreMarginBottom'>Services</p><div class='serviceScrollMainDiv'>";

    var closeButtonP = document.createElement('p');
    closeButtonP.classList.add("moreInfoCloseButton");
    closeButtonP.innerText="x";




    for(var t=0;t<appointmentMoreInfo.services.length;t++){
        cardContentString+="<div class='servicesAroundDiv'>"+appointmentMoreInfo.services[t].serviceName+"</div>";
      }
    cardContentString+="</div>";

  eventMoreInfoMainDiv.innerHTML = cardContentString;
  eventMoreInfoMainDiv.appendChild(closeButtonP);
  document.body.appendChild(eventMoreInfoMainDiv);

  closeButtonP.onclick = function(){
      eventMoreInfoMainDiv.remove();
  }
}
