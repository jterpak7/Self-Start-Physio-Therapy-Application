import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class PhysioHomeService {

  constructor(private http: HttpClient) { }
    emailAddress: string;
    clientName: string;
    deleteDate: Date;
    
    GetPhysio(id: string) {
      return this.http.get('api/physiotherapist/' + id);
    }
    GetAppointments(today: string) {
      return this.http.get('api/appointment/day/' + today);
    }
    NormalAppt(userid: string) {
      var body = {}
      return this.http.put('api/userAccount/appointments/normal/' + userid, body);
    }
    InitialAppt(userid: string) {
      var body = {}
      return this.http.put('api/userAccount/appointments/initial/' + userid, body);
    }
    DeleteAppointment() {
      return this.http.delete('api/appointment/' + this.deleteDate);
    }
    SendEmail() {
      var body = {
        toEmail: this.emailAddress,
        name: this.clientName,
        date: this.deleteDate
      }
      return this.http.post('api/email/appointment', body);
    }
}
