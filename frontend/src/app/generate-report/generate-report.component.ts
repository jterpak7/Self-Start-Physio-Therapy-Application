import { PatientService } from '../patient.service';
import { ActivatedRoute, Router} from '@angular/router';
import * as moment from 'moment';
import { PaymentService } from '../payment.service'
import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AssessmentTestService } from '../assessment-test.service';
import { EmailService } from '../email.service'
import * as jsPDF from 'jspdf';
import { AppointmentsService } from '../appointments.service';

@Component({
  selector: 'app-generate-report',
  templateUrl: './generate-report.component.html',
  styleUrls: ['./generate-report.component.scss']
})

export class GenerateReportComponent implements OnInit {

  patient: any = {};
  paymentHistory: any;
  appointments: any;
  initialInjury: any;
  finalOutcome: any;
  rehabPlan: any;

  @ViewChild('test') test: ElementRef;
  @ViewChild('test2') test2: ElementRef;

  constructor(private patientService: PatientService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private paymentService: PaymentService, 
              private cookieService: CookieService,
              private assessmentService: AssessmentTestService,
              private emailService: EmailService,
              private appointmentService: AppointmentsService) { }

  
  currClient: any;
  textAreaVal: string = "";
  chartType: string = 'line';
  chartDatasets: Array<any>;
  // = [
  //   {data: [0, 2, 3, 3, 5, 7, 8, 9], label: 'Physio Rating'},
  //   {data: [0, 4, 4, 5, 6, 6, 8, 10], label: 'Patient Rating'}
  // ];
  physioRatings: Array<number> = [];
  clientRatings: Array<number> = [];
  assesmentDates: Array<any> = [];
  chartLabels: Array<any> = [];

  chartColors: Array<any> = [
    {
        backgroundColor: 'rgba(220,220,220,0.2)',
        borderColor: 'rgba(220,220,220,1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(220,220,220,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(220,220,220,1)'
    },
    {
        backgroundColor: 'rgba(151,187,205,0.2)',
        borderColor: 'rgba(151,187,205,1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(151,187,205,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(151,187,205,1)'
    }
  ];

  private chartOptions:any = { 
    responsive: true 
  }
  patient2: any;
  completedTests: any[] = [];
  singleTest: any;

  ngOnInit() {
    var patientID = this.activatedRoute.snapshot.paramMap.get("id");
    this.patientService.GetPatientByPatientID(patientID).subscribe(data => {
      var retObj: any = data;
      this.patient = retObj.patient;
      this.rehabPlan = this.patient.rehabPlan;
      this.assessmentService.GetCompletedTests(this.patient.account._id).subscribe(data =>{
        let obj: any = data;
        this.completedTests = obj.completedTests;
        if(this.completedTests.length > 1){
          this.completedTests.forEach(element =>{
            this.physioRatings.push(element.physioRate);
            let obj: string = element.dateCompleted;
            obj = obj.split('T')[0];
            this.assesmentDates.push(obj);
            this.clientRatings.push(element.questions[0].answer);
          })
          this.physioRatings.unshift(0);
          this.assesmentDates.unshift('Start of Time');
          this.clientRatings.unshift(0);
    
          //set the chart datasets
          this.chartDatasets = [
            {data: this.physioRatings, label: "Physio Ratings"},
            {data: this.clientRatings, label: "Client Ratings"}
          ];
          this.chartLabels = this.assesmentDates;
  
          return;
        }
  
        this.singleTest == this.completedTests;
      })
      this.assessmentService.GetUsersInitialInjuries(this.patient.account._id).subscribe(data => {
        var retObj: any = data;
        this.initialInjury = retObj.intakes[0];
        this.assessmentService.GetFinalResults(userID, this.initialInjury.injuryNumber).subscribe(data => {
          var retObj: any = data;
          if(retObj.success) {
            this.finalOutcome = retObj.results;
          }
          else {
            this.finalOutcome = null;
          }
        })
      })
      this.appointmentService.GetAppointmentsByPatientID(this.patient.account._id).subscribe(data => {
        var retObj: any = data;
        this.appointments = retObj.appointments;
      })
      this.paymentService.GetPaymentHistory(this.patient.account._id).subscribe(data => {
        var retObj: any = data;
        this.paymentHistory = retObj.payments;
      })
      
    })
    var userID = this.cookieService.get('ID');

    this.paymentService.GetPaymentHistory(userID).subscribe(data => {
      var retObj: any = data;
      this.paymentHistory = retObj.payments;
    })

    this.assessmentService.GetUsersInitialInjuries(userID).subscribe(data => {
      var retObj: any = data;
      this.initialInjury = retObj.intakes[0];
      this.assessmentService.GetFinalResults(userID, this.initialInjury.injuryNumber).subscribe(data => {
        var retObj: any = data;
        if(retObj.success) {
          this.finalOutcome = retObj.results;
        }
        else {
          this.finalOutcome = null;
        }
      })
    })
    

    

  }

  CalculateAge(DOB: string) {
    var years = moment().diff(DOB, 'years');
    return years;
  }
  @ViewChild('summarytest') summarytest: ElementRef;

  chartClicked(e: any): void { 
  } 

  chartHovered(e: any): void {  
  }

  PrintReport(){
    let doc = new jsPDF();

    let specialElementHandlers = {
      '#editor': function(element, renderer){
        return true;
      }
    }

    let content = this.test.nativeElement;

    doc.fromHTML(content.innerHTML, 15, 15, {
      'width': 180,
      'elementHandlers': specialElementHandlers
    });

    doc.save(this.patient.familyName + "_" + this.patient.givenName + ".pdf");

  }

  EmailReport(message: string){
    let doc = new jsPDF();
    
        let specialElementHandlers = {
          '#editor': function(element, renderer){
            return true;
          }
        }
    
        let content = this.test.nativeElement;
    
        doc.fromHTML(content.innerHTML, 15, 15, {
          'width': 180,
          'elementHandlers': specialElementHandlers
        });

        let pdf = doc.output('datauristring');
        var pdfName = this.patient.familyName + "_" + this.patient.givenName + ".pdf"
    
        this.emailService.SendPDFToClient(pdf, this.patient.email, message, pdfName).subscribe(data => {
        })
  }

  GetTodaysDate() : Date {
    return new Date();
  }

  PrintPatientSummary() {
    let doc = new jsPDF();
    
    let specialElementHandlers = {
        '#editor': function(element, renderer){
            return true;
        }
      }

    let content = this.summarytest.nativeElement;
        
    doc.fromHTML(content.innerHTML, 15, 15, {
       'width': 180,
       'elementHandlers': specialElementHandlers
    });
    var pdfName = `${this.patient.givenName}${this.patient.familyName}-SummaryReport.pdf`;
    doc.save(pdfName);
  }

  EmailPatientSummary(toEmail: string, message: string) {
    let doc = new jsPDF();
    let specialElementHandlers = {
       '#editor': function(element, renderer){
        return true;
        }
    }
    
    let content = this.summarytest.nativeElement;
        doc.fromHTML(content.innerHTML, 15, 15, {
        'width': 180,
        'elementHandlers': specialElementHandlers
    });

    let pdf = doc.output('datauristring');
    
    var pdfName = `${this.patient.givenName}${this.patient.familyName}-SummaryReport.pdf`;
    this.emailService.SendPDFToClient(pdf, toEmail, message, pdfName).subscribe(data => {
    })
  }

}
