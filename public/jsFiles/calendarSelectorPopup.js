function createTheCalendarPopup(callback){


var calendarPickerDate = new Date();
if(typeof dateSelected != "undefined"){
  calendarPickerDate = dateSelected;
}


var dateNow = new Date();
if(typeof dateNow != "undefined"){
  dateNow = dateNow;
}

var calendarMainDiv = document.createElement('div');
calendarMainDiv.classList.add("cardPopup");

var calendarContentContainer = document.createElement('div');
calendarContentContainer.classList.add('popupContentInfiniteHeight');

var calendarHeaderContainer = document.createElement('div');
calendarHeaderContainer.classList.add('popupHeader');





var topPickerDiv = document.createElement('div');
topPickerDiv.classList.add('monthCalendarPickerTopDiv');

var leftArrow  = document.createElement('img');
leftArrow.classList.add('monthCalendarPickerLeftArrow');
leftArrow.src = "assets/icons/octiconsSvg/chevron-left.svg";

var rightArrow  = document.createElement('img');
rightArrow.classList.add('monthCalendarPickerRightArrow');
rightArrow.src = "assets/icons/octiconsSvg/chevron-right.svg";

var monthName  = document.createElement('p');
monthName.classList.add('monthCalendarPickerMonthName');
monthName.innerText = fullMonthsName[calendarPickerDate.getMonth()]+" "+calendarPickerDate.getFullYear();

topPickerDiv.appendChild(leftArrow);
topPickerDiv.appendChild(rightArrow);
topPickerDiv.appendChild(monthName);
calendarContentContainer.appendChild(topPickerDiv);


var divAroundTable = document.createElement('div');
createTable(calendarPickerDate);





leftArrow.onclick = function(){
changeMonth(-1);
}
rightArrow.onclick = function(){
changeMonth(1);
}


function changeMonth(plusOrMinus){

            var lastDayOfCurrentMonth = new Date(calendarPickerDate.getFullYear(), calendarPickerDate.getMonth()+1, 0).getDate();
            var lastDayOfNextMonth = new Date(calendarPickerDate.getFullYear(), calendarPickerDate.getMonth()+2, 0).getDate();
            var lastDayOfPastMonth = new Date(calendarPickerDate.getFullYear(), calendarPickerDate.getMonth(), 0).getDate();
            if(plusOrMinus == 1){
            //next Month
              if(lastDayOfNextMonth<lastDayOfCurrentMonth){
              calendarPickerDate.setDate(lastDayOfNextMonth);
              calendarPickerDate.setMonth(calendarPickerDate.getMonth()+1);
              }else{
              calendarPickerDate.setMonth(calendarPickerDate.getMonth()+1);
              }
            }else{
            //past month == -1
              if(lastDayOfPastMonth<lastDayOfCurrentMonth){
              calendarPickerDate.setDate(lastDayOfPastMonth);
              calendarPickerDate.setMonth(calendarPickerDate.getMonth()-1);
              }else{
              calendarPickerDate.setMonth(calendarPickerDate.getMonth()-1);

              }
            }

                createTable(calendarPickerDate);

                monthName.innerText = fullMonthsName[calendarPickerDate.getMonth()]+" "+calendarPickerDate.getFullYear();
}




 function createTable(theDate){
divAroundTable.innerHTML = "";
           var monthNumber = theDate.getMonth();
           var yearNumber = theDate.getFullYear();

           var daysInMonth = new Date(yearNumber, monthNumber+1, 0).getDate();

           var startDayOfMonth = new Date(yearNumber, monthNumber, 1).getDay();
           var endDayOfMonth = new Date(yearNumber, monthNumber, daysInMonth).getDay();

           // Determine the number of blank squares before start of month
               var squares = [];
               if (startDayOfMonth != 0) {
                 for (var i=0; i<startDayOfMonth; i++) {
                   squares.push("b");
                 }
               }

               // Populate the days of the month
               for (var i=1; i<=daysInMonth; i++) {
                 squares.push(i);
               }

               // Determine the number of blank squares after end of month
               if (endDayOfMonth != 6) {
                 var blanks = endDayOfMonth==0 ? 6 : 6-endDayOfMonth;
                 for (var i=0; i<blanks; i++) {
                   squares.push("b");
                 }
               }


           var monthTable = document.createElement("table");
           monthTable.classList.add("monthCalendarSelectorTable");

           // First row - Days
               var monthNameRow = document.createElement("tr");
               var calendarCell = null;
               for (var i=0;i<weekDayName.length;i++) {
                 calendarCell = document.createElement("td");
                 calendarCell.classList.add('weekDayNameCell');
                 calendarCell.innerText = weekDayName[i];
                 monthNameRow.appendChild(calendarCell);
               }
               monthNameRow.classList.add("weekDayNameRow");
               monthTable.appendChild(monthNameRow);




               // Days in Month
               var totalDays = squares.length;
               var calendarRow = document.createElement("tr");
               var monthDateCell = null;

               for (var i=0; i<totalDays; i++) {
                 monthDateCell = document.createElement("td");
                 if (squares[i]=="b") {
                   monthDateCell.classList.add("blankDate");
                 } else {

                   var wrapperInsideTd = document.createElement("div");
                   wrapperInsideTd.innerHTML = "<div class='monthDateCell'>"+squares[i]+"</div>";
                   wrapperInsideTd.classList.add("wrapperInsideMonthCell");
                   monthDateCell.appendChild(wrapperInsideTd);
                   var newMonthNumber = monthNumber;
                   monthDateCell.setAttribute("date", yearNumber+"/"+(newMonthNumber+1)+"/"+squares[i]);



                   if(dateNow.getDate() > squares[i] && dateNow.getMonth() == newMonthNumber && dateNow.getFullYear() == yearNumber){

                   wrapperInsideTd.classList.add('calendarTextBlocked');
                 }else if(dateNow.getMonth() >newMonthNumber && dateNow.getFullYear() == yearNumber){
                   //later month but same year
                     wrapperInsideTd.classList.add('calendarTextBlocked');
                   }else if(dateNow.getFullYear() > yearNumber){
                 //later year
                 wrapperInsideTd.classList.add('calendarTextBlocked');
               }else{
                wrapperInsideTd.classList.add('calendarTextAvailable');
                 monthDateCell.addEventListener("click", function(){
                   closeCalendarPopup();
                   callback(this.getAttribute('date'));
                 });
               }


                 }
                 calendarRow.appendChild(monthDateCell);
                 if (i!=0 && (i+1)%7==0) {
                   monthTable.appendChild(calendarRow);
                   calendarRow = document.createElement("tr");
                 }
               }


           divAroundTable.appendChild(monthTable);
 }
calendarContentContainer.appendChild(divAroundTable);


calendarMainDiv.appendChild(calendarHeaderContainer);
calendarMainDiv.appendChild(calendarContentContainer);




var popupTitle = document.createElement('p');
popupTitle.classList.add('modalMainTitle');
popupTitle.innerText = translateWord('Choose a date');

var popupXQuit = document.createElement('p');
popupXQuit.classList.add('popupX');
popupXQuit.innerText = "X";
popupXQuit.onclick = function(){
  closeCalendarPopup();
}

calendarHeaderContainer.appendChild(popupTitle);
calendarHeaderContainer.appendChild(popupXQuit);

var cardPopupContainer = document.createElement('div');
cardPopupContainer.classList.add('cardPopupContainer');


cardPopupContainer.appendChild(calendarMainDiv);






var transparentOverlay = document.createElement('div');
transparentOverlay.classList.add("transparentOverlay");
transparentOverlay.appendChild(cardPopupContainer);

function closeCalendarPopup(){
transparentOverlay.remove();
}
transparentOverlay.onclick = function(e){
  if(e.target != this){
    if(e.target.className == "cardPopupContainer"){
      closeCalendarPopup();
    }
  }else{
    closeCalendarPopup();
  }
}
document.body.appendChild(transparentOverlay);

}
