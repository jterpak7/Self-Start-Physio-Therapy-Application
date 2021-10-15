import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { PhysioHomeService } from '../physio-home.service';
import { ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators/map';
import { AppointmentsService } from '../appointments.service';
import { Subject } from 'rxjs/Subject';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { CalendarEvent,
         CalendarEventAction,
         CalendarEventTimesChangedEvent
} from 'angular-calendar';
import {
  isSameMonth,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  addHours,
  subDays,
  addDays,
  format
} from 'date-fns';
import { CookieService } from 'ngx-cookie-service';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { PatientService } from '../patient.service';
import { PhysiotherapistService } from '../physiotherapist.service';


@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css', '../../../node_modules/angular-calendar/css/angular-calendar.css'],
  providers: [PhysioHomeService, AppointmentsService],
  encapsulation: ViewEncapsulation.None
})

export class CalendarComponent implements OnInit {
  @ViewChild('modalContent') modalContent: any;
  @ViewChild('deleteModal') deleteModal: any;
  /*@ViewChild('editModal') editModal: any;*/
  
  view: string = 'month';
  viewDate: Date = new Date();

  time: NgbTimeStruct = {hour: 8, minute: 30, second: 0};
  timeTwo: NgbTimeStruct = {hour: 5, minute: 30, second: 0};
  hourStep = 1;
  minuteStep = 15;
  secondStep = 0;
  meridian = true;
  meridianTwo = true;
  justBooked = false;
  myTabIndex = 0;
  newTitle: any;
  
  activeDayIsOpen: boolean = false;
  myAppointmentDates: Object[];
  myAppointments: Observable<Array<CalendarEvent<{ appointment: any }>>>;
  
  events$: Observable<Array<CalendarEvent<{ appointment: any }>>>;
  subscription: any;
  events: CalendarEvent[];
  today: any;
  physio: any;
  newClientName: any;
  myDate: Date;
  newType: any;
  newReason: any;
  timeOfDay: any;
  apptName: any;
  apptDate: any;
  apptType: any;
  apptReason: any;
  dUser: any;
  dType: any;
  
