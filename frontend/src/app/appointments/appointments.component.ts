import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import {MomentModule} from 'angular2-moment/moment.module';
import * as moment from 'moment';
import { AppointmentsService } from '../appointments.service';


@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit, AfterViewInit {
  //verified 
  currentWeek = 0; //starts at the current week and increments every time next button is clicked
  cells: Object[]; //an array for the 37 time slots
  timeIndex: any; //keeps the currently selected time
  dayIndex: any; //keeps the currently selected day of the week
  currentlyFilled: any[]; //array for all slot ids in use
  yellowStartDate: any; //keeps currently yellow slots - previously: currentlyHighlighted
  yellowFormattedDate: any; //yellow selected date - but formatted
  saveYellow: any[]; //save the selected yellow slot in a variable
  weeklyBookings: any[]; //holds all the bookings
  dateSelected: any; //holds the current week range for the text box
  isSelected: any; //i.e. should we rehighlight or not
  weekToFill: Date; //holds a date to pass to back end to search by week
  isStart: any;
  storeDate: any;
  notTaken: any;
  storeM: number;
  fillType: any;
  posCount: boolean = true;
  counterTO: number;
  startCount: number;
  
  
  //unverified
  bookedDates: any[];
  
  
  currentlySaved: any[];
  
  temp: any[];
  selectedWeek: any;
  edgePage: any;
  
  currentType: string;
  reHighlight: any[];

  //NOTE: 1.5 hours for initial assessmengt and 1 hour for regular appointment

  constructor(private modalService: NgbModal, 
              private router: Router,
              private apptService: AppointmentsService) {}

  ngOnInit() {
    
    //console.log(this.currentType);
    this.isSelected = false; //this is for if we have to set previous yellow squres back to blue or not
    this.currentlyFilled = new Array(); //array for the possible slots that could be filled - holds booked slots on current page
    this.cells = new Array(37); //Create 37 time slots
    this.dateSelected = moment().startOf('week').format('LL') + " - " + moment().endOf('week').format('LL'); //set the range for the current week initially with the current week
    this.weekToFill = moment().toDate();
    //console.log(this.weekToFill);
    this.weeklyBookings = [];
    this.refreshCalendar(); //populate calendar
    this.counterTO = 0;
    
    
    
    this.temp = new Array(3); 
    this.isStart = true; 
  }
  
  
  
  
  ngAfterViewInit(){
    this.currentType = this.apptService.getType();
    //this.refreshCalendar();
    this.isSelected = false; 
  }
  
  
  //this gets called when a time slot is clicked
  choosenSlot(day: any, indx: any){ //day is hard coded, index isnt
    this.currentType = this.apptService.getType(); //get the type from the service
    this.notTaken = true; //start this at true and set to false in the for loop below if needed
    //console.log(this.currentType);
    // let now = new Date();
    // alert( now );
    
    //make sure they havnt selected more than one date
  if(!(this.isSelected)){
      //make sure the date they chose isnt already booked
      for(var i = 0; i<this.currentlyFilled.length; i++){
        if (this.currentType == "normal"){
          if(this.currentlyFilled[i] == ("slot"+day+indx) || this.currentlyFilled[i] == ("slot"+day+(indx+1)) || this.currentlyFilled[i] == ("slot"+day+(indx+2)) || this.currentlyFilled[i] == ("slot"+day+(indx+3))){
            this.notTaken = false; //gets set if date is already booked
            //console.log(this.currentlyFilled[i]);
            break;
          }
        }else if (this.currentType == "initial"){
          if(this.currentlyFilled[i] == ("slot"+day+indx) || this.currentlyFilled[i] == ("slot"+day+(indx+1)) || this.currentlyFilled[i] == ("slot"+day+(indx+2)) || this.currentlyFilled[i] == ("slot"+day+(indx+3)) || this.currentlyFilled[i] == ("slot"+day+(indx+4)) || this.currentlyFilled[i] == ("slot"+day+(indx+5))){
            this.notTaken = false; //gets set if date is already booked
            break;
          }
        }else{
          if(this.currentlyFilled[i] == ("slot"+day+indx)){
            this.notTaken = false; //gets set if date is already booked
            break;
          }
        }
      }
    
      //if booking is okay...
      if(this.notTaken){
        this.isSelected = true; //If one is selected they cant select another
        this.timeIndex = indx; //keeping variable with selected index
        this.dayIndex = day; //saving index to variable
        this.yellowStartDate = moment().startOf('week').startOf('day').add(this.currentWeek, 'weeks').add(day, 'days').add(8.5, 'hours').add((indx*15), 'minutes');
        var test = moment().startOf('week').startOf('day').add(this.currentWeek, 'weeks').add(day, 'days').add(8.5, 'hours').add((indx*15), 'minutes').toISOString();
        var newTest = new Date(test);
        var yellow = [("slot"+day+indx), ("slot"+day+(indx+1)), ("slot"+day+(indx+2)), ("slot"+day+(indx+3)), ("slot"+day+(indx+4)), ("slot"+day+(indx+5))]; //always sets 6 slots as if its an initial appointment
        this.saveYellow = yellow;
         this.yellowFormattedDate = moment(this.yellowStartDate).format('LLLL').toString();
        //this.currentType  this.apptService.getType();
        this.selectedWeek = this.currentWeek;
        this.apptService.setNewDate(newTest);
       
        
        if(this.currentType == "normal" && this.notTaken){
          if(indx > 33){
            if(indx == 34){
              document.getElementById(yellow[0]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
              document.getElementById(yellow[1]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
              document.getElementById(yellow[2]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
            }else if(indx == 35){
              document.getElementById(yellow[0]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
              document.getElementById(yellow[1]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
            }else{
              document.getElementById(yellow[0]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
            }
          }else{
            document.getElementById(yellow[0]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
            document.getElementById(yellow[1]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
            document.getElementById(yellow[2]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
            document.getElementById(yellow[3]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
          }
        }else if(this.currentType == 'initial' && this.notTaken){
         if(indx > 31){
            if(indx == 32){
              document.getElementById(yellow[0]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
              document.getElementById(yellow[1]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
              document.getElementById(yellow[2]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
              document.getElementById(yellow[3]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
              document.getElementById(yellow[4]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
             }
             else if(indx == 33){
              document.getElementById(yellow[0]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
              document.getElementById(yellow[1]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
              document.getElementById(yellow[2]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
              document.getElementById(yellow[3]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
             }
            else if(indx == 34){
              document.getElementById(yellow[0]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
              document.getElementById(yellow[1]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
              document.getElementById(yellow[2]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
            }else if(indx == 35){
              document.getElementById(yellow[0]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
              document.getElementById(yellow[1]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
            }else{
              document.getElementById(yellow[0]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
            }
          }else{
            document.getElementById(yellow[0]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
            document.getElementById(yellow[1]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
            document.getElementById(yellow[2]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
            document.getElementById(yellow[3]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
            document.getElementById(yellow[4]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
            document.getElementById(yellow[5]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
          }
        }
        
        this.isStart = false;
        this.reHighlight = yellow;
      
      }
      
  }else if(this.isSelected){ //this will have to change the current selection to a new one
      //console.log("Booking time must be changed");
      //make sure the date they chose isnt already booked
        for(var i = 0; i<this.currentlyFilled.length; i++){
        if (this.currentType == "normal"){
          if(this.currentlyFilled[i] == ("slot"+day+indx) || this.currentlyFilled[i] == ("slot"+day+(indx+1)) || this.currentlyFilled[i] == ("slot"+day+(indx+2)) || this.currentlyFilled[i] == ("slot"+day+(indx+3))){
            this.notTaken = false; //gets set if date is already booked
            //console.log(this.currentlyFilled[i]);
            break;
          }
        }else if (this.currentType == "initial"){
          if(this.currentlyFilled[i] == ("slot"+day+indx) || this.currentlyFilled[i] == ("slot"+day+(indx+1)) || this.currentlyFilled[i] == ("slot"+day+(indx+2)) || this.currentlyFilled[i] == ("slot"+day+(indx+3)) || this.currentlyFilled[i] == ("slot"+day+(indx+4)) || this.currentlyFilled[i] == ("slot"+day+(indx+5))){
            this.notTaken = false; //gets set if date is already booked
            break;
          }
        }else{
          if(this.currentlyFilled[i] == ("slot"+day+indx)){
            this.notTaken = false; //gets set if date is already booked
            break;
          }
        }
      }
      
      
      //if booking is okay...
      if(this.notTaken){
        this.timeIndex = indx; //keeping variable with selected index
        this.dayIndex = day;
        this.yellowStartDate = moment().startOf('week').startOf('day').add(this.currentWeek, 'weeks').add((day), 'days').add(8.5, 'hours').add((this.timeIndex*15), 'minutes');
        var yellow = [("slot"+day+indx), ("slot"+day+(indx+1)), ("slot"+day+(indx+2)), ("slot"+day+(indx+3)), ("slot"+day+(indx+4)),  ("slot"+day+(indx+5))];
        this.selectedWeek = this.currentWeek;
        var test = moment().startOf('week').startOf('day').add(this.currentWeek, 'weeks').add(day, 'days').add(8.5, 'hours').add((indx*15), 'minutes').toISOString();
        var newTest = new Date(test);
        this.yellowFormattedDate = moment(this.yellowStartDate).format('LLLL').toString();
        this.apptService.setNewDate(newTest);
        
        
        
        this.isStart = false;
        this.temp = [("slot"+day+indx), ("slot"+day+(indx+1)), ("slot"+day+(indx+2)), ("slot"+day+(indx+3)), ("slot"+day+(indx+4)),  ("slot"+day+(indx+5))];
        this.reHighlight = yellow;
        
        if(this.saveYellow[0] == "slot035" || this.saveYellow[0] == "slot135" || this.saveYellow[0] == "slot235" || this.saveYellow[0] == "slot335" ||this.saveYellow[0] == "slot435" ||this.saveYellow[0] ==  "slot535" ||this.saveYellow[0] == "slot635" 
        || this.saveYellow[0] == "slot036" || this.saveYellow[0] == "slot136" || this.saveYellow[0] == "slot236" || this.saveYellow[0] == "slot336" ||this.saveYellow[0] == "slot436" ||this.saveYellow[0] ==  "slot536" ||this.saveYellow[0] == "slot636"
        || this.saveYellow[0] == "slot032" || this.saveYellow[0] == "slot132" || this.saveYellow[0] == "slot232" || this.saveYellow[0] == "slot332" ||this.saveYellow[0] == "slot432" ||this.saveYellow[0] ==  "slot532" ||this.saveYellow[0] == "slot632"
        || this.saveYellow[0] == "slot033" || this.saveYellow[0] == "slot133" || this.saveYellow[0] == "slot233" || this.saveYellow[0] == "slot333" ||this.saveYellow[0] == "slot433" ||this.saveYellow[0] ==  "slot533" ||this.saveYellow[0] == "slot633"
        || this.saveYellow[0] == "slot034" || this.saveYellow[0] == "slot134" || this.saveYellow[0] == "slot234" || this.saveYellow[0] == "slot334" ||this.saveYellow[0] == "slot434" ||this.saveYellow[0] ==  "slot534" ||this.saveYellow[0] == "slot634"){
          
           if(this.saveYellow[0] == "slot036" || this.saveYellow[0] == "slot136" || this.saveYellow[0] == "slot236" || this.saveYellow[0] == "slot336" ||this.saveYellow[0] == "slot436" ||this.saveYellow[0] ==  "slot536" ||this.saveYellow[0] == "slot636"){
            document.getElementById(this.saveYellow[0]).setAttribute("class", "btn btn-sm btn-primary chooseTime");
          }
          else if(this.saveYellow[0] == "slot035" || this.saveYellow[0] == "slot135" || this.saveYellow[0] == "slot235" || this.saveYellow[0] == "slot335" ||this.saveYellow[0] == "slot435" ||this.saveYellow[0] ==  "slot535" ||this.saveYellow[0] == "slot635"){
            document.getElementById(this.saveYellow[0]).setAttribute("class", "btn btn-sm btn-primary chooseTime");
            document.getElementById(this.saveYellow[1]).setAttribute("class", "btn btn-sm btn-primary chooseTime");
          }
          else if(this.saveYellow[0] == "slot034" || this.saveYellow[0] == "slot134" || this.saveYellow[0] == "slot234" || this.saveYellow[0] == "slot334" ||this.saveYellow[0] == "slot434" ||this.saveYellow[0] ==  "slot534" ||this.saveYellow[0] == "slot634"){
            document.getElementById(this.saveYellow[0]).setAttribute("class", "btn btn-sm btn-primary chooseTime");
            document.getElementById(this.saveYellow[1]).setAttribute("class", "btn btn-sm btn-primary chooseTime");
            document.getElementById(this.saveYellow[2]).setAttribute("class", "btn btn-sm btn-primary chooseTime");
          }
          else if(this.saveYellow[0] == "slot033" || this.saveYellow[0] == "slot133" || this.saveYellow[0] == "slot233" || this.saveYellow[0] == "slot333" ||this.saveYellow[0] == "slot433" ||this.saveYellow[0] ==  "slot533" ||this.saveYellow[0] == "slot633"){
            document.getElementById(this.saveYellow[0]).setAttribute("class", "btn btn-sm btn-primary chooseTime");
            document.getElementById(this.saveYellow[1]).setAttribute("class", "btn btn-sm btn-primary chooseTime");
            document.getElementById(this.saveYellow[2]).setAttribute("class", "btn btn-sm btn-primary chooseTime");
            document.getElementById(this.saveYellow[3]).setAttribute("class", "btn btn-sm btn-primary chooseTime");
          }
          else if(this.saveYellow[0] == "slot032" || this.saveYellow[0] == "slot132" || this.saveYellow[0] == "slot232" || this.saveYellow[0] == "slot332" ||this.saveYellow[0] == "slot432" ||this.saveYellow[0] ==  "slot532" ||this.saveYellow[0] == "slot632"){
            document.getElementById(this.saveYellow[0]).setAttribute("class", "btn btn-sm btn-primary chooseTime");
            document.getElementById(this.saveYellow[1]).setAttribute("class", "btn btn-sm btn-primary chooseTime");
            document.getElementById(this.saveYellow[2]).setAttribute("class", "btn btn-sm btn-primary chooseTime");
            document.getElementById(this.saveYellow[3]).setAttribute("class", "btn btn-sm btn-primary chooseTime");
            document.getElementById(this.saveYellow[4]).setAttribute("class", "btn btn-sm btn-primary chooseTime");
          }
          
          
        }else{
            document.getElementById(this.saveYellow[0]).setAttribute("class", "btn btn-sm btn-primary chooseTime");
            document.getElementById(this.saveYellow[1]).setAttribute("class", "btn btn-sm btn-primary chooseTime");
            document.getElementById(this.saveYellow[2]).setAttribute("class", "btn btn-sm btn-primary chooseTime");
            document.getElementById(this.saveYellow[3]).setAttribute("class", "btn btn-sm btn-primary chooseTime");
            document.getElementById(this.saveYellow[4]).setAttribute("class", "btn btn-sm btn-primary chooseTime");
            document.getElementById(this.saveYellow[5]).setAttribute("class", "btn btn-sm btn-primary chooseTime");
        }
        
        this.saveYellow = yellow;
        
        if(this.currentType == "normal"){
          if(indx > 33){
            if(indx == 34){
              document.getElementById(yellow[0]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
              document.getElementById(yellow[1]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
              document.getElementById(yellow[2]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
            }else if(indx == 35){
              document.getElementById(yellow[0]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
              document.getElementById(yellow[1]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
            }else{
              document.getElementById(yellow[0]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
            }
          }else{
            document.getElementById(yellow[0]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
            document.getElementById(yellow[1]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
            document.getElementById(yellow[2]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
            document.getElementById(yellow[3]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
          }
        }else if(this.currentType == 'initial'){
         if(indx > 31){
            if(indx == 32){
              document.getElementById(yellow[0]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
              document.getElementById(yellow[1]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
              document.getElementById(yellow[2]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
              document.getElementById(yellow[3]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
              document.getElementById(yellow[4]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
             }
             else if(indx == 33){
              document.getElementById(yellow[0]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
              document.getElementById(yellow[1]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
              document.getElementById(yellow[2]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
              document.getElementById(yellow[3]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
             }
            else if(indx == 34){
              document.getElementById(yellow[0]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
              document.getElementById(yellow[1]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
              document.getElementById(yellow[2]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
            }else if(indx == 35){
              document.getElementById(yellow[0]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
              document.getElementById(yellow[1]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
            }else{
              document.getElementById(yellow[0]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
            }
          }else{
            document.getElementById(yellow[0]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
            document.getElementById(yellow[1]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
            document.getElementById(yellow[2]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
            document.getElementById(yellow[3]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
            document.getElementById(yellow[4]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
            document.getElementById(yellow[5]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
          }
        }
      }else{
        console.log("sorry, slot is already booked by another client (already grey)");
      }
    }
  }
  
  




//------------------------- GOOD TILL HERE -------------------------------------

  


  
  refreshCalendar(){
    //lets change this to use this.selected week so were not pulling all appointments every single call
    //var m = moment(this.weekToFill).toISOString();
    //var timeCount = 0; 
    
    this.apptService.GetAppointmentsByWeek(this.weekToFill).subscribe(data => {
      var retObj: any = data;
      //console.log("We are her: " + data);
      this.weeklyBookings = Object.assign([], retObj.appointment); //all appointments in current week
      
      //console.log("hello: "+this.weeklyBookings[0].date); //at this point we have all booked dates
      //console.log("Array of Dates: ");
      //console.log(this.weeklyBookings);
      //console.log(this.weeklyBookings);
      //console.log(this.weeklyBookings.length);
      
      //make all squares blue
        for(var i=0; i<7; i++){
            for(var j=0; j<37; j++){
              document.getElementById("slot"+i+j).setAttribute("class", "btn btn-sm btn-primary chooseTime");
            }
        }
        var timeCount = 0; 
        //var timeCount = 0; 
          
        for(var k = 0; k < this.weeklyBookings.length; k++){
          //console.log("HERE: ");
          //console.log("lalalala" + this.weeklyBookings.length);
          var y = new Date(this.weeklyBookings[k].date);

          var currentDate = moment(this.weeklyBookings[k].date, 'YYYY-MM-DDTHH:mm:ss.SSSSZ');
          // var currentDate = moment(y)
          //console.log(currentDate);
          //console.log("K = " + k);
          var dayNumber = currentDate.day();
          //console.log("day num: " + dayNumber);
          //console.log(dayNumber);
          var dayStart =  moment().add(this.currentWeek, 'weeks').startOf('week').add(dayNumber, 'days').startOf('day').add(8.5, 'hours'); //get start of selected day
          //console.log(dayStart);
          timeCount = 0;
          //var timeCount = 0; //counter variable to get time slot number of selected time
  
            while(true){
              //console.log("Here" + moment().startOf('week').add(this.currentWeek, 'weeks').add(dayNumber, 'days').startOf('day').add(8.5, 'hours').add((timeCount*15), 'minutes').isBefore(moment(this.weeklyBookings[k].date)));
              if(moment(this.weeklyBookings[k].date).startOf('week').add(this.currentWeek, 'weeks').add(dayNumber, 'days').startOf('day').add(8.5, 'hours').add((timeCount*15), 'minutes').isSameOrBefore(this.weeklyBookings[k].date)){
                  timeCount = timeCount + 1;
                  //console.log("shit");
                  //console.log("Fuck ME: " + timeCount) //will give me slot number
              }
              else{
                 break;
              }
            }

            //console.log("endtimecount: " + timeCount);
          
            if(this.weeklyBookings[k].type== "normal"){
              var takenSlot = [("slot" + dayNumber + timeCount), ("slot" + dayNumber + (timeCount+1)), ("slot" + dayNumber + (timeCount+2)), ("slot" + dayNumber + (timeCount+3))]; //slot0{{i}}, slot1{{i}} ...etc
              this.currentlyFilled.push(takenSlot[0],takenSlot[1],takenSlot[2], takenSlot[3]);
              if((timeCount) > 33){
                if((timeCount) == 34){
                  document.getElementById(takenSlot[0]).setAttribute("class", "btn btn-sm taken chooseTime disabled");
                  document.getElementById(takenSlot[1]).setAttribute("class", "btn btn-sm taken chooseTime disabled");
                  document.getElementById(takenSlot[2]).setAttribute("class", "btn btn-sm taken chooseTime disabled");
                }else if((timeCount) == 35){
                  document.getElementById(takenSlot[0]).setAttribute("class", "btn btn-sm taken chooseTime disabled");
                  document.getElementById(takenSlot[1]).setAttribute("class", "btn btn-sm taken chooseTime disabled");
                }else{
                  document.getElementById(takenSlot[0]).setAttribute("class", "btn btn-sm taken chooseTime disabled");
                }
              }else{
                  document.getElementById(takenSlot[0]).setAttribute("class", "btn btn-sm taken chooseTime disabled");
                  document.getElementById(takenSlot[1]).setAttribute("class", "btn btn-sm taken chooseTime disabled");
                  document.getElementById(takenSlot[2]).setAttribute("class", "btn btn-sm taken chooseTime disabled");
                  document.getElementById(takenSlot[3]).setAttribute("class", "btn btn-sm taken chooseTime disabled");
              }
            }else if(this.weeklyBookings[k].type == "initial"){
              var takenSlot = [("slot" + dayNumber + timeCount), ("slot" + dayNumber + (timeCount+1)), ("slot" + dayNumber + (timeCount+2)), ("slot" + dayNumber + (timeCount+3)), ("slot" + dayNumber + (timeCount+4)), ("slot" + dayNumber + (timeCount+5))]; //slot0{{i}}, slot1{{i}} ...etc
              this.currentlyFilled.push(takenSlot[0],takenSlot[1],takenSlot[2], takenSlot[3],takenSlot[4], takenSlot[5]);
              if((timeCount) > 31){
                  if((timeCount) == 32){
                    document.getElementById(takenSlot[0]).setAttribute("class", "btn btn-sm taken chooseTime disabled");
                    document.getElementById(takenSlot[1]).setAttribute("class", "btn btn-sm taken chooseTime disabled");
                    document.getElementById(takenSlot[2]).setAttribute("class", "btn btn-sm taken chooseTime disabled");
                    document.getElementById(takenSlot[3]).setAttribute("class", "btn btn-sm taken chooseTime disabled");
                    document.getElementById(takenSlot[4]).setAttribute("class", "btn btn-sm taken chooseTime disabled");
                   }
                   else if((timeCount) == 33){
                    document.getElementById(takenSlot[0]).setAttribute("class", "btn btn-sm taken chooseTime disabled");
                    document.getElementById(takenSlot[1]).setAttribute("class", "btn btn-sm taken chooseTime disabled");
                    document.getElementById(takenSlot[2]).setAttribute("class", "btn btn-sm taken chooseTime disabled");
                    document.getElementById(takenSlot[3]).setAttribute("class", "btn btn-sm taken chooseTime disabled");
                   }
                    else if((timeCount) == 34){
                      document.getElementById(takenSlot[0]).setAttribute("class", "btn btn-sm taken chooseTime disabled");
                      document.getElementById(takenSlot[1]).setAttribute("class", "btn btn-sm taken chooseTime disabled");
                      document.getElementById(takenSlot[2]).setAttribute("class", "btn btn-sm taken chooseTime disabled");
                    }else if((timeCount) == 35){
                    document.getElementById(takenSlot[0]).setAttribute("class", "btn btn-sm taken chooseTime disabled");
                    document.getElementById(takenSlot[1]).setAttribute("class", "btn btn-sm taken chooseTime disabled");
                    }else{
                      document.getElementById(takenSlot[1]).setAttribute("class", "btn btn-sm taken chooseTime disabled");
                    }
                  }else{
                      document.getElementById(takenSlot[0]).setAttribute("class", "btn btn-sm taken chooseTime disabled");
                      document.getElementById(takenSlot[1]).setAttribute("class", "btn btn-sm taken chooseTime disabled");
                      document.getElementById(takenSlot[2]).setAttribute("class", "btn btn-sm taken chooseTime disabled");
                      document.getElementById(takenSlot[3]).setAttribute("class", "btn btn-sm taken chooseTime disabled");
                      document.getElementById(takenSlot[4]).setAttribute("class", "btn btn-sm taken chooseTime disabled");
                      document.getElementById(takenSlot[5]).setAttribute("class", "btn btn-sm taken chooseTime disabled");
                  }





            }else if(this.weeklyBookings[k].type == "timeoff"){ //for booked off time slot
              
              var startTO = moment(new Date(this.weeklyBookings[k].date), 'YYYY-MM-DDTHH:mm:ss.SSSSZ').toISOString();
              //console.log("start TO: " + startTO);
              var endTO = moment(new Date(this.weeklyBookings[k].endDate), 'YYYY-MM-DDTHH:mm:ss.SSSSZ').toISOString();
              var beginningOfWeek = new Date();
              var forBOW = moment(beginningOfWeek,'YYYY-MM-DDTHH:mm:ss.SSSSZ').add(this.currentWeek, 'weeks').startOf('week').startOf('day').add(8.5, 'hours');
              var endOfWeek = new Date();
              var forEOW = moment(endOfWeek, 'YYYY-MM-DDTHH:mm:ss.SSSSZ').add(this.currentWeek, 'weeks').endOf('week').startOf('day').add(17.5, 'hours');
              var dayRange = 0;
              var bookedTO = 0;
              var unusedNight = 60;
              var upToCount = 0;

              //this is okay              
              while(moment(startTO).add(dayRange, 'days').isBefore(moment(endTO))){
                dayRange = dayRange + 1;
              }
              //console.log("THIS BOOKING SPANS: " + dayRange); 

              var test = moment(forBOW);

              while(moment(test).isBefore(moment(startTO))){
                test = moment(test).add((upToCount*15), 'minutes');
                //console.log("test" + test);
                //console.log(upToCount);
                upToCount = upToCount + 1;
              }


              //this.startCount = (this.startCount - ((dayRange-1)*unusedNight));
              //console.log("SLOTS BEFORE GREY: " + upToCount);
              
              var test2 = moment(startTO);


              while(moment(test2).isBefore(moment(endTO))){
                test2 = moment(test2).add((bookedTO*15), 'minutes');
                bookedTO = bookedTO + 1;
              }


              //console.log("SLOTS RESERVED FOR GREY TIME OFF: " + bookedTO)
             

              if(moment(startTO).isBefore(moment(forBOW))){
                startTO = moment(forBOW).toISOString();
              }

              if(moment(endTO).isAfter(moment(forBOW, 'YYYY-MM-DDTHH:mm:ss.SSSSZ'))){
                endTO = moment(forEOW).toISOString();
              }

              var tempP = 0;
              var firstLine = true;
              var forTimeOffSlot = " ";
              var tempDayNumber = dayNumber;

              for(var p = 0; p < bookedTO; p++){
                if(firstLine){
                  if((upToCount + tempP) < 37){
                    var slotty = (upToCount + tempP - 2);
                    forTimeOffSlot = ("slot"+dayNumber+slotty);
                    tempP = tempP + 1;
                  }
                  if((upToCount + tempP) == 36){
                    var slotty = (upToCount + tempP - 2);
                    forTimeOffSlot = ("slot"+dayNumber+slotty);
                    firstLine = false;
                    tempP = 0;
                    tempDayNumber = tempDayNumber + 1;
                  }
                }else if(!(firstLine)){
                  if((tempP) < 36){
                    var slotty = (tempP);
                    forTimeOffSlot = ("slot"+tempDayNumber+slotty);
                    tempP = tempP + 1;
                  }
                  if((tempP) == 36){
                    var slotty = (tempP);
                    forTimeOffSlot = ("slot"+tempDayNumber+slotty);
                    tempP = 0;
                    tempDayNumber = tempDayNumber + 1;
                  }
                }

                //console.log(takenSlot[0]);
                this.currentlyFilled.push(forTimeOffSlot);
                document.getElementById(forTimeOffSlot).setAttribute("class", "btn btn-sm taken chooseTime disabled");
              }

            }


            if(!(this.isStart) && (this.currentWeek == this.selectedWeek)){
              //this is for setting the currently selected
              if(this.currentType == "normal"){
                if((this.timeIndex) > 33){
                  if((this.timeIndex) == 34){
                    document.getElementById(this.reHighlight[0]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
                    document.getElementById(this.reHighlight[1]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
                    document.getElementById(this.reHighlight[2]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
                  }else if((this.timeIndex) == 35){
                    document.getElementById(this.reHighlight[0]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
                    document.getElementById(this.reHighlight[1]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
                  }else{
                  document.getElementById(this.reHighlight[0]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
                  }
                }else{
                    document.getElementById(this.reHighlight[0]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
                    document.getElementById(this.reHighlight[1]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
                    document.getElementById(this.reHighlight[2]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
                    document.getElementById(this.reHighlight[3]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
                }
              }else if(this.currentType == 'initial'){
                if((this.timeIndex) > 31){
                  if((this.timeIndex) == 32){
                    document.getElementById(this.reHighlight[0]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
                    document.getElementById(this.reHighlight[1]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
                    document.getElementById(this.reHighlight[2]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
                    document.getElementById(this.reHighlight[3]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
                    document.getElementById(this.reHighlight[4]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
                  }
                  else if((this.timeIndex) == 33){
                    document.getElementById(this.reHighlight[0]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
                    document.getElementById(this.reHighlight[1]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
                    document.getElementById(this.reHighlight[2]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
                    document.getElementById(this.reHighlight[3]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
                  }
                  else if((this.timeIndex) == 34){
                    document.getElementById(this.reHighlight[0]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
                    document.getElementById(this.reHighlight[1]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
                    document.getElementById(this.reHighlight[2]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
                  }else if((this.timeIndex) == 35){
                    document.getElementById(this.reHighlight[0]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
                    document.getElementById(this.reHighlight[1]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
                  }else{
                    document.getElementById(this.reHighlight[1]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
                  }
                }else{
                  document.getElementById(this.reHighlight[0]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
                  document.getElementById(this.reHighlight[1]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
                  document.getElementById(this.reHighlight[2]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
                  document.getElementById(this.reHighlight[3]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
                  document.getElementById(this.reHighlight[4]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
                  document.getElementById(this.reHighlight[5]).setAttribute("class", "btn btn-sm btn-yellow chooseTime");
                }
              }
     
          } 
            
        }//for
    });
    
  }
  
  
  
  
  
  
  
  
  
  
  





















  nextWeek(){ //function for when they click the next button -- this works perfectly
    this.currentWeek = this.currentWeek + 1; 
    
    this.weekToFill = moment().add(this.currentWeek, 'weeks').startOf('week').add(1, 'day').toDate();;
    //console.log(this.weekToFill);
    
    this.dateSelected = moment().add(this.currentWeek, 'weeks').startOf('week').format('LL') + " - " + moment().add(this.currentWeek, 'weeks').endOf('week').format('LL');
    
  }

  
  prevWeek(){ //function for the previous button -- also works perfectly
    if((this.currentWeek) === 0){
      return;
    }else{
      this.currentWeek = this.currentWeek - 1;
      this.weekToFill = moment().add(this.currentWeek, 'weeks').startOf('week').add(1, 'day').toDate();
      this.dateSelected = moment().add(this.currentWeek, 'weeks').startOf('week').format('LL') + " - " + moment().add(this.currentWeek, 'weeks').endOf('week').format('LL');
    }
  }
  
  //we ended up taking this feature out to simplify the user exp.
  //this is the function ive made for submitting a selection
  // saveAppointment(){
  //   if(this.isSelected){
  //     //keep the selected values to store in the database
  //     this.isSaved = true;
  //     //this.currentlySaved = this.temp;
  //     this.isStart = false;
  //   }
  //   else{
  //     console.log("Cannot save without booking");
  //   }
  // }
}
