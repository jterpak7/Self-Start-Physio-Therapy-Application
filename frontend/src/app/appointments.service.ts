import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Response } from '@angular/http';
import * as moment from 'moment';
import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';


@Injectable()
export class AppointmentsService {

  newType: any;
  newDate: Date;
  endDate: Date;
  newPatient: any;
  newOther: any;
  newReason: any;
  currentPatientId: any; //set a method to set this equal to current user

  constructor(private httpClient: HttpClient) { }
  
  GetAllAppointments(){
      var url = '/api/appointment';
      return this.httpClient.get(url);
  }
  
  GetAppointmentsByWeek(week: any){
    var url = '/api/appointment/week/' + moment(week).toISOString();
    return this.httpClient.get(url);
  }
  
  GetAppointmentsByMonth(month: any){
    var url = '/api/appointment/month/'+ month;
    return this.httpClient.get(url); 
  }

  GetPatientNames(apptID: any){
    var url = '/api/patient/appointments/calInfo/' + apptID;
    return this.httpClient.get(url);
  }
  
  
  AddAppointment(patient: any, reason: string, other: string): any{
    
      var body = {
          date: this.newDate,
          reason: reason,
          other: other,
          type: this.newType,
          patient: patient
          
          //This is where we have to link to images************
          // images: images
      }
      
      var url = '/api/appointment';
      return this.httpClient.post(url, body);
  }
  
  setType(type: string){
    this.newType = type;
  }
  
  getType(){
    return this.newType;
  }
  
  setNewDate(mydate: any){
    this.newDate = mydate;
    //new Date(mydate.toISOString());

    // moment(date).format("MMMM Do YYYY, h:mm:ss a");
  }
  
  // getDate(){
  //   return this.newDate;
  // }

  GetAppointmentsByPatientID(patientID: string) {
    var url = '/api/appointment/client/appointments/' + patientID;
    return this.httpClient.get(url);
  }

  saveTimeOff(startDate: Date, endDate: Date, startHour: any, startMin: any, endHour: any, endMin: any){

    var sDate: any = moment(startDate).startOf('day').add((startHour-4), 'hours').startOf('hour').add(startMin, 'minutes').startOf('minute').toISOString();
    var eDate: any = moment(endDate).startOf('day').add((endHour-4), 'hours').startOf('hour').add(endMin, 'minutes').startOf('minute').toISOString();

    var body = {
      date: sDate,
      type: "timeoff",
      endDate: eDate
      
      //This is where we have to link to images************
      // images: images
  }

    var url = '/api/appointment/timeoff';
    return this.httpClient.post(url, body);
  }

}
