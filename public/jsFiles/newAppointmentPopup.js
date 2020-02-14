var newAppointmentInfos = {
    servicesName:[],
    servicesEmployee:[],
    servicesObj:[]
}

document.getElementById('newAppointmentButton').onclick = function(){

  var newAppointmentMainDivContainer = document.createElement('div');
  newAppointmentMainDivContainer.classList.add('openPopupDiv');
  newAppointmentMainDivContainer.id ="newAppointmentMainDivContainer";
  newAppointmentMainDivContainer.innerHTML = "<div class='topPopupHeaderDiv'><img onclick = 'closeAllOpenPopup()' class='downArrowClosePopup' src='assets/icons/octiconsSvg/chevron-down.svg'><p class='topPopupHeaderP'>"+translateWord('New Appointment')+"</p></div>";

  var newAppointmentNextButton = document.createElement('button');
  newAppointmentNextButton.innerText = translateWord('Next');
  newAppointmentNextButton.classList.add('newAppointmentNextButton');


var newAppointmentBottomNavigationBar = document.createElement('div');
newAppointmentBottomNavigationBar.id = 'newAppointmentBottomNavigationBar';


  var newAppointmentBackButton = document.createElement('button');
  newAppointmentBackButton.innerText = translateWord('Back');
  newAppointmentBackButton.classList.add('newAppointmentBackButton');
  newAppointmentBottomNavigationBar.appendChild(newAppointmentNextButton);
  newAppointmentBottomNavigationBar.appendChild(newAppointmentBackButton);
  newAppointmentMainDivContainer.appendChild(newAppointmentBottomNavigationBar);

  newAppointmentNextButton.onclick = function(){
    moveNext();
  }
  newAppointmentBackButton.onclick = function(){
    moveBack();
  }



















          var newAppointmentScrollableDivEmailPhoneName = document.createElement('div');
          newAppointmentScrollableDivEmailPhoneName.classList.add('newAppointmentScrollableDiv');
          newAppointmentScrollableDivEmailPhoneName.id = "newClientOrSearchClientDiv";

          var existingClientSearchInput = document.createElement('input');
          existingClientSearchInput.type = "text";
          existingClientSearchInput.placeholder = translateWord('Search client (name, email, phone)');
          existingClientSearchInput.classList.add('basicInput-quasiFullWidth');
          existingClientSearchInput.classList.add('textInputNewClient');

          var orSeparatorDiv = document.createElement('div');
          orSeparatorDiv.classList.add('orSeparatorDiv');


          var newGuestClientButton = document.createElement('button');
          newGuestClientButton.classList.add('newAppointmentCreateNewClient');
          newGuestClientButton.innerText = translateWord('Create new client');
          newGuestClientButton.onclick = function(){
            newAppointmentScrollableDivCreateClient.style.left = "0";
            newAppointmentScrollableDivEmailPhoneName.style.left = "-100%";
            choiceNewOrExistingClient = 0;
            moveNext();
          }

          newAppointmentScrollableDivEmailPhoneName.appendChild(existingClientSearchInput);
          newAppointmentScrollableDivEmailPhoneName.appendChild(orSeparatorDiv);
          newAppointmentScrollableDivEmailPhoneName.appendChild(newGuestClientButton);

existingClientSearchResultsIsDisplayed = false;

existingClientSearchInput.onfocus = function(){
if(!existingClientSearchResultsIsDisplayed){
  var cancelButton = document.createElement('button');
  cancelButton.classList.add('cancelbutton');
  cancelButton.innerText = translateWord('Cancel');
  newAppointmentScrollableDivEmailPhoneName.appendChild(cancelButton);

    var createExistingClientSearchContainerDiv = document.createElement('div');
    createExistingClientSearchContainerDiv.classList.add('scrollableListPopup');
    createExistingClientSearchContainerDiv.classList.add('scrollableNewClientResultMainDiv');
    existingClientSearchInput.classList.add('fullWidthTextInput');
    newAppointmentScrollableDivEmailPhoneName.appendChild(createExistingClientSearchContainerDiv);


existingClientSearchInput.onkeyup = function(){
      createExistingClientSearchContainerDiv.style.display = "block";
      createExistingClientSearchContainerDiv.innerText = "";
      var searchQuery = existingClientSearchInput.value;


      //search for users that already took appointments with the store
  if(typeof serverStoreObj.localGuestClients != 'undefined'){
        if(serverStoreObj.localGuestClients.length !=0){
              for(var i=0;i<serverStoreObj.localGuestClients.length;i++){
                    if(serverStoreObj.localGuestClients[i].fullName.toLowerCase().includes(searchQuery.toLowerCase())){
                          var clientEachResultDiv = document.createElement('div');
                          clientEachResultDiv.onclick = function(){
                              createDivOfFoundClient(serverStoreObj.localGuestClients[i]);
                          }
                          clientEachResultDiv.classList.add('innerClientResultDiv');
                          clientEachResultDiv.innerText = serverStoreObj.localGuestClients[i].fullName+" ("+serverStoreObj.localGuestClients[i].phoneNumber+")";
                          createExistingClientSearchContainerDiv.appendChild(clientEachResultDiv);
                    }else if(serverStoreObj.localGuestClients[i].phoneNumber.includes(searchQuery)){
                          var clientEachResultDiv = document.createElement('div');
                          clientEachResultDiv.onclick = function(){
                              createDivOfFoundClient(serverStoreObj.localGuestClients[i]);
                          }
                          clientEachResultDiv.classList.add('innerClientResultDiv');
                          clientEachResultDiv.innerText = serverStoreObj.localGuestClients[i].fullName+" ("+serverStoreObj.localGuestClients[i].phoneNumber+")";
                          createExistingClientSearchContainerDiv.appendChild(clientEachResultDiv);
                    }else if(serverStoreObj.localGuestClients[i].email.includes(searchQuery)){
                          var clientEachResultDiv = document.createElement('div');
                          clientEachResultDiv.onclick = function(){
                              createDivOfFoundClient(serverStoreObj.localGuestClients[i]);
                          }
                          clientEachResultDiv.classList.add('innerClientResultDiv');
                          clientEachResultDiv.innerText = serverStoreObj.localGuestClients[i].fullName+" ("+serverStoreObj.localGuestClients[i].phoneNumber+")";
                          createExistingClientSearchContainerDiv.appendChild(clientEachResultDiv);
                    }
              }
         }else{
              createExistingClientSearchContainerDiv.innerText = translateWord('You have no clients yet');
        }
  }else{
        createExistingClientSearchContainerDiv.innerText = translateWord('You have no clients left');
  }

  if(searchQuery !=""){
    $.ajax({
    url: '/searchAllRegisteredUsers',
    type: 'get',
    data:{searchQuery:existingClientSearchInput.value},
    success: function( data, textStatus){
    if(data == "error"){

    }else{
      console.log(data);
      for(var g=0;g<data.length;g++){
        var clientEachResultDiv = document.createElement('div');
        clientEachResultDiv.onclick = function(){
            createDivOfFoundClient(data[g]);
        }
        clientEachResultDiv.classList.add('innerClientResultDiv');
        clientEachResultDiv.innerText = data[g].clientName;
        if(data[g].PhoneNumber){
           clientEachResultDiv.innerText += '('+data[g].phoneNumber+')';
        }
        createExistingClientSearchContainerDiv.appendChild(clientEachResultDiv);
      }

    }
    },
    error: function( textStatus, errorThrown ){

    }
    });
  }

  //search for users that are registered




}



    existingClientSearchResultsIsDisplayed = true;
    cancelButton.onclick = function(){
      newAppointmentScrollableDivEmailPhoneName.id = "newClientOrSearchClientDiv";
      removeClientResultDiv();
    }
    createExistingClientSearchContainerDiv.style.left = 0;

    function removeClientResultDiv(){
      existingClientSearchInput.value = "";
      createExistingClientSearchContainerDiv.remove();
      existingClientSearchInput.classList.remove('fullWidthTextInput');
      existingClientSearchResultsIsDisplayed = false;
      cancelButton.remove();
    }

}


function createDivOfFoundClient(clientObj){
    newAppointmentScrollableDivEmailPhoneName.style.left = "-100%";

    newAppointmentScrollableDivClientProfile.style.left = "0";
    choiceNewOrExistingClient = 1;
    moveNext();
    setTimeout(function() { removeClientResultDiv(); }, 3000);
}
}







          var newAppointmentScrollableDivClientProfile = document.createElement('div');
          newAppointmentScrollableDivClientProfile.classList.add('newAppointmentScrollableDiv');
          var popupTitleClientProfile = document.createElement('p');
          popupTitleClientProfile.classList.add('popupTitle');
          popupTitleClientProfile.innerText = translateWord('Client profile');
          newAppointmentScrollableDivClientProfile.appendChild(popupTitleClientProfile);
          newAppointmentScrollableDivClientProfile.style.left = "100%";








          var newAppointmentScrollableDivCreateClient = document.createElement('div');
          newAppointmentScrollableDivCreateClient.classList.add('newAppointmentScrollableDiv');
          var popupTitleCreateClient = document.createElement('p');
          popupTitleCreateClient.classList.add('popupTitle');
          popupTitleCreateClient.innerText = translateWord('New client');
          newAppointmentScrollableDivCreateClient.appendChild(popupTitleCreateClient);
          newAppointmentScrollableDivCreateClient.style.left = "100%";









          var newAppointmentScrollableDivServiceSelector = document.createElement('div');
          newAppointmentScrollableDivServiceSelector.classList.add('newAppointmentScrollableDiv');

          var servicesPopupTitle = document.createElement('p');
          servicesPopupTitle.innerText = translateWord('Choose the requested services');
          servicesPopupTitle.classList.add('popupTitle');
          newAppointmentScrollableDivServiceSelector.appendChild(servicesPopupTitle);

          newAppointmentScrollableDivServiceSelector.style.left = "100%";

          var serviceContainerMainDiv = document.createElement('div');
          serviceContainerMainDiv.classList.add('serviceContainerMainDiv');

          if(typeof serverStoreObj.services != 'undefined'){
            if(serverStoreObj.services.length !=0){
              for(var i=0;i<serverStoreObj.services.length;i++)(function(i){
                var serviceMainDiv = document.createElement('div');
                serviceMainDiv.classList.add('servicesAroundDivNewAppointment');

                var serviceCheckboxLabel = document.createElement('label');
                serviceCheckboxLabel.classList.add('serviceCheckboxLabel');
                serviceCheckboxLabel.setAttribute('serviceId', i);

                var serviceCheckboxSpan = document.createElement('span');
                serviceCheckboxSpan.classList.add('serviceCheckboxSpan');
                serviceCheckboxSpan.innerText = serverStoreObj.services[i].serviceName;
                serviceCheckboxLabel.appendChild(serviceCheckboxSpan);

                var serviceCheckboxInput = document.createElement('input');
                serviceCheckboxInput.type = "checkbox";
                serviceCheckboxInput.classList.add('checkboxServiceSelector');
                serviceCheckboxLabel.appendChild(serviceCheckboxInput);

                serviceMainDiv.appendChild(serviceCheckboxLabel);

                serviceContainerMainDiv.appendChild(serviceMainDiv);
                newAppointmentScrollableDivServiceSelector.appendChild(serviceContainerMainDiv);
              })(i);
            }else{
              newAppointmentScrollableDivServiceSelector.innerText = translateWord('You have no services yet');
            }
          }else{
            newAppointmentScrollableDivServiceSelector.innerText = translateWord('You have no services yet');
          }









            var newAppointmentScrollableDivServiceEmployeeSelector = document.createElement('div');
            newAppointmentScrollableDivServiceEmployeeSelector.classList.add('newAppointmentScrollableDiv');
            newAppointmentScrollableDivServiceEmployeeSelector.style.left = "100%";



            var newAppointmentScrollableDivServiceDateTimeSelector = document.createElement('div');
            newAppointmentScrollableDivServiceDateTimeSelector.classList.add('newAppointmentScrollableDiv');
            newAppointmentScrollableDivServiceDateTimeSelector.style.left = "100%";


            var newAppointmentScrollableDivAddNote = document.createElement('div');
            newAppointmentScrollableDivAddNote.classList.add('newAppointmentScrollableDiv');
            var popupTitleAddNote = document.createElement('p');
            popupTitleAddNote.classList.add('popupTitle');
            popupTitleAddNote.innerText = translateWord('Add a note');
            newAppointmentScrollableDivAddNote.appendChild(popupTitleAddNote);

            var addNoteTextarea = document.createElement('textarea');
            addNoteTextarea.classList.add('newAppointmentTextarea');
            addNoteTextarea.placeholder = "Add a note, message or request";
            newAppointmentScrollableDivAddNote.appendChild(addNoteTextarea);
            newAppointmentScrollableDivAddNote.style.left = "100%";




          newAppointmentMainDivContainer.appendChild(newAppointmentScrollableDivCreateClient);
          newAppointmentMainDivContainer.appendChild(newAppointmentScrollableDivClientProfile);
          newAppointmentMainDivContainer.appendChild(newAppointmentScrollableDivEmailPhoneName);
          newAppointmentMainDivContainer.appendChild(newAppointmentScrollableDivServiceSelector);
          newAppointmentMainDivContainer.appendChild(newAppointmentScrollableDivServiceEmployeeSelector);
          newAppointmentMainDivContainer.appendChild(newAppointmentScrollableDivServiceDateTimeSelector);
          newAppointmentMainDivContainer.appendChild(newAppointmentScrollableDivAddNote);
          document.getElementById('mainScreenBody').appendChild(newAppointmentMainDivContainer);



          var currentDiv = 0;
          var choiceNewOrExistingClient = 0;

          function moveNext(){
            console.log(newAppointmentInfos);
            switch(currentDiv){
              case 0:
              document.getElementById("newAppointmentBottomNavigationBar").style.left = "0";
              document.getElementById("newAppointmentBottomNavigationBar").style.display = "block";
              currentDiv++;
              break;
              case 1:
              newAppointmentScrollableDivServiceSelector.style.left = "0";

              if(choiceNewOrExistingClient == 1){
                newAppointmentScrollableDivClientProfile.style.left = "-100%";
              }else{
                newAppointmentScrollableDivCreateClient.style.left = "-100%";
              }

              currentDiv++;
              break;

              case 2:

              var serviceCheckboxLabelClass = document.getElementsByClassName('serviceCheckboxLabel');
              newAppointmentInfos.servicesName.length = 0;
              for(var n=0;n<serviceCheckboxLabelClass.length;n++){
                if(serviceCheckboxLabelClass[n].getElementsByTagName('input')[0].checked){
                  newAppointmentInfos.servicesName.push(serviceCheckboxLabelClass[n].innerText);
                  var theFullStoreObjService = JSON.stringify(serverStoreObj.services);
                  newAppointmentInfos.servicesObj.push(theFullStoreObjService[serviceCheckboxLabelClass[n].getAttribute('serviceId')]);
                }
              }




              newAppointmentInfos.servicesEmployee.name = "yo";
              newAppointmentInfos.servicesEmployee.id = 'null';

              currentDiv++;
              moveNext();
              break;



              if(newAppointmentInfos.servicesName.length>0){

                                newAppointmentInfos.servicesEmployee.length=0;
                                newAppointmentInfos.servicesEmployee.name = "null";
                                newAppointmentInfos.servicesEmployee.id='null';
                                            newAppointmentScrollableDivServiceSelector.style.left = "-100%";
                                            newAppointmentScrollableDivServiceEmployeeSelector.innerHTML = "";

                              if(serverStoreObj.clientCanPickEmployee == true && serverStoreObj.employees.length>0){



                                            var servicesEmployeePopupTitle = document.createElement('p');
                                            servicesEmployeePopupTitle.innerText = translateWord('Choose who will attend the client');
                                            servicesEmployeePopupTitle.classList.add('popupTitle');
                                            newAppointmentScrollableDivServiceEmployeeSelector.appendChild(servicesEmployeePopupTitle);






                                                            newAppointmentScrollableDivServiceEmployeeSelector.style.left = "0";






                                                            var mainParentEmployeePickerDiv = document.createElement('div');
                                                            mainParentEmployeePickerDiv.classList.add('mainParentEmployeePickerDiv');



                                                            var noEmployeeDivAroundLabel = document.createElement('div');
                                                            noEmployeeDivAroundLabel.classList.add('servicesEmployeeAroundDivNewAppointment');



                                                            var noEmployeeServiceCheckboxLabel = document.createElement('label');
                                                            noEmployeeServiceCheckboxLabel.classList.add('employeeServiceCheckboxLabel');
                                                            noEmployeeServiceCheckboxLabel.setAttribute('employeeId', 'null');
                                                            noEmployeeServiceCheckboxLabel.setAttribute('employeeValue','null');

                                                            var noEmployeeServiceCheckboxSpan = document.createElement('span');
                                                            noEmployeeServiceCheckboxSpan.classList.add('employeeServiceCheckboxSpan');
                                                            noEmployeeServiceCheckboxSpan.innerText = translateWord('No preference');
                                                            noEmployeeServiceCheckboxLabel.appendChild(noEmployeeServiceCheckboxSpan);

                                                            var noEmployeeServiceCheckboxInput = document.createElement('input');
                                                            noEmployeeServiceCheckboxInput.type = "radio";
                                                            noEmployeeServiceCheckboxInput.name = "serviceEmployeeRadio";
                                                            noEmployeeServiceCheckboxInput.checked = true;
                                                            noEmployeeServiceCheckboxInput.classList.add('checkboxServiceEmployeeSelector');
                                                            noEmployeeServiceCheckboxLabel.appendChild(noEmployeeServiceCheckboxInput);

                                                            noEmployeeDivAroundLabel.appendChild(noEmployeeServiceCheckboxLabel);
                                                            mainParentEmployeePickerDiv.appendChild(noEmployeeDivAroundLabel);








                                                              for(var w=0;w<serverStoreObj.employees.length;w++)(function(w){
                                                                for(var k=0;k<serverStoreObj.employees[w].servicesOffered.length;k++)(function(k){
                                                                  var numberOfRequestedServicesEmployeeCanDo = 0;
                                                                  for(var e=0;e<newAppointmentInfos.servicesName.length;e++)(function(e){
                                                                    if(serverStoreObj.employees[w].servicesOffered[k]._id == newAppointmentInfos.servicesObj[e].id){
                                                                      numberOfRequestedServicesEmployeeCanDo++;
                                                                    }
                                                                  })(e);

                                                                  if(numberOfRequestedServicesEmployeeCanDo == newAppointmentInfos.servicesName.length){

                                                                    var employeeDivAroundLabel = document.createElement('div');
                                                                    employeeDivAroundLabel.classList.add('servicesEmployeeAroundDivNewAppointment');

                                                                    var employeeServiceCheckboxLabel = document.createElement('label');
                                                                    employeeServiceCheckboxLabel.setAttribute('employeeId', serverStoreObj.employees[w]._id);
                                                                    employeeServiceCheckboxLabel.setAttribute('employeeValue',serverStoreObj.employees[w].employeeName.toLowerCase());
                                                                    employeeServiceCheckboxLabel.classList.add('employeeServiceCheckboxLabel');

                                                                    var employeeServiceCheckboxSpan = document.createElement('span');
                                                                    employeeServiceCheckboxSpan.classList.add('employeeServiceCheckboxSpan');
                                                                    employeeServiceCheckboxSpan.innerText = serverStoreObj.employees[w].employeeName;
                                                                    employeeServiceCheckboxLabel.appendChild(employeeServiceCheckboxSpan);

                                                                    var employeeServiceCheckboxInput = document.createElement('input');
                                                                    employeeServiceCheckboxInput.type = "radio";
                                                                    employeeServiceCheckboxInput.name = "serviceEmployeeRadio";
                                                                    employeeServiceCheckboxInput.classList.add('checkboxServiceEmployeeSelector');
                                                                    employeeServiceCheckboxLabel.appendChild(employeeServiceCheckboxInput);

                                                                    employeeDivAroundLabel.appendChild(employeeServiceCheckboxLabel);
                                                                    mainParentEmployeePickerDiv.appendChild(employeeDivAroundLabel);
                                                                  }

                                                                })(k);
                                                                    newAppointmentScrollableDivServiceEmployeeSelector.appendChild(mainParentEmployeePickerDiv);
                                                                })(w);





                                            }else{

                                                currentDiv++;
                                                moveNext();
                                                return;
                                            }
                            currentDiv++;
                            break;
              }else{
                break;
              }



              break;
                case 3:

  var totalAppointmentDuration = 0;
  for(var e=0;e<newAppointmentInfos.servicesObj.length;e++){
    totalAppointmentDuration += newAppointmentInfos.servicesObj[e].duration;
  }
  var appointmentDurationInMilliseconds = decimalHourToMilliseconds(totalAppointmentDuration);
        var serviceEmployeeCheckboxLabelClass = document.getElementsByClassName('employeeServiceCheckboxLabel');


        // for(var n=0;n<serviceEmployeeCheckboxLabelClass.length;n++){
        //   var radioEmployeeSelect = serviceEmployeeCheckboxLabelClass[n].getElementsByClassName('checkboxServiceEmployeeSelector')[0];
        //     if(radioEmployeeSelect.checked){
        //     newAppointmentInfos.servicesEmployee.id = serviceEmployeeCheckboxLabelClass[n].getAttribute('employeeId');
        //     newAppointmentInfos.servicesEmployee.name = serviceEmployeeCheckboxLabelClass[n].getAttribute('employeeValue');
        //
        //     }
        // }



            if(newAppointmentInfos.servicesName.length>0 && newAppointmentInfos.servicesEmployee.name && newAppointmentInfos.servicesEmployee.id){

            newAppointmentInfos.servicesStartDate = null;
            newAppointmentInfos.servicesEndDate = null;

            var allServicesEmployeeNoPreference = true;
            // for(var g=0;g<newAppointmentInfos.servicesEmployee.length;g++){
            //   if(newAppointmentInfos.servicesEmployee.id != "null"){
            //     allServicesEmployeeNoPreference = false;
            //   }
            // }


            //ajax to get events from store that are later or today (rangeDesired  = 1)
            $.ajax({
            url: '/getAllStoreFutureEvents',
            type: 'get',
            success: function( data, textStatus){

                        if(data == "error"){

                        }else{


                                      newAppointmentScrollableDivServiceDateTimeSelector.innerHTML = "";
                                          var serviceString = "";
                                          for(var m=0;m<newAppointmentInfos.servicesName.length;m++){

                                          serviceString = serviceString + newAppointmentInfos.servicesName[m];
                                          if(m !=newAppointmentInfos.servicesName.length -1){
                                          serviceString+= ", ";
                                          }
                                          }


                                          var servicesDateTimePopupTitle = document.createElement('p');
                                          servicesDateTimePopupTitle.innerText = translateWord('Choose the appointment date & time');
                                          servicesDateTimePopupTitle.classList.add('popupTitle');
                                          newAppointmentScrollableDivServiceDateTimeSelector.appendChild(servicesDateTimePopupTitle);

                                          var serviceNamePDateTimeSelector = document.createElement('p');
                                          serviceNamePDateTimeSelector.classList.add('serviceNamePDateTimeSelector');
                                          serviceNamePDateTimeSelector.innerText = serviceString;
                                          newAppointmentScrollableDivServiceDateTimeSelector.appendChild(serviceNamePDateTimeSelector);

                                          var dateTimeSelectorDiv = document.createElement('div');
                                          dateTimeSelectorDiv.classList.add("dateTimeSelectorDivnewAppointmentInfos");
                                          newAppointmentScrollableDivServiceDateTimeSelector.appendChild(dateTimeSelectorDiv);

                                          var mainContainerAroundAllTimeChoices = document.createElement('div');
                                          mainContainerAroundAllTimeChoices.classList.add('servicesTimePickerContainerNewAppointmentAroundChoices');

                                          var selectDateP = document.createElement('p');
                                          selectDateP.classList.add('selectDatePInside');
                                          selectDateP.innerText = translateWord('Today');
                                          dateTimeSelectorDiv.appendChild(selectDateP);
                                          selectDateP.onclick = function(){
                                                    createTheCalendarPopup(setDateSelectorP);
                                                    function setDateSelectorP(theDateFromFunction){
                                                          var splittedDateArray = theDateFromFunction.split('/');
                                                          var dateObjFromFunction = new Date(splittedDateArray[0]+"-"+(parseInt(splittedDateArray[1]))+"-"+(parseInt(splittedDateArray[2])));

                                                          renderAvailableTimesForSpecificDate(dateObjFromFunction, appointmentDurationInMilliseconds);
                                                          closeAllTransparentOverlays();
                                                          selectDateP.innerText = weekDayName[dateObjFromFunction.getDay()]+", "+monthsName[dateObjFromFunction.getMonth()]+" "+dateObjFromFunction.getDate()+", "+dateObjFromFunction.getFullYear();
                                                    }
                                          };
                                                      renderAvailableTimesForSpecificDate(new Date(), appointmentDurationInMilliseconds);
                                                      function renderAvailableTimesForSpecificDate(requestedDate, appointmentDurationInMilliseconds){
                                                                              mainContainerAroundAllTimeChoices.innerHTML= "";
                                                                              var todayDate = requestedDate;
                                                                              var dayOfWeek = todayDate.getDay();
                                                                              var dayStartTime = 0;
                                                                              var dayEndTime = 0;
                                                                              for(var i=0;i<serverStoreObj.storeSchedule.length;i++){
                                                                                      if(dayOfWeek == serverStoreObj.storeSchedule[i].weekDay){
                                                                                        dayStartTime = serverStoreObj.storeSchedule[i].startTime;
                                                                                        dayEndTime = serverStoreObj.storeSchedule[i].endTime;
                                                                                                  if(dayStartTime == 0 && dayEndTime == 0){
                                                                                                          //store is closed on that day
                                                                                                          var timeDisplayChoiceContainerDiv = document.createElement('div');
                                                                                                          timeDisplayChoiceContainerDiv.classList.add('servicesTimePickerContainerNewAppointment');

                                                                                                          var timePickerCheckboxLabel = document.createElement('label');
                                                                                                          timePickerCheckboxLabel.classList.add('servicesTimePickerCheckboxLabel');
                                                                                                          timePickerCheckboxLabel.innerText = translateWord('Store is closed');

                                                                                                          timeDisplayChoiceContainerDiv.appendChild(timePickerCheckboxLabel);

                                                                                                          mainContainerAroundAllTimeChoices.appendChild(timeDisplayChoiceContainerDiv);

                                                                                                  }else{
                                                                                                    if(data.length == 0){

                                                                                                            if(allServicesEmployeeNoPreference == true){

                                                                                                                      var startTime = decimalHourToMilliseconds(dayStartTime);
                                                                                                                      var endTime = decimalHourToMilliseconds(dayEndTime) - appointmentDurationInMilliseconds;
                                                                                                                      if(startTime < endTime){
                                                                                                                        for(var currentTimeDisplay=startTime;currentTimeDisplay<=endTime; currentTimeDisplay+= 300000){
                                                                                                                                  var endTimeDisplay = currentTimeDisplay + appointmentDurationInMilliseconds;

                                                                                                                                  var timeDisplayChoiceContainerDiv = document.createElement('div');
                                                                                                                                  timeDisplayChoiceContainerDiv.classList.add('servicesTimePickerContainerNewAppointment');

                                                                                                                                  var timePickerCheckboxLabel = document.createElement('label');
                                                                                                                                  timePickerCheckboxLabel.classList.add('servicesTimePickerCheckboxLabel');

                                                                                                                                  var timePickerCheckboxSpan = document.createElement('span');
                                                                                                                                  timePickerCheckboxSpan.classList.add('servicesTimePickerCheckboxSpan');
                                                                                                                                  timePickerCheckboxSpan.innerText = millisecondsToTime(currentTimeDisplay)+" - "+millisecondsToTime(endTimeDisplay);

                                                                                                                                  var timePickerCheckboxInput = document.createElement('input');
                                                                                                                                  timePickerCheckboxInput.type = "radio";
                                                                                                                                  timePickerCheckboxInput.name = "serviceTimeRadioPicker";
                                                                                                                                  timePickerCheckboxInput.classList.add('servicesTimePickerCheckboxSelector');

                                                                                                                                  timePickerCheckboxLabel.appendChild(timePickerCheckboxInput);
                                                                                                                                  timePickerCheckboxLabel.appendChild(timePickerCheckboxSpan);
                                                                                                                                  timeDisplayChoiceContainerDiv.appendChild(timePickerCheckboxLabel);

                                                                                                                                  mainContainerAroundAllTimeChoices.appendChild(timeDisplayChoiceContainerDiv);
                                                                                                                        }
                                                                                                                      }
                                                                                                            }else{
                                                                                                              //yess employee preference
                                                                                                              var startTimesArray = [];

                                                                                                              for(var t=0;t<serverStoreObj.employees.length;t++){
                                                                                                                if(serverStoreObj.employees[t]._id == newAppointmentInfos.servicesEmployee.id){
                                                                                                                  for(var w=0;w<serverStoreObj.employees[t].schedule.length;w++){
                                                                                                                    if(dayOfWeek == serverStoreObj.employees[t].schedule[w].weekDay){
                                                                                                                      var startTime = decimalHourToMilliseconds(serverStoreObj.employees[t].schedule[w].startTime);
                                                                                                                      var endTime = decimalHourToMilliseconds(serverStoreObj.employees[t].schedule[w].endTime) - appointmentDurationInMilliseconds;
                                                                                                                      console.log(startTime+" - "+endTime);
                                                                                                                      if(startTime < endTime){
                                                                                                                        for(var currentTimeDisplay=startTime;currentTimeDisplay<=endTime; currentTimeDisplay+= 300000){
                                                                                                                          startTimesArray.push(currentTimeDisplay);
                                                                                                                        }
                                                                                                                      }
                                                                                                                    }
                                                                                                                  }
                                                                                                                }
                                                                                                              }

                                                                                                              startTimesArray.sort(function(a, b){return a-b});

                                                                                                              for(var s=0;s<startTimesArray.length;s++){
                                                                                                                var endTimeDisplay = startTimesArray[s] + appointmentDurationInMilliseconds;
                                                                                                                var timeDisplayChoiceContainerDiv = document.createElement('div');
                                                                                                                timeDisplayChoiceContainerDiv.classList.add('servicesTimePickerContainerNewAppointment');

                                                                                                                var timePickerCheckboxLabel = document.createElement('label');
                                                                                                                timePickerCheckboxLabel.classList.add('servicesTimePickerCheckboxLabel');

                                                                                                                var timePickerCheckboxSpan = document.createElement('span');
                                                                                                                timePickerCheckboxSpan.classList.add('servicesTimePickerCheckboxSpan');
                                                                                                                timePickerCheckboxSpan.innerText = millisecondsToTime(startTimesArray[s])+" - "+millisecondsToTime(endTimeDisplay);

                                                                                                                var timePickerCheckboxInput = document.createElement('input');
                                                                                                                timePickerCheckboxInput.type = "radio";
                                                                                                                timePickerCheckboxInput.name = "serviceTimeRadioPicker";
                                                                                                                timePickerCheckboxInput.classList.add('servicesTimePickerCheckboxSelector');

                                                                                                                timePickerCheckboxLabel.appendChild(timePickerCheckboxInput);
                                                                                                                timePickerCheckboxLabel.appendChild(timePickerCheckboxSpan);
                                                                                                                timeDisplayChoiceContainerDiv.appendChild(timePickerCheckboxLabel);

                                                                                                                mainContainerAroundAllTimeChoices.appendChild(timeDisplayChoiceContainerDiv);
                                                                                                              }
                                                                                                            }
                                                                                                    }else{

                                                                                                      //there is some data
                                                                                                      if(allServicesEmployeeNoPreference == true){
                                                                                                        var availableIntervalStart = [decimalHourToMilliseconds(dayStartTime)];
                                                                                                        var availableIntervalEnd = [decimalHourToMilliseconds(dayEndTime)];
                                                                                                        for(var ws=0;ws<data.length;ws++){
                                                                                                          var eventStartTime = new Date(data[ws].backendDateObjStart);
                                                                                                          var eventEndTime = new Date(data[ws].backendDateObjEnd);

                                                                                                          var eventStartTimeInMilliseconds = hoursMinutesToMilliseconds(eventStartTime.getHours(), eventStartTime.getMinutes());
                                                                                                          var eventEndTimeInMilliseconds = hoursMinutesToMilliseconds(eventEndTime.getHours(), eventEndTime.getMinutes());
                                                                                                          console.log("event from "+millisecondsToTime(eventStartTimeInMilliseconds)+" - "+millisecondsToTime(eventEndTimeInMilliseconds));
                                                                                                          if(eventEndTime == 0 && sameDate(todayDate, eventStartTime)){
                                                                                                            //no real ending

                                                                                                          }else if(sameDate(todayDate, eventStartTime) && sameDate(eventStartTime, todayDate)){
                                                                                                            //one day event
                                                                                                            for(var tf=0;tf<availableIntervalStart.length;tf++){
                                                                                                              var availaStart = availableIntervalStart[tf];
                                                                                                              var availaEnd = availableIntervalEnd[tf];
                                                                                                              if(eventStartTimeInMilliseconds<=availaStart && eventEndTimeInMilliseconds>= availaEnd){
                                                                                                                //event is bigger on both sides or equal to available period, so delete
                                                                                                                availableIntervalStart.splice(tf,1);
                                                                                                                availableIntervalEnd.splice(tf,1);
                                                                                                              }else if(eventStartTimeInMilliseconds<=availaStart && eventEndTimeInMilliseconds<availaEnd && eventEndTimeInMilliseconds>availaStart){
                                                                                                                //event is at beginning of interval
                                                                                                                availableIntervalStart[tf] = eventEndTimeInMilliseconds;

                                                                                                              }else if(eventStartTimeInMilliseconds>availaStart && eventEndTimeInMilliseconds>=availaEnd && eventStartTimeInMilliseconds<availaEnd){
                                                                                                                //event is at end of interval
                                                                                                                availableIntervalEnd[tf] = eventStartTimeInMilliseconds;

                                                                                                              }else if(eventStartTimeInMilliseconds>availaStart && eventEndTimeInMilliseconds<availaEnd){
                                                                                                                // event is inside available period
                                                                                                                availableIntervalStart.push(eventEndTimeInMilliseconds);
                                                                                                                availableIntervalEnd.push(availaEnd);
                                                                                                                availableIntervalEnd[tf] = eventStartTimeInMilliseconds;
                                                                                                              }
                                                                                                            }

                                                                                                          }else if(dateIsInsideRange(todayDate, eventStartTime, eventEndTime)){
                                                                                                            //multi days event
                                                                                                          }
                                                                                                          if(availableIntervalStart.length==0){
                                                                                                            //no available slot times that days
                                                                                                            var timeDisplayChoiceContainerDiv = document.createElement('div');
                                                                                                            timeDisplayChoiceContainerDiv.classList.add('servicesTimePickerContainerNewAppointment');

                                                                                                            var timePickerCheckboxLabel = document.createElement('label');
                                                                                                            timePickerCheckboxLabel.classList.add('servicesTimePickerCheckboxLabel');

                                                                                                            var timePickerCheckboxSpan = document.createElement('span');
                                                                                                            timePickerCheckboxSpan.classList.add('servicesTimePickerCheckboxSpan');
                                                                                                            timePickerCheckboxSpan.innerText = translateWord('No available times for that day');

                                                                                                            var timePickerCheckboxInput = document.createElement('input');
                                                                                                            timePickerCheckboxInput.type = "radio";
                                                                                                            timePickerCheckboxInput.name = "serviceTimeRadioPicker";
                                                                                                            timePickerCheckboxInput.classList.add('servicesTimePickerCheckboxSelector');

                                                                                                            timePickerCheckboxLabel.appendChild(timePickerCheckboxInput);
                                                                                                            timePickerCheckboxLabel.appendChild(timePickerCheckboxSpan);
                                                                                                            timeDisplayChoiceContainerDiv.appendChild(timePickerCheckboxLabel);

                                                                                                            mainContainerAroundAllTimeChoices.appendChild(timeDisplayChoiceContainerDiv);
                                                                                                          }else{
                                                                                                            for(var te=0;te<availableIntervalStart.length;te++){
                                                                                                              var startTime = availableIntervalStart[te];
                                                                                                              var endTime = availableIntervalEnd[te] - appointmentDurationInMilliseconds;
                                                                                                              for(var currentTimeDisplay=startTime;currentTimeDisplay<=endTime; currentTimeDisplay+= 300000){
                                                                                                                        var endTimeDisplay = currentTimeDisplay + appointmentDurationInMilliseconds;

                                                                                                                        var timeDisplayChoiceContainerDiv = document.createElement('div');
                                                                                                                        timeDisplayChoiceContainerDiv.classList.add('servicesTimePickerContainerNewAppointment');

                                                                                                                        var timePickerCheckboxLabel = document.createElement('label');
                                                                                                                        timePickerCheckboxLabel.classList.add('servicesTimePickerCheckboxLabel');

                                                                                                                        var timePickerCheckboxSpan = document.createElement('span');
                                                                                                                        timePickerCheckboxSpan.classList.add('servicesTimePickerCheckboxSpan');
                                                                                                                        timePickerCheckboxSpan.innerText = millisecondsToTime(currentTimeDisplay)+" - "+millisecondsToTime(endTimeDisplay);

                                                                                                                        var timePickerCheckboxInput = document.createElement('input');
                                                                                                                        timePickerCheckboxInput.type = "radio";
                                                                                                                        timePickerCheckboxInput.name = "serviceTimeRadioPicker";
                                                                                                                        timePickerCheckboxInput.classList.add('servicesTimePickerCheckboxSelector');

                                                                                                                        timePickerCheckboxLabel.appendChild(timePickerCheckboxInput);
                                                                                                                        timePickerCheckboxLabel.appendChild(timePickerCheckboxSpan);
                                                                                                                        timeDisplayChoiceContainerDiv.appendChild(timePickerCheckboxLabel);

                                                                                                                        mainContainerAroundAllTimeChoices.appendChild(timeDisplayChoiceContainerDiv);
                                                                                                              }
                                                                                                            }
                                                                                                          }

                                                                                                        }
                                                                                                      }else{
                                                                                                        //there is an employee choice
                                                                                                        console.log('employee chosen');
                                                                                                        var availableIntervalStart = [];
                                                                                                        var availableIntervalEnd = [];

                                                                                                        var atLeastOneAvailabilityFound = false;

                                                                                                        for(var t=0;t<serverStoreObj.employees.length;t++){
                                                                                                          if( serverStoreObj.employees[t]._id == newAppointmentInfos.servicesEmployee.id){
                                                                                                            for(var w=0;w<serverStoreObj.employees[t].schedule.length;w++){
                                                                                                              if(dayOfWeek == serverStoreObj.employees[t].schedule[w].weekDay){
                                                                                                                console.log();
                                                                                                                if(serverStoreObj.employees[t].schedule[w].startTime < serverStoreObj.employees[t].schedule[w].endTime){
                                                                                                                  availableIntervalStart.push(decimalHourToMilliseconds(serverStoreObj.employees[t].schedule[w].startTime));
                                                                                                                  availableIntervalEnd.push(decimalHourToMilliseconds(serverStoreObj.employees[t].schedule[w].endTime));
                                                                                                                  atLeastOneAvailabilityFound = true;
                                                                                                                }
                                                                                                              }
                                                                                                            }
                                                                                                          }
                                                                                                        }


                                                                                                        if(atLeastOneAvailabilityFound){

                                                                                                          for(var ws=0;ws<data.length;ws++){

                                                                                                            if(data[ws].employeeId == newAppointmentInfos.servicesEmployee.id){
                                                                                                              var eventStartTime = new Date(data[ws].backendDateObjStart);
                                                                                                              var eventEndTime = new Date(data[ws].backendDateObjEnd);

                                                                                                              var eventStartTimeInMilliseconds = hoursMinutesToMilliseconds(eventStartTime.getHours(), eventStartTime.getMinutes());
                                                                                                              var eventEndTimeInMilliseconds = hoursMinutesToMilliseconds(eventEndTime.getHours(), eventEndTime.getMinutes());
                                                                                                              if(eventEndTime == 0 && sameDate(todayDate, eventStartTime)){
                                                                                                                //no real ending

                                                                                                              }else if(sameDate(todayDate, eventStartTime) && sameDate(eventStartTime, todayDate)){
                                                                                                                //one day event
                                                                                                                for(var tf=0;tf<availableIntervalStart.length;tf++){
                                                                                                                  var availaStart = availableIntervalStart[tf];
                                                                                                                  var availaEnd = availableIntervalEnd[tf];
                                                                                                                  if(eventStartTimeInMilliseconds<=availaStart && eventEndTimeInMilliseconds>= availaEnd){
                                                                                                                    //event is bigger on both sides or equal to available period, so delete
                                                                                                                    availableIntervalStart.splice(tf,1);
                                                                                                                    availableIntervalEnd.splice(tf,1);
                                                                                                                  }else if(eventStartTimeInMilliseconds<=availaStart && eventEndTimeInMilliseconds<availaEnd && eventEndTimeInMilliseconds>availaStart){
                                                                                                                    //event is at beginning of interval
                                                                                                                    availableIntervalStart[tf] = eventEndTimeInMilliseconds;

                                                                                                                  }else if(eventStartTimeInMilliseconds>availaStart && eventEndTimeInMilliseconds>=availaEnd && eventStartTimeInMilliseconds<availaEnd){
                                                                                                                    //event is at end of interval
                                                                                                                    availableIntervalEnd[tf] = eventStartTimeInMilliseconds;

                                                                                                                  }else if(eventStartTimeInMilliseconds>availaStart && eventEndTimeInMilliseconds<availaEnd){
                                                                                                                    // event is inside available period
                                                                                                                    availableIntervalStart.push(eventEndTimeInMilliseconds);
                                                                                                                    availableIntervalEnd.push(availaEnd);
                                                                                                                    availableIntervalEnd[tf] = eventStartTimeInMilliseconds;
                                                                                                                  }
                                                                                                                }

                                                                                                              }else if(dateIsInsideRange(todayDate, eventStartTime, eventEndTime)){
                                                                                                                //multi days event
                                                                                                              }
                                                                                                            }


                                                                                                            if(availableIntervalStart.length==0){
                                                                                                              //no available slot times that days
                                                                                                              var timeDisplayChoiceContainerDiv = document.createElement('div');
                                                                                                              timeDisplayChoiceContainerDiv.classList.add('servicesTimePickerContainerNewAppointment');

                                                                                                              var timePickerCheckboxLabel = document.createElement('label');
                                                                                                              timePickerCheckboxLabel.classList.add('servicesTimePickerCheckboxLabel');

                                                                                                              var timePickerCheckboxSpan = document.createElement('span');
                                                                                                              timePickerCheckboxSpan.classList.add('servicesTimePickerCheckboxSpan');
                                                                                                              timePickerCheckboxSpan.innerText = translateWord('No available times for that day');

                                                                                                              var timePickerCheckboxInput = document.createElement('input');
                                                                                                              timePickerCheckboxInput.type = "radio";
                                                                                                              timePickerCheckboxInput.name = "serviceTimeRadioPicker";
                                                                                                              timePickerCheckboxInput.classList.add('servicesTimePickerCheckboxSelector');

                                                                                                              timePickerCheckboxLabel.appendChild(timePickerCheckboxInput);
                                                                                                              timePickerCheckboxLabel.appendChild(timePickerCheckboxSpan);
                                                                                                              timeDisplayChoiceContainerDiv.appendChild(timePickerCheckboxLabel);

                                                                                                              mainContainerAroundAllTimeChoices.appendChild(timeDisplayChoiceContainerDiv);
                                                                                                            }else{
                                                                                                              for(var te=0;te<availableIntervalStart.length;te++){
                                                                                                                var startTime = availableIntervalStart[te];
                                                                                                                var endTime = availableIntervalEnd[te] - appointmentDurationInMilliseconds;
                                                                                                                for(var currentTimeDisplay=startTime;currentTimeDisplay<=endTime; currentTimeDisplay+= 300000){
                                                                                                                          var endTimeDisplay = currentTimeDisplay + appointmentDurationInMilliseconds;

                                                                                                                          var timeDisplayChoiceContainerDiv = document.createElement('div');
                                                                                                                          timeDisplayChoiceContainerDiv.classList.add('servicesTimePickerContainerNewAppointment');

                                                                                                                          var timePickerCheckboxLabel = document.createElement('label');
                                                                                                                          timePickerCheckboxLabel.classList.add('servicesTimePickerCheckboxLabel');

                                                                                                                          var timePickerCheckboxSpan = document.createElement('span');
                                                                                                                          timePickerCheckboxSpan.classList.add('servicesTimePickerCheckboxSpan');
                                                                                                                          timePickerCheckboxSpan.innerText = millisecondsToTime(currentTimeDisplay)+" - "+millisecondsToTime(endTimeDisplay);

                                                                                                                          var timePickerCheckboxInput = document.createElement('input');
                                                                                                                          timePickerCheckboxInput.type = "radio";
                                                                                                                          timePickerCheckboxInput.name = "serviceTimeRadioPicker";
                                                                                                                          timePickerCheckboxInput.classList.add('servicesTimePickerCheckboxSelector');

                                                                                                                          timePickerCheckboxLabel.appendChild(timePickerCheckboxInput);
                                                                                                                          timePickerCheckboxLabel.appendChild(timePickerCheckboxSpan);
                                                                                                                          timeDisplayChoiceContainerDiv.appendChild(timePickerCheckboxLabel);

                                                                                                                          mainContainerAroundAllTimeChoices.appendChild(timeDisplayChoiceContainerDiv);
                                                                                                                }
                                                                                                              }
                                                                                                            }

                                                                                                          }
                                                                                                        }else{
                                                                                                          var timeDisplayChoiceContainerDiv = document.createElement('div');
                                                                                                          timeDisplayChoiceContainerDiv.classList.add('servicesTimePickerContainerNewAppointment');

                                                                                                          var timePickerCheckboxLabel = document.createElement('label');
                                                                                                          timePickerCheckboxLabel.classList.add('servicesTimePickerCheckboxLabel');

                                                                                                          var timePickerCheckboxSpan = document.createElement('span');
                                                                                                          timePickerCheckboxSpan.classList.add('servicesTimePickerCheckboxSpan');
                                                                                                          timePickerCheckboxSpan.innerText = translateWord('No available times for this employee today');

                                                                                                          timePickerCheckboxLabel.appendChild(timePickerCheckboxSpan);
                                                                                                          timeDisplayChoiceContainerDiv.appendChild(timePickerCheckboxLabel);

                                                                                                          mainContainerAroundAllTimeChoices.appendChild(timeDisplayChoiceContainerDiv);
                                                                                                        }

                                                                                                      }
                                                                                                    }
                                                                                                  }
                                                                                      }

                                                                              }
                                                      }

                                                      newAppointmentScrollableDivServiceDateTimeSelector.appendChild(mainContainerAroundAllTimeChoices);
                                                      newAppointmentScrollableDivServiceEmployeeSelector.style.left = "-100%";
                                                      newAppointmentScrollableDivServiceDateTimeSelector.style.left = "0";
                                                      currentDiv++;

                        }
            },


            error: function( textStatus, errorThrown ){

            }
            });
            }




                break;
                case 4:
                var dateTimeIsSelected = false;
                for(var y=0;y<document.getElementsByClassName('servicesTimePickerCheckboxSelector').length;y++){
                  if(document.getElementsByClassName('servicesTimePickerCheckboxSelector')[y].checked == true ){
                    dateTimeIsSelected = true;
                    console.log('yes selected');
                    break;
                  }
                }
                if(!dateTimeIsSelected){
                  console.log('nothing is salaected');

                }else{

                  newAppointmentScrollableDivAddNote.style.left ="0";
                  newAppointmentScrollableDivServiceDateTimeSelector.style.left = "-100%";
                }




                break;
            }
          }




          function moveBack(){
            console.log('back'+currentDiv);
            switch(currentDiv){
              case 1:
              // newAppointmentScrollableDivEmailPhoneName.id = "newClientOrSearchClientDiv";
                // newAppointmentScrollableDivEmailPhoneName.getElementsByClassName('clientProfileNewAppointmentContainer')[0].remove();
                // document.getElementsByClassName('newAppointmentBackButton')[0].style.display = "none";
                // document.getElementsByClassName('newAppointmentNextButton')[0].style.display = "none";

                newAppointmentScrollableDivEmailPhoneName.style.left = "0";
                document.getElementById("newAppointmentBottomNavigationBar").style.left = "100%";
                document.getElementById("newAppointmentBottomNavigationBar").style.display = "none";
                currentDiv--;
              break;
              case 2:
              unselectAllServicesDiv();
                newAppointmentScrollableDivServiceSelector.style.left = "100%";
                  if(choiceNewOrExistingClient == 1){
                    newAppointmentScrollableDivClientProfile.style.left = "0";
                  }else{
                    newAppointmentScrollableDivCreateClient.style.left = "0";
                  }
              currentDiv--;
              break;
              case 3:
              newAppointmentInfos.servicesName = [];
              newAppointmentInfos.servicesObj = [];
              unselectAllServicesEmployeeDiv();
                newAppointmentScrollableDivServiceEmployeeSelector.style.left = "100%";
                newAppointmentScrollableDivServiceSelector.style.left = "0";
              currentDiv--;
              break;
              case 4:

              currentDiv--;
              moveBack();
              newAppointmentScrollableDivServiceDateTimeSelector.style.left = "100%";
              break;

              if(serverStoreObj.clientCanPickEmployee == true && serverStoreObj.employees.length>0){
              newAppointmentScrollableDivServiceEmployeeSelector.style.left = "0";
              newAppointmentScrollableDivServiceDateTimeSelector.style.left = "100%";
              }else{
                newAppointmentScrollableDivServiceSelector.style.left = "100%";
                  currentDiv--;
              }
              currentDiv--;
              break;
            }

          }


          function unselectAllServicesDiv(){
            newAppointmentInfos.servicesName = [];
            newAppointmentInfos.servicesObj = [];
            var serviceCheckboxLabelClass = document.getElementsByClassName('serviceCheckboxLabel');
            for(var n=0;n<serviceCheckboxLabelClass.length;n++){
              serviceCheckboxLabelClass[n].getElementsByTagName('input')[0].checked = false;
            }
          }

          function unselectAllServicesEmployeeDiv(){
            newAppointmentInfos.servicesEmployee = [];
            var selectedServicesEmployeeDiv = newAppointmentScrollableDivServiceEmployeeSelector.getElementsByClassName('selectedServiceDivNewAppointment');
            while(newAppointmentScrollableDivServiceEmployeeSelector.getElementsByClassName('selectedServiceDivNewAppointment').length>0){
              newAppointmentScrollableDivServiceEmployeeSelector.getElementsByClassName('selectedServiceDivNewAppointment')[0].classList.remove('selectedServiceDivNewAppointment');
            }
          }


}
