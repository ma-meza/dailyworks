var newAppointmentInfos = {
    servicesName:[],
    employeeName:null,
    employeeId:null,
    servicesObj:[],
    startDate:null,
    endDate:null,
    addNote:null
}

var newAppointmentClientInfos = {
  name:null,
  email:null,
  phoneNumber:null,
  addNote:null,
  newClient:false,
  clientId:null
}

var localGuestClientsObj = null;





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

            resetClientProfilePlaceholders();
            emptyClientProfileInputs();
            newAppointmentClientInfos.newClient = true;
            newAppointmentScrollableDivClientProfile.style.left = "0";
            newAppointmentScrollableDivEmailPhoneName.style.left = "-100%";
            moveNext();
          }

          newAppointmentScrollableDivEmailPhoneName.appendChild(existingClientSearchInput);
          newAppointmentScrollableDivEmailPhoneName.appendChild(orSeparatorDiv);
          newAppointmentScrollableDivEmailPhoneName.appendChild(newGuestClientButton);










existingClientSearchResultsIsDisplayed = false;


var cancelButton = document.createElement('button');
cancelButton.classList.add('cancelbutton');
cancelButton.innerText = translateWord('Cancel');
cancelButton.style.display = "none";
newAppointmentScrollableDivEmailPhoneName.appendChild(cancelButton);
cancelButton.onclick = function(){
  newAppointmentScrollableDivEmailPhoneName.id = "newClientOrSearchClientDiv";
  removeClientResultDiv();
}

var createExistingClientSearchContainerDiv = document.createElement('div');
createExistingClientSearchContainerDiv.style.left = 0;
createExistingClientSearchContainerDiv.style.display = "none";
createExistingClientSearchContainerDiv.classList.add('scrollableListPopup');
createExistingClientSearchContainerDiv.classList.add('scrollableNewClientResultMainDiv');

newAppointmentScrollableDivEmailPhoneName.appendChild(createExistingClientSearchContainerDiv);





