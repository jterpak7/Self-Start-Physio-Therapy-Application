import { Component, OnInit } from '@angular/core';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { DpDatePickerModule } from 'ng2-date-picker';
//import { IMyOptions } from '../../node_modules/angular4-datepicker/src/my-date-picker/index';


@Component({
  selector: 'app-time-off',
  templateUrl: './time-off.component.html',
  styleUrls: ['./time-off.component.scss'],
})
export class TimeOffComponent implements OnInit {

  spinners = true;

  startTime: NgbTimeStruct = {hour: 13, minute: 30, second: 0};
  endTime: NgbTimeStruct = {hour: 13, minute: 30, second: 0};
  hourStep = 1;
  minuteStep = 15;
  secondStep = 0;

  constructor() {
   
  }

  ngOnInit() {
    
  }
  
  
}