  colors: any = {
    red: {
      primary: '#ad2121',
      secondary: '#FAE3E3'
    },
    blue: {
      primary: '#1e90ff',
      secondary: '#D1E8FF'
    },
    yellow: {
      primary: '#e3bc08',
      secondary: '#FDF1BA'
    }
  };
  
  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
      /*label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.editEvent('Edited', event);
      }
    },*/
    {
      label: '<i class="fa fa-fw fa-times" (click)="open(deleteModal)"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.deleteEvent('Deleted', event);
      }
    }
  ];
  
  refresh: Subject<any> = new Subject();
  
  constructor(private router: Router, 
              private http: HttpClient, 
              private physioHomeService: PhysioHomeService,
              private apptService: AppointmentsService,
              private modalService: NgbModal,
              private cookieService: CookieService,
              private patientService: PatientService, 
              private physioService: PhysiotherapistService) { 
                setInterval(() => {
                  this.today = new Date();
                }, 30000);  
                this.events$ = new Observable<Array<CalendarEvent<{ appointment: any }>>>();
                this.events = [];
              }
  
  ngOnInit() {
    this.fetchEvents();

    
    this.timeOfDay = this.getTimeOfDay();
    this.physioService.GetPhysioByUserID().subscribe(data =>{
      let obj: any = data;
      this.physio = obj.physio;
    })

  }
  
   fetchEvents(){
    const getStart: any = {
      month: startOfMonth,
      week: startOfWeek,
      day: startOfDay
    }[this.view];

    const getEnd: any = {
      month: endOfMonth,
      week: endOfWeek,
      day: endOfDay
    }[this.view];

    var cur: any = moment(this.viewDate).startOf('month').add(1, 'day').toISOString();
    
    this.events$ = this.apptService.GetAppointmentsByMonth(cur)
    .pipe(map(({appointment}: {appointment: any[]}) => {

      var newTitle: string;

        return appointment.map((appointment: any) => {
          
        
          var returnVal = this.apptService.GetPatientNames(appointment.userID).subscribe((data) => {
            var retObj: any = data;
           
            if(appointment.type == "normal"){
              newTitle = "Client: " + (retObj.patient.givenName) + " " + (retObj.patient.familyName); + " | Time: " + (appointment.date) + " | Type: Normal";
            }else if (appointment.type == "initial"){
              newTitle = "Client: " + (retObj.patient.givenName) + " " + (retObj.patient.familyName); + " | Time: " + (appointment.date) + " | Type: Initial";
            }
            else{
              newTitle = "TIME OFF";
            }
          });


          let temp: CalendarEvent = {
          title: "",
          start: new Date(appointment.date),
          color: this.colors.blue,
          actions: this.actions,
          meta: {
            appointment: appointment
          }
        };

        this.patientService.GetPatientInfo(temp.meta.appointment.userID).subscribe(data =>{
          let obj: any = data;
          temp.title = obj.patient.givenName + " " + obj.patient.familyName /*+ " | " + temp.start.getHours() + ":" + temp.start.getMinutes()*/;
        })

        this.events.push(temp);
        return temp;
        });
      })
    );

    }
    
    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
      if (isSameMonth(date, this.viewDate)) {
        if (
          (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
          events.length === 0
        ) {
          this.activeDayIsOpen = false;
        } else {
          this.activeDayIsOpen = true;
          this.viewDate = date;
        }
      }
    }

    eventTimesChanged({
      event,
      newStart,
      newEnd
    }: CalendarEventTimesChangedEvent): void {
      event.start = newStart;
      event.end = newEnd;
      this.handleEvent('Dropped or resized', event);
      this.refresh.next();
    }
  
    handleEvent(action: string, event: CalendarEvent): void {
      //this.modalService.open(this.deleteModal, { size: 'lg' });
    }
    
    /*editEvent(action: string, event: CalendarEvent) {
      this.modalService.open(this.editModal, { size: 'lg' });
    }*/
    
    deleteEvent(action: string, event: CalendarEvent) {
      this.dUser = event.meta.appointment.userID;
      this.dType = event.meta.appointment.type;
      this.patientService.GetPatientInfo(event.meta.appointment.userID).subscribe(data =>{
        let obj: any = data;
        this.physioHomeService.emailAddress = obj.patient.email;
        this.physioHomeService.clientName = obj.patient.givenName;
      })
      this.physioHomeService.deleteDate = event.start;
      this.modalService.open(this.deleteModal, { size: 'lg' });
    }
    
     eventClicked(event: CalendarEvent<{ appointment: any }>): void {
      this.patientService.GetPatientInfo(event.meta.appointment.userID).subscribe(data =>{
        let obj: any = data;
        this.apptName = obj.patient.givenName + " " + obj.patient.familyName;
        })
        
      this.apptDate = event.meta.appointment.date;
      this.apptType = event.meta.appointment.type;
      this.apptReason = event.meta.appointment.reason;

      this.modalService.open(this.modalContent, { size: 'lg' });
    }
    
    open(content) {
      this.modalService.open(content, {size: "lg"});
    }
   
    
    deleteAppt() {
      if(this.dType == "normal"){
              this.physioHomeService.NormalAppt(this.dUser);
            }else if (this.dType == "initial"){
              this.physioHomeService.InitialAppt(this.dUser);
            }
      this.physioHomeService.DeleteAppointment().subscribe(data => {
      });
      this.physioHomeService.SendEmail().subscribe(data => {
      });
    }
    
    addEvent(): void {
      this.events.push({
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: this.colors.red,
        draggable: false,
        resizable: {
          beforeStart: true,
          afterEnd: true
        }
      });
      this.refresh.next();
    }
    
    getTimeOfDay(): string{
      this.today = new Date();
      var hour = this.today.getHours();
      if(hour < 13 && hour >= 0){ return "Morning"}
      if(hour < 17){ return "Afternoon"}
      else{ return "Evening"};
    }

    saveTimeOff(startDate: Date, endDate: Date){
      this.apptService.saveTimeOff(startDate, endDate, this.time.hour, this.time.minute, this.timeTwo.hour, this.timeTwo.minute).subscribe(data => {

        this.justBooked = false;
      });
    }
    
}