function removeClientResultDiv(){
  existingClientSearchInput.value = "";
  createExistingClientSearchContainerDiv.style.display = "none";
  existingClientSearchInput.classList.remove('fullWidthTextInput');
  existingClientSearchResultsIsDisplayed = false;
  cancelButton.style.display = "none";
}









          var newAppointmentScrollableDivClientProfile = document.createElement('div');
          newAppointmentScrollableDivClientProfile.classList.add('newAppointmentScrollableDiv');
          var popupTitleClientProfile = document.createElement('p');
          popupTitleClientProfile.classList.add('popupTitle');
          popupTitleClientProfile.id = "clientProfileTitle";
          popupTitleClientProfile.innerText = translateWord('New client profile');
          newAppointmentScrollableDivClientProfile.appendChild(popupTitleClientProfile);
          newAppointmentScrollableDivClientProfile.id = "clientProfile";
          newAppointmentScrollableDivClientProfile.style.left = "100%";

          var newClientNameInput = document.createElement('input');
          newClientNameInput.type = "text";
          newClientNameInput.id="clientProfileNameInput";
          newClientNameInput.placeholder = translateWord("Client name");
          newClientNameInput.classList.add('newClientInput');
          newClientNameLabelUnder = document.createElement('p');
          newClientNameLabelUnder.classList.add('newClientInputErrorLabel');
          var newClientEmailInput = document.createElement('input');
          newClientEmailInput.id="clientProfileEmailInput";
          newClientEmailInput.placeholder = translateWord("Client email");
          newClientEmailInput.type = "text";
          newClientEmailInput.classList.add('newClientInput');
          var newClientPhoneInput = document.createElement('input');
          newClientPhoneInput.id="clientProfilePhoneInput";
          newClientPhoneInput.placeholder = translateWord("Client phone number");
          newClientPhoneInput.type = "text";
          newClientPhoneInput.classList.add('newClientInput');
          newClientPhoneLabelUnder = document.createElement('p');
          newClientPhoneLabelUnder.classList.add('newClientInputErrorLabel');
          var newClientNoteInput = document.createElement('textarea');
          newClientNoteInput.placeholder = translateWord("Note on client...");
          newClientNoteInput.id="clientProfileNoteInput";
          newClientNoteInput.classList.add('newClientInput');

          newAppointmentScrollableDivClientProfile.appendChild(newClientNameInput);
          newAppointmentScrollableDivClientProfile.appendChild(newClientNameLabelUnder);
          newAppointmentScrollableDivClientProfile.appendChild(newClientEmailInput);
          newAppointmentScrollableDivClientProfile.appendChild(newClientPhoneInput);
          newAppointmentScrollableDivClientProfile.appendChild(newClientPhoneLabelUnder);
          newAppointmentScrollableDivClientProfile.appendChild(newClientNoteInput);


          function createDivOfFoundExistingClient(clientObj){
            emptyClientProfileInputs();
            resetClientProfilePlaceholders();
              newAppointmentScrollableDivEmailPhoneName.style.left = "-100%";
              newAppointmentClientInfos.newClient = false;
              newAppointmentClientInfos.clientId = clientObj._id;
              if(clientObj){
                if(clientObj.fullName != "" && clientObj.fullName){
                  newClientNameInput.placeholder = clientObj.fullName;
                  newAppointmentClientInfos.name = clientObj.fullName;
                  popupTitleClientProfile.innerText = "Client's profile ("+clientObj.fullName+")";
                }else{
                  popupTitleClientProfile.innerText = "Existing client profile";
                }
                if(clientObj.email != "" && clientObj.email){
                  newClientEmailInput.placeholder = clientObj.email;
                  newAppointmentClientInfos.email = clientObj.email;
                }
                if(clientObj.phoneNumber != "" && clientObj.phoneNumber){
                  newClientPhoneInput.placeholder = clientObj.phoneNumber;
                  newAppointmentClientInfos.phoneNumber = clientObj.phoneNumber;
                }
                newAppointmentScrollableDivClientProfile.style.left = "0";

                moveNext();
                setTimeout(function() { removeClientResultDiv(); }, 1000);
              }



          }


          function resetClientProfilePlaceholders(){
            resetClientObj();
              newClientNameInput.placeholder = "Client name";
              newClientEmailInput.placeholder = "Client email";
              newClientPhoneInput.placeholder = "Client phone number";
              newClientNoteInput.placeholder = "Note on client...";
          }
          function emptyClientProfileInputs(){
            resetClientObj();
            newClientNameInput.value = "";
            newClientEmailInput.value = "";
            newClientPhoneInput.value = "";
            newClientNoteInput.value = "";
            popupTitleClientProfile.innerText = translateWord("New client profile");
          }

          function resetClientObj(){
            newAppointmentClientInfos.name = null;
            newAppointmentClientInfos.email = null;
            newAppointmentClientInfos.phoneNumber = null;
            newAppointmentClientInfos.addNote = null;
            newAppointmentClientInfos.newClient = false;
            newAppointmentClientInfos.clientId = null;

            resetErrorLabelClientProfile();
          }

          function resetErrorLabelClientProfile(){
            newClientNameLabelUnder.innerText = "";
            newClientPhoneLabelUnder.innerText = "";
          }


















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
                serviceCheckboxLabel.setAttribute('serviceid', i);

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
              newAppointmentScrollableDivServiceSelector.innerHTML = "<p class='emptyScreenText'>"+translateWord('You have no services yet')+"</p>";
              var createClient = document.createElement('button');
              createClient.classList.add('emptyScreenButton');
              createClient.innerText = "Create services now";
              createClient.onclick = function(){
                window.location.href = "/settings";
              }
              newAppointmentScrollableDivServiceSelector.appendChild(createClient);
            }
          }else{
            newAppointmentScrollableDivServiceSelector.innerHTML = "<p class='emptyScreenText'>"+translateWord('You have no services yet')+"</p>";
            var createClient = document.createElement('button');
            createClient.classList.add('emptyScreenButton');
            createClient.innerText = "Create services now";
            createClient.onclick = function(){
              window.location.href = "/settings";
            }
            newAppointmentScrollableDivServiceSelector.appendChild(createClient);

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
            addNoteTextarea.id = 'newAppointmentTextarea';
            addNoteTextarea.placeholder = "Add a note, message or request";
            newAppointmentScrollableDivAddNote.appendChild(addNoteTextarea);
            newAppointmentScrollableDivAddNote.style.left = "100%";


            var newAppointmentScrollableDivSummary = document.createElement('div');
            newAppointmentScrollableDivSummary.classList.add('newAppointmentScrollableDiv');
            var popupTitleSummary = document.createElement('p');
            popupTitleSummary.classList.add('popupTitle');
            popupTitleSummary.innerText = translateWord('Appointment summary');
            newAppointmentScrollableDivSummary.style.left = "100%";
            newAppointmentScrollableDivSummary.appendChild(popupTitleSummary);
            var appointmentSummaryP = document.createElement('p');
            appointmentSummaryP.classList.add('appointmentSummaryP');
            appointmentSummaryP.id= "appointmentSummaryP";
            newAppointmentScrollableDivSummary.appendChild(appointmentSummaryP);


            var newAppointmentScrollableDivConfirmation = document.createElement('div');
            newAppointmentScrollableDivConfirmation.classList.add('newAppointmentScrollableDiv');
            var popupTitleConfirmation = document.createElement('p');
            popupTitleConfirmation.classList.add('popupTitle');
            popupTitleConfirmation.innerText = translateWord('Congratulations!');
            newAppointmentScrollableDivConfirmation.style.left = "100%";
            newAppointmentScrollableDivConfirmation.style.height = "100%";
            newAppointmentScrollableDivConfirmation.appendChild(popupTitleConfirmation);





          newAppointmentMainDivContainer.appendChild(newAppointmentScrollableDivClientProfile);
          newAppointmentMainDivContainer.appendChild(newAppointmentScrollableDivEmailPhoneName);
          newAppointmentMainDivContainer.appendChild(newAppointmentScrollableDivServiceSelector);
          newAppointmentMainDivContainer.appendChild(newAppointmentScrollableDivServiceEmployeeSelector);
          newAppointmentMainDivContainer.appendChild(newAppointmentScrollableDivServiceDateTimeSelector);
          newAppointmentMainDivContainer.appendChild(newAppointmentScrollableDivAddNote);
          newAppointmentMainDivContainer.appendChild(newAppointmentScrollableDivSummary);
          newAppointmentMainDivContainer.appendChild(newAppointmentScrollableDivConfirmation);
          document.getElementById('mainScreenBody').appendChild(newAppointmentMainDivContainer);



          var currentDiv = 0;

          function moveNext(){
            console.log(newAppointmentClientInfos);
            switch(currentDiv){

              case 0:
              document.getElementById("newAppointmentBottomNavigationBar").style.left = "0";
              document.getElementById("newAppointmentBottomNavigationBar").style.display = "block";
              currentDiv++;
              break;
              case 1:

              if(newAppointmentClientInfos.newClient == true){
                resetClientObj();
                console.log('yo');
                if(newClientNameInput.value == ""){
                  newClientNameLabelUnder.innerText = translateWord("Please enter the client's name");
                }else{
                  if(newClientPhoneInput.value == "" && newClientEmailInput.value == ""){
                    newClientPhoneLabelUnder.innerText = translateWord("Please enter either a phone number or email address");
                  }else{

                    if(newClientPhoneInput.value != ""){
                      newAppointmentClientInfos.phoneNumber = newClientPhoneInput.value;
                    }
                    if(newClientEmailInput.value != ""){
                      newAppointmentClientInfos.email = newClientEmailInput.value;
                    }
                    if(newClientNoteInput.value != ""){
                      newAppointmentClientInfos.addNote = newClientNoteInput.value;
                    }
                    newAppointmentClientInfos.name = newClientNameInput.value;

                    newAppointmentScrollableDivServiceSelector.style.left = "0";
                    newAppointmentScrollableDivClientProfile.style.left = "-100%";
                    currentDiv++;
                  }
                }
              }else{
                newAppointmentScrollableDivServiceSelector.style.left = "0";
                newAppointmentScrollableDivClientProfile.style.left = "-100%";
                currentDiv++;
              }
              break;
              case 2:

              var serviceCheckboxLabelClass = document.getElementsByClassName('serviceCheckboxLabel');
              newAppointmentInfos.servicesName.length = 0;
              for(var n=0;n<serviceCheckboxLabelClass.length;n++){
                if(serviceCheckboxLabelClass[n].getElementsByTagName('input')[0].checked){
                  newAppointmentInfos.servicesName.push(serviceCheckboxLabelClass[n].innerText);
                  var theFullStoreObjService = serverStoreObj.services;
                  newAppointmentInfos.servicesObj.push(theFullStoreObjService[serviceCheckboxLabelClass[n].getAttribute('serviceId')]);
                }
              }




              newAppointmentInfos.employeeName = "null";
              newAppointmentInfos.employeeId = 'null';

              if(newAppointmentInfos.servicesName.length>0){

                newAppointmentInfos.employeeName = "null";
                newAppointmentInfos.employeeId = 'null';
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
                                              break;
                                            }
                                            currentDiv++;
                                    }
              break;
                case 3:

  var totalAppointmentDuration = 0;
  for(var e=0;e<newAppointmentInfos.servicesObj.length;e++){
    totalAppointmentDuration += newAppointmentInfos.servicesObj[e].duration;
  }
  var appointmentDurationInMilliseconds = decimalHourToMilliseconds(totalAppointmentDuration);
        var serviceEmployeeCheckboxLabelClass = document.getElementsByClassName('employeeServiceCheckboxLabel');


        for(var n=0;n<serviceEmployeeCheckboxLabelClass.length;n++){
          var radioEmployeeSelect = serviceEmployeeCheckboxLabelClass[n].getElementsByClassName('checkboxServiceEmployeeSelector')[0];
            if(radioEmployeeSelect.checked){
            newAppointmentInfos.employeeId = serviceEmployeeCheckboxLabelClass[n].getAttribute('employeeId');
            newAppointmentInfos.employeeName = serviceEmployeeCheckboxLabelClass[n].getAttribute('employeeValue');

            }
        }



            if(newAppointmentInfos.servicesName.length>0 && newAppointmentInfos.employeeName && newAppointmentInfos.employeeId){
            var allServicesEmployeeNoPreference = true;
            if(newAppointmentInfos.employeeId != 'null'){
              allServicesEmployeeNoPreference = false;
            }


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
                                                          var dateObjFromFunction = new Date(splittedDateArray[0]+"/"+(parseInt(splittedDateArray[1]))+"/"+(parseInt(splittedDateArray[2])));

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



                                                                                                                                  var fullDateStringStart = dateToDateString(requestedDate)+" "+millisecondsToTime(currentTimeDisplay);
                                                                                                                                  var fullDateStringEnd = dateToDateString(requestedDate)+" "+millisecondsToTime(endTimeDisplay);

                                                                                                                                  timePickerCheckboxInput.setAttribute('startDate',fullDateStringStart);
                                                                                                                                  timePickerCheckboxInput.setAttribute('endDate',fullDateStringEnd);

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
                                                                                                                if(serverStoreObj.employees[t]._id == newAppointmentInfos.employeeId){
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




                                                                                                                var fullDateStringStart = dateToDateString(requestedDate)+" "+millisecondsToTime(startTimesArray[s]);
                                                                                                                var fullDateStringEnd = dateToDateString(requestedDate)+" "+millisecondsToTime(endTimeDisplay);


                                                                                                                timePickerCheckboxInput.setAttribute('startDate',fullDateStringStart);
                                                                                                                timePickerCheckboxInput.setAttribute('endDate',fullDateStringEnd);


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



                                                                                                                        var fullDateStringStart = dateToDateString(requestedDate)+" "+millisecondsToTime(currentTimeDisplay);
                                                                                                                        var fullDateStringEnd = dateToDateString(requestedDate)+" "+millisecondsToTime(endTimeDisplay);


                                                                                                                        timePickerCheckboxInput.setAttribute('startDate',fullDateStringStart);
                                                                                                                        timePickerCheckboxInput.setAttribute('endDate',fullDateStringEnd);

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

                                                                                                        var availableIntervalStart = [];
                                                                                                        var availableIntervalEnd = [];

                                                                                                        var atLeastOneAvailabilityFound = false;

                                                                                                        for(var t=0;t<serverStoreObj.employees.length;t++){
                                                                                                          if( serverStoreObj.employees[t]._id == newAppointmentInfos.employeeId){
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

                                                                                                            if(data[ws].employeeId == newAppointmentInfos.empoyeeId){
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



                                                                                                                          var fullDateStringStart = dateToDateString(requestedDate)+" "+millisecondsToTime(currentTimeDisplay);
                                                                                                                          var fullDateStringEnd = dateToDateString(requestedDate)+" "+millisecondsToTime(endTimeDisplay);

                                                                                                                          timePickerCheckboxInput.setAttribute('startDate',fullDateStringStart);
                                                                                                                          timePickerCheckboxInput.setAttribute('endDate',fullDateStringEnd);

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
                var allCheckboxesDateTime = document.getElementsByClassName('servicesTimePickerCheckboxSelector');
                for(var y=0;y<allCheckboxesDateTime.length;y++){
                  if(allCheckboxesDateTime[y].checked == true ){

                    var startDate = allCheckboxesDateTime[y].getAttribute('startDate');
                    var endDate = allCheckboxesDateTime[y].getAttribute('endDate');
                    newAppointmentInfos.startDate = startDate;
                    newAppointmentInfos.endDate = endDate;
                    dateTimeIsSelected = true;
                    newAppointmentScrollableDivAddNote.style.left ="0";
                    newAppointmentScrollableDivServiceDateTimeSelector.style.left = "-100%";
                    currentDiv++;
                    break;
                  }
                }
                break;
                case 5:
                var appointmentSummaryString = "Client: "+newAppointmentClientInfos.name+" (";
                if(newAppointmentClientInfos.email != null){
                  if(newAppointmentClientInfos.phoneNumber != null){
                    appointmentSummaryString+=newAppointmentClientInfos.email+", "+newAppointmentClientInfos.phoneNumber+") ";
                  }else{
                    appointmentSummaryString+=newAppointmentClientInfos.email+") ";
                  }
                }else if(newAppointmentClientInfos.phoneNumber != null){
                  appointmentSummaryString+= newAppointmentClientInfos.phoneNumber+") ";
                }else{
                  appointmentSummaryString+=")";
                }


                appointmentSummaryString+="<br>Services requested: ";
                for(var f=0;f<newAppointmentInfos.servicesName.length;f++){
                  appointmentSummaryString+=newAppointmentInfos.servicesName[f]+", ";
                }
                appointmentSummaryString = appointmentSummaryString.substring(0, appointmentSummaryString.length -2)+"<br>";



                if(newAppointmentInfos.employeeId == 'null'){
                  appointmentSummaryString+="Employee: no preferance<br>";
                }else{
                  appointmentSummaryString+="Employee: "+newAppointmentInfos.employeeName+"<br>";
                }

                appointmentSummaryString+="Date: "+dateToClientString(newAppointmentInfos.startDate)+" - "+dateToClientString(newAppointmentInfos.endDate);

                appointmentSummaryP.innerHTML = appointmentSummaryString;
                newAppointmentScrollableDivAddNote.style.left ="-100%";
                newAppointmentScrollableDivSummary.style.left = "0";
                newAppointmentInfos.addNote = addNoteTextarea.value;

                newAppointmentNextButton.innerText = translateWord('Submit');

                currentDiv++;
                break;
                case 6:



                // var newAppointmentInfos = {
                //     servicesName:[],
                //     servicesEmployee:[],
                //     servicesObj:[],
                //     startDate:null,
                //     endDate:null,
                //     addNote:null
                // }
                //
                // var newAppointmentClientInfos = {
                //   name:null,
                //   email:null,
                //   phoneNumber:null,
                //   addNote:null,
                //   newClient:false,
                //   clientId:null
                // }

                $.ajax({
                 url: '/postNewAppointmentLocal',
                 type: 'post',
                 data:{appointmentInfos:newAppointmentInfos, clientInfos:newAppointmentClientInfos},
                 success: function( data, textStatus){
                 if(data == "error"){
                   displaySnackbar('There has been a server error, the appointment was not created.', document.body);
                 }else if(data == "ok"){
                   document.getElementById("newAppointmentBottomNavigationBar").style.left = "100%";
                   document.getElementById("newAppointmentBottomNavigationBar").style.display = "none";
                   newAppointmentScrollableDivSummary.style.left = "-100%";
                   newAppointmentScrollableDivConfirmation.style.left = "0";
                   currentDiv++;
                 }else{
                   displaySnackbar('There has been a server error, the appointment was not created.', document.body);
                 }
                 },
                 error: function( textStatus, errorThrown ){
                   displaySnackbar('There has been a server error, the appointment was not created.', document.body);
                 }
                 });
                break;
            }
          }




          function moveBack(){
            console.log(newAppointmentClientInfos);
            switch(currentDiv){
              case 1:

                newAppointmentScrollableDivEmailPhoneName.style.left = "0";
                newAppointmentScrollableDivClientProfile.style.left = "100%";
                document.getElementById("newAppointmentBottomNavigationBar").style.left = "100%";
                document.getElementById("newAppointmentBottomNavigationBar").style.display = "none";
                newAppointmentInfos.addNote = null;
                addNoteTextarea.value = "";
                currentDiv--;
              break;
              case 2:
                newAppointmentInfos.servicesName = [];
                newAppointmentInfos.servicesObj = [];
                unselectAllServicesDiv();
                newAppointmentScrollableDivServiceSelector.style.left = "100%";
                newAppointmentScrollableDivClientProfile.style.left = "0";
              currentDiv--;
              break;
              case 3:
              unselectAllServicesEmployeeDiv();
              newAppointmentScrollableDivServiceEmployeeSelector.style.left = "100%";
              newAppointmentScrollableDivServiceSelector.style.left = "0";
              currentDiv--;
              break;
              case 4:
              newAppointmentInfos.startDate = null;
              newAppointmentInfos.endDate = null;
              if(serverStoreObj.clientCanPickEmployee == true && serverStoreObj.employees.length>0){
                newAppointmentScrollableDivServiceEmployeeSelector.style.left = "0";
                newAppointmentScrollableDivServiceDateTimeSelector.style.left = "100%";
                currentDiv--;
              }else{
                newAppointmentScrollableDivServiceDateTimeSelector.style.left = "100%";
                  currentDiv--;
                  moveBack();
              }
              break;
              case 5:
              newAppointmentScrollableDivServiceDateTimeSelector.style.left = "0";
              newAppointmentScrollableDivAddNote.style.left = "100%";
              currentDiv--;
              break;
              case 6:
              newAppointmentNextButton.innerText = translateWord("Next");
              newAppointmentScrollableDivAddNote.style.left = "0";
              newAppointmentScrollableDivSummary.style.left = "100%";
              currentDiv--;
              break;
            }

          }


          function slideToNewClientFromSearch(){
            moveNext();
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
            newAppointmentInfos.employeeName = "null";
            newAppointmentInfos.employeeId = 'null';
            var selectedServicesEmployeeDiv = newAppointmentScrollableDivServiceEmployeeSelector.getElementsByClassName('selectedServiceDivNewAppointment');
            while(newAppointmentScrollableDivServiceEmployeeSelector.getElementsByClassName('selectedServiceDivNewAppointment').length>0){
              newAppointmentScrollableDivServiceEmployeeSelector.getElementsByClassName('selectedServiceDivNewAppointment')[0].classList.remove('selectedServiceDivNewAppointment');
            }
          }



          existingClientSearchInput.onkeyup = function(){
            if(!existingClientSearchResultsIsDisplayed){
              existingClientSearchInput.classList.add('fullWidthTextInput');
              existingClientSearchResultsIsDisplayed = true;
              cancelButton.style.display = "block";
            }
            createExistingClientSearchContainerDiv.innerHTML = "";
            var searchQuery = existingClientSearchInput.value;




            if(localGuestClientsObj == null){
                displayLoader();

                  $.ajax({
                   url: '/getAllStoreLocalGuestClients',
                   type: 'get',
                   success: function( data, textStatus){
                   if(data == "error"){
                     console.log('error');
                     createExistingClientSearchContainerDiv.innerHTML = "<p class='emptyScreenText'>"+translateWord('Server error, please try again.')+"</p>";
                   }else{
                     localGuestClientsObj = JSON.parse(data);

                     if(localGuestClientsObj.length !=0){
                       var nbResults = 0;
                           for(var i=0;i<localGuestClientsObj.length;i++)(function(i){

                                 if(localGuestClientsObj[i].fullName.toLowerCase().includes(searchQuery.toLowerCase())){
                                       var clientEachResultDiv = document.createElement('div');
                                       clientEachResultDiv.onclick = function(){
                                           createDivOfFoundExistingClient(localGuestClientsObj[i]);
                                       }
                                       clientEachResultDiv.classList.add('innerClientResultDiv');
                                       clientEachResultDiv.innerText = localGuestClientsObj[i].fullName+" ("+localGuestClientsObj[i].phoneNumber+")";
                                       createExistingClientSearchContainerDiv.appendChild(clientEachResultDiv);
                                       nbResults++;
                                 }else if(localGuestClientsObj[i].phoneNumber.includes(searchQuery)){
                                       var clientEachResultDiv = document.createElement('div');
                                       clientEachResultDiv.onclick = function(){
                                           createDivOfFoundExistingClient(localGuestClientsObj[i]);
                                       }
                                       clientEachResultDiv.classList.add('innerClientResultDiv');
                                       clientEachResultDiv.innerText = localGuestClientsObj[i].fullName+" ("+localGuestClientsObj[i].phoneNumber+")";
                                       createExistingClientSearchContainerDiv.appendChild(clientEachResultDiv);
                                       nbResults++;
                                 }else if(localGuestClientsObj[i].email.includes(searchQuery)){
                                       var clientEachResultDiv = document.createElement('div');
                                       clientEachResultDiv.onclick = function(){
                                           createDivOfFoundExistingClient(localGuestClientsObj[i]);
                                       }
                                       clientEachResultDiv.classList.add('innerClientResultDiv');
                                       clientEachResultDiv.innerText = localGuestClientsObj[i].fullName+" ("+localGuestClientsObj[i].phoneNumber+")";
                                       createExistingClientSearchContainerDiv.appendChild(clientEachResultDiv);
                                       nbResults++;
                                 }
                           })(i);
                           if(nbResults == 0){
                             createExistingClientSearchContainerDiv.innerHTML = "<p class='emptyScreenText'>"+translateWord('There are no results for that search.')+"</p>";
                           }
                      }else{
                        var createClient = document.createElement('button');
                        createClient.classList.add('emptyScreenButton');
                        createClient.innerText = "Create a client now";
                        createClient.onclick = function(){
                          newAppointmentScrollableDivClientProfile.style.left = "0";
                          newAppointmentScrollableDivEmailPhoneName.style.left = "-100%";
                          newAppointmentClientInfos.newClient = true;
                          moveNext();
                        }
                           createExistingClientSearchContainerDiv.innerHTML = "<p class='emptyScreenText'>"+translateWord('You have no clients yet')+"</p>";
                           createExistingClientSearchContainerDiv.appendChild(createClient);
                     }
                   }
                   deleteLoader();
                   },
                   error: function( textStatus, errorThrown ){
                     deleteLoader();
                     console.log('error');
                      createExistingClientSearchContainerDiv.innerHTML = "<p class='emptyScreenText'>"+translateWord('Server error, please try again.')+"</p>";
                   }
                   });
            }else{
              displayLoader();
              var nbResults = 0;
              for(var i=0;i<localGuestClientsObj.length;i++)(function(i){
                    if(localGuestClientsObj[i].fullName.toLowerCase().includes(searchQuery.toLowerCase())){
                          var clientEachResultDiv = document.createElement('div');
                          clientEachResultDiv.onclick = function(){
                              createDivOfFoundExistingClient(localGuestClientsObj[i]);
                          }
                          clientEachResultDiv.classList.add('innerClientResultDiv');
                          clientEachResultDiv.innerText = localGuestClientsObj[i].fullName+" ("+localGuestClientsObj[i].phoneNumber+")";
                          createExistingClientSearchContainerDiv.appendChild(clientEachResultDiv);
                          nbResults++;
                    }else if(localGuestClientsObj[i].phoneNumber.includes(searchQuery)){
                          var clientEachResultDiv = document.createElement('div');
                          clientEachResultDiv.onclick = function(){
                              createDivOfFoundExistingClient(localGuestClientsObj[i]);
                          }
                          clientEachResultDiv.classList.add('innerClientResultDiv');
                          clientEachResultDiv.innerText = localGuestClientsObj[i].fullName+" ("+localGuestClientsObj[i].phoneNumber+")";
                          createExistingClientSearchContainerDiv.appendChild(clientEachResultDiv);
                          nbResults++;
                    }else if(localGuestClientsObj[i].email.toLowerCase().includes(searchQuery.toLowerCase())){
                          var clientEachResultDiv = document.createElement('div');
                          clientEachResultDiv.onclick = function(){
                              createDivOfFoundExistingClient(localGuestClientsObj[i]);
                          }
                          clientEachResultDiv.classList.add('innerClientResultDiv');
                          clientEachResultDiv.innerText = localGuestClientsObj[i].fullName+" ("+localGuestClientsObj[i].phoneNumber+")";
                          createExistingClientSearchContainerDiv.appendChild(clientEachResultDiv);
                          nbResults++;
                    }
              })(i);
              if(nbResults == 0){
                createExistingClientSearchContainerDiv.innerHTML = "<p class='emptyScreenText'>"+translateWord('There are no results for that search.')+"</p>";
              }
              deleteLoader();
            }

                //search for users that already took appointments with the store


            // if(searchQuery !=""){
            //   // $.ajax({
            //   // url: '/searchAllRegisteredUsers',
            //   // type: 'get',
            //   // data:{searchQuery:existingClientSearchInput.value},
            //   // success: function( data, textStatus){
            //   // if(data == "error"){
            //   //
            //   // }else{
            //   //   console.log(data);
            //   //   for(var g=0;g<data.length;g++){
            //   //     var clientEachResultDiv = document.createElement('div');
            //   //     clientEachResultDiv.onclick = function(){
            //   //         createDivOfFoundExistingClient(data[g]);
            //   //     }
            //   //     clientEachResultDiv.classList.add('innerClientResultDiv');
            //   //     clientEachResultDiv.innerText = data[g].clientName;
            //   //     if(data[g].PhoneNumber){
            //   //        clientEachResultDiv.innerText += '('+data[g].phoneNumber+')';
            //   //     }
            //   //     createExistingClientSearchContainerDiv.appendChild(clientEachResultDiv);
            //   //   }
            //   //
            //   // }
            //   // },
            //   // error: function( textStatus, errorThrown ){
            //   //
            //   // }
            //   // });
            // }
            createExistingClientSearchContainerDiv.style.display = "block";

          }








}
