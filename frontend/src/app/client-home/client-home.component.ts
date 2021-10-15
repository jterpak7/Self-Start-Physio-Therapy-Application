import { Component, OnInit } from '@angular/core';
import { PatientService } from '../patient.service';
import { CookieService } from 'ngx-cookie-service';
import { RehabPlansService } from '../rehab-plans.service';
import { MatSnackBar } from '@angular/material';
import { UserAccountsService } from '../user-accounts.service';
import { AppointmentsService } from '../appointments.service';
import { ImageService } from '../image.service';
import * as moment from 'moment';

@Component({
  selector: 'app-client-home',
  templateUrl: './client-home.component.html',
  styleUrls: ['./client-home.component.scss']
})
export class ClientHomeComponent implements OnInit {

  timeOfDay: string;
  today: Date;
  client: any;
  clientName: any;
  appointments: any;
  currAppointment: any;
  currPlan: any;
  currTest: any;
  allTests: any;
  //currProgress: any = 69;
  completedTests: any;
  accountAge: any = 0;
  appointImages: any;

  constructor(private patientService: PatientService,
              private cookieService: CookieService,
              private planService: RehabPlansService,
              private snackBar: MatSnackBar,
              private accountService: UserAccountsService,
              private appointmentService: AppointmentsService,
              private imageService: ImageService) { }

  ngOnInit() {
    this.timeOfDay = this.getTimeOfDay();
    this.appointmentService.GetAppointmentsByPatientID(this.cookieService.get('ID')).subscribe(data =>{
       let obj: any = data;
       let now = moment(new Date()).toISOString();
       this.appointments = [];
       obj.appointments.forEach(element =>{
         if(element.date > now){
           this.appointments.push(element);
         }
       })
     })
    console.log(this.cookieService.get('ID'));
    //this.cookieService.set('stupidID', "5ab0007926bba10fad373817");
    this.patientService.GetPatientInfo(this.cookieService.get('ID')).subscribe(data =>{
      var obj: any = data;
      obj = obj.patient;
      this.client = obj;
      this.currPlan = this.client.rehabPlan;
      if(obj.rehabPlan == null) {
        return;
      }
      this.planService.GetCurrentAssesmentTest(obj.rehabPlan._id).subscribe(data =>{
        let obj: any = data;
        this.allTests = [];
        obj.rehabPlan.assessmentTests.forEach(element =>{
          if(element.completed === false){
            this.allTests.push(element);
          }
        })
        this.currTest = this.allTests[0];
        console.log('here');
        
      })
      
      
      
    })
  }

  getTimeOfDay(): string{
    this.today = new Date();
    var hour = this.today.getHours();
    if(hour < 13 && hour >= 0){ return "Morning"}
    if(hour < 17){ return "Afternoon"}
    else{ return "Evening"};
  }

  openSnackBar() {
    this.snackBar.open('Click the begin assessment button to get started.', "Ok");
  }

  AppointmentInfo(appointment: any, content){
    this.imageService.GetAppointmentImages(appointment._id).subscribe(data =>{
      let obj: any = data;
      this.appointImages = obj.images;
    })
    this.currAppointment = appointment;
    content.show();
  }


}
