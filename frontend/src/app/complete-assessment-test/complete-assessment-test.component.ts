import { Component, OnInit } from '@angular/core';
import { AssessmentTestService } from '../assessment-test.service'
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { PatientService } from '../patient.service';
import { RehabPlansService } from '../rehab-plans.service';

@Component({
  selector: 'app-complete-assessment-test',
  templateUrl: './complete-assessment-test.component.html',
  styleUrls: ['./complete-assessment-test.component.css'],
  providers: [NgbRatingConfig]
})
export class CompleteAssessmentTestComponent implements OnInit {

  timeOfDay: string;
  assessmentTest: any;
  assessmentTestQuestions: any[];
  testLength: Number;
  MCAnswers: any[];
  today: Date;
  client: any;
  clientName: any;
  appointments: any;
  currPlan: any;
  currTest: any;

  constructor(private assessmentTestService: AssessmentTestService,
              private config: NgbRatingConfig,  
              private modalService: NgbModal,
              private cookieService: CookieService,
              private patientService: PatientService,
              private planService: RehabPlansService) {
               }

  ngOnInit() {
    this.timeOfDay = this.getTimeOfDay();
    this.client = this.patientService.GetPatientInfo(this.cookieService.get('ID')).subscribe(data =>{
      var obj: any = data;
      obj = obj.patient;
      this.client = obj;
      this.currPlan = this.client.rehabPlan;
      this.planService.GetCurrentAssesmentTest(obj.rehabPlan._id).subscribe(data =>{
        let obj: any = data;
        this.assessmentTest = [];
        obj.rehabPlan.assessmentTests.forEach(element => {
          if(element.completed === false){
            this.assessmentTest.push(element)
          }
        });
        this.currTest = this.assessmentTest[0];
        this.assessmentTestQuestions = this.assessmentTest[0].questions;
        this.testLength = this.assessmentTestQuestions.length;
      })
    })

    this.value = [];
    // this.assessmentTestService.GetPlans().subscribe(data => {
    //   var retObj: any = data;
    //   console.log(retObj);
    //   this.assessmentTest = retObj.assessmentTest[3];
    //   this.assessmentTestQuestions = this.assessmentTest.questions;
    //   this.testLength = this.assessmentTestQuestions.length;
    // })

    this.MCAnswers = [];

  }

  RadioButtonClicked(content: string, i) {
    this.MCAnswers[i] = content;
  }

  value: any[];
  SendBack(i) {
    
    this.MCAnswers[i] = this.value[i] + 1;
  }

  Open(modal) {
    this.modalService.open(modal, {size: 'lg'});
  }

  SubmitAnswers() {
    for(var i = 0; i < this.testLength; i++) {
      var question = "question" + i;
      var element: any = document.getElementById(question);
      var questionCode = this.assessmentTestQuestions[i].questionCode;
      if(questionCode == "SA") {
        this.assessmentTestQuestions[i].answer = element.value;
      }
      if(questionCode == "MC") {
        this.assessmentTestQuestions[i].answer = this.MCAnswers[i];
      }
      if(questionCode == "RA") {
        this.assessmentTestQuestions[i].answer = this.MCAnswers[i];
      }
    }
      var userID = this.cookieService.get('ID');
      this.assessmentTestService.CreateCompletedTest(userID, this.assessmentTest.name, this.assessmentTest.description, this.assessmentTestQuestions).subscribe(data => {
      })
  }

  NumToChar(n) {
    var ch = String.fromCharCode(97 + n);
    return ch;
  }

  getTimeOfDay(): string{
    this.today = new Date();
    var hour = this.today.getHours();
    if(hour < 13 && hour >= 0){ return "Morning"}
    if(hour < 17){ return "Afternoon"}
    else{ return "Evening"};
  }

}
