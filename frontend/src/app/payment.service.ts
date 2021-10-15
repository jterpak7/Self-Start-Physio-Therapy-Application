import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class PaymentService {

  constructor( private httpClient: HttpClient ) { }

  StorePayment(paypalObj: any, patientID: string): any{
    var body = {
      dayTimeStamp: paypalObj.create_time,
      amount: paypalObj.transactions[0].amount.total,
      note: "Paypal ID is: " + paypalObj.id,
      patient: patientID
    }
    var url = '/api/payments'
    return this.httpClient.post(url, body);
  }

  GetPaymentHistory(id: string){
    var url = '/api/payments/getpayments/' + id;
    return this.httpClient.get(url);
  }

}
