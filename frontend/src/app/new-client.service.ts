import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class NewClientService {

  constructor(private http: HttpClient) { }

  CreateClient(username: String, password: String, lastName: String, firstName: String, email: String, DOB: String, gender: string, postalCode: String, phone: String, others: String, country: string, province: string, city: string, address: string, salt: string) {
    var url = "/api/patient"
    var body = {
      username: username,
      encryptedPassword: password,
      ID: 0,
      familyName: lastName,
      givenName: firstName,
      email: email,
      DOB: DOB,
      gender: gender,
      postalCode: postalCode,
      phone: phone,
      others: others,
      country: country,
      province: province,
      city: city,
      address: address,
      salt: salt
    }

    return this.http.post(url, body);
  }

    CreateClientFromAdmin(username: String, password: String, lastName: String, firstName: String, email: String, DOB: String, gender: string, postalCode: String, phone: String, others: String, country: string, province: string, city: string, address: string, salt: string) {
    var url = "/api/patient/admincreated"
    var body = {
      username: username,
      encryptedPassword: password,
      ID: 0,
      familyName: lastName,
      givenName: firstName,
      email: email,
      DOB: DOB,
      gender: gender,
      postalCode: postalCode,
      phone: phone,
      others: others,
      country: country,
      province: province,
      city: city,
      address: address,
      salt: salt
    }

    return this.http.post(url, body);
  }


  SendToVerification(userID: String, email: String, firstName: string, lastName: string) {
    var url = "/api/temp";
    var body = {
      userID: userID,
      email: email,
      firstName: firstName,
      lastName: lastName
    }

    return this.http.post(url, body);
  }
  
  //NOTE: it will probably be a good idea to combine this with create client above. but for the 
  // sake of not messing up any one elses calls to that function, this is a temporary fix.
  // -jak.
  CreateClientWithPhysioAssigned(username: String, password: String, lastName: String, firstName: String, email: String, DOB: String, gender: string, postalCode: String, phone: String, others: String, country: string, province: string, city: string, physioID: string, address: string) {
    var url = "/api/patient"
    var body = {
      username: username,
      password: password,
      ID: 0,
      familyName: lastName,
      givenName: firstName,
      email: email,
      DOB: DOB,
      gender: gender,
      postalCode: postalCode,
      phone: phone,
      // maritalStatus: maritalStatus,
      // healthCardNumber: healthCardNumber,
      // occupation: occupation,
      others: others,
      country: country,
      province: province,
      city: city,
      physioId: physioID,
      address: address
      
    }

    return this.http.post(url, body);
  }
  
}
