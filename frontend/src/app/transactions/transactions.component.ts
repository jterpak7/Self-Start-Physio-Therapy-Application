import { Component, OnInit } from '@angular/core';
import { RehabPlansService } from '../rehab-plans.service';
import { CookieService } from 'ngx-cookie-service';
import { PatientService } from '../patient.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { PaymentService } from '../payment.service';
import { UserAccountsService } from '../user-accounts.service';

declare let paypal: any;

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  timeOfDay: string;
  today: Date;
  client: any;
  clientName: any;
  paymentAmount: any = '0';
  rendered: boolean = false;
  currContent: any;
  payments: any;

  constructor(private patientService: PatientService,
              private cookieService: CookieService,
              private planService: RehabPlansService,
              private modalService: NgbModal,
              private paymentService: PaymentService,
              private accountService: UserAccountsService) { }

  ngOnInit() {
    this.timeOfDay = this.getTimeOfDay();
    this.client = this.patientService.GetPatientInfo(this.cookieService.get('ID')).subscribe(data =>{
      var obj: any = data;
      obj = obj.patient;
      this.client = obj;
    })

    this.paymentService.GetPaymentHistory(this.cookieService.get('ID')).subscribe(data =>{
      let obj: any = data;
      this.payments = obj.payments;
    })
  }

  getTimeOfDay(): string{
    this.today = new Date();
    var hour = this.today.getHours();
    if(hour < 13 && hour >= 0){ return "Morning"}
    if(hour < 17){ return "Afternoon"}
    else{ return "Evening"};
  }

  open(content: any, amount: string) {
    content.show();
    if(amount === '550'){
      this.paymentAmount = '550';
    }
    if(amount === '350'){
      this.paymentAmount = '350';
    }
    if(amount === '150'){
      this.paymentAmount = '150';
    }
    if(amount === '75'){
      this.paymentAmount = '75';
    }
    if(!this.rendered){
      this.rendered = true;
      paypal.Button.render(this.paypalConfig, '#paypal-button-container');
    }
  }

  paypalConfig: any =  {
    env: 'sandbox', // sandbox | production
    // Paypal custom styling
    style: {
      label: 'paypal',
      size:  'medium',    // small | medium | large | responsive
      shape: 'rect',     // pill | rect
      color: 'blue',     // gold | blue | silver | black
      tagline: false    
    },
    // PayPal Client IDs - replace with your own
    client: {
      sandbox: 'ASewACzIceIwQug016WZc-thKQg4RWSSY_eZFOjAzKB9bu3Cw2u0CogzKktitI8jQ7AJN3zmuyrXAxRP',
      //this is where Stephanie's paypal will go
      production: ''
    },
    // Show the buyer a 'Pay Now' button in the checkout flow
    commit: true,
    // payment() is called when the button is clicked
    payment: (data, actions) => {
    // Make a call to the REST api to create the payment
      return actions.payment.create({
        payment: {
          transactions: [{ amount: { total: this.paymentAmount, currency: 'CAD' }}]
        }
      });
    },
    // onAuthorize() is called when the buyer approves the payment
    onAuthorize: (data, actions) => {
      // Make a call to the REST api to execute the payment
      return actions.payment.execute().then((data) => {
        this.StorePayment(data);
      })
    },

    onError: function(err, actions){
      if (err === 'INSTRUMENT_DECLINED') {
        window.alert("They Payment Method Was Declined, Please Try Again.");
      }
      console.log(err);
    }
  }

  StorePayment(data: any){
    if(data.state === "approved"){
      this.paymentService.StorePayment(data, this.cookieService.get('ID')).subscribe(data => {
        document.getElementById('closeModal').click();
        this.paymentService.GetPaymentHistory(this.cookieService.get('ID')).subscribe(data =>{
          let obj: any = data;
          this.payments = obj.payments;
        })
        let count1, count2: number = 0;
        if(this.paymentAmount === '550') { count1 = 6; count2 = 1};
        if(this.paymentAmount === '350') { count1 = 3; count2 = 1};
        if(this.paymentAmount === '150') { count2 = 1;};
        if(this.paymentAmount === '75')  { count1 = 1;};
        this.accountService.SetAppointmentCounter(this.cookieService.get('ID'), count1, count2).subscribe(data =>{
        })
      })
      return;
    }
    window.alert("Something went wrong, please try again. You will not be charged for the amount.")
  }

}
