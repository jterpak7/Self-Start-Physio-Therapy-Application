import { Component, OnInit } from '@angular/core';
import { PatientService } from '../patient.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {

  constructor(private patientService: PatientService,
              private cookieService: CookieService) {}

  client: any;
  timeOfDay: any;
  today: any;

  ngOnInit() {
    this.timeOfDay = this.getTimeOfDay();
    //this.cookieService.set('stupidID', "5ab0007926bba10fad373817");
    this.patientService.GetPatientInfo(this.cookieService.get('ID')).subscribe(data =>{
      var obj: any = data;
      obj = obj.patient;
      this.client = obj;
    })
  }

  getTimeOfDay(): string{
    this.today = new Date();
    var hour = this.today.getHours();
    if(hour < 13 && hour >= 0){ return "Morning"}
    if(hour < 17){ return "Afternoon"}
    else{ return "Evening"};
  }

}
