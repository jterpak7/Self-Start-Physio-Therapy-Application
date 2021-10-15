import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import {EncryptionService} from './encryption.service'
import { CookieService } from 'ngx-cookie-service';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class PatientService {

  constructor(private http: HttpClient,
              private encryptionService: EncryptionService,
              private cookieService: CookieService) { }

  GetAllPatients() : any{
    var url = '/api/patient?s=familyName&sortorder=asc&offset=0';
    return this.http.get(url);
  }

  getPhysioPatients(id: string){
    var url = "/api/patient/physiotherapist/" + id;
    return this.http.get(url);
  }

  GetPatientByPatientID(patientID: string) {
    var url = '/api/patient/' + patientID;
    return this.http.get(url);
  }

  UpdatePatient(ID: string, firstName: string, lastName: string, patientID: string, email: string, DOB: string, postalCode: string, phoneNumber: string, others: string, newCountry: string, newProvince: string, newCity: string, newGender: string, newAddress: string) : any {
    //create the body of the request
    var body = {
      ID: patientID,
      familyName: lastName,
      givenName: firstName,
      email: email,
      DOB: DOB,
      gender: newGender,
      postalCode: postalCode,
      phone: phoneNumber,
      others: others,
      country: newCountry,
      province: newProvince,
      city: newCity,
      address: newAddress
    }
    //url that the request is going to be sent too
    var url = '/api/patient/' + ID;
    return this.http.put(url, body);
  }

  DeletePatient(ID: string) {
    var url = '/api/patient/' + ID;
    return this.http.delete(url);
  }

  SearchPatient(searchString: string, searchArea: string, offset, ascvsdesc) {
    var url = '/api/patient?q=' + searchString + '&s=' + searchArea + '&sortorder=' + ascvsdesc + '&offset=' + offset;
    return this.http.get(url);
  }

  GetCountries() {
    var url = '/api/country';
    return this.http.get(url);
  }

  GetProvinces(countryId: string) {
    var url = '/api/country/getprovinces/' + countryId;
    return this.http.get(url);
  }

  GetCities(provinceId: string) {
    var url = '/api/province/getcities/' + provinceId;
    return this.http.get(url);
  }

  GetGenders() {
    var url = '/api/gender';
    return this.http.get(url);
  }

  CreatePatient(firstName: string, lastName: string, patientID: string, email: string, DOB: string, postalCode: string, phoneNumber: string, maritalStatus: string, healthCardNumber: string, occupation: string, others: string, newCountry: string, newProvince: string, newCity: string, newGender: string) {
    var body = {
      ID: patientID,
      familyName: lastName,
      givenName: firstName,
      email: email,
      DOB: DOB,
      gender: newGender,
      postalCode: postalCode,
      phone: phoneNumber,
      maritalStatus: maritalStatus,
      healthCardNumber: healthCardNumber,
      occupation: occupation,
      others: others,
      country: newCountry,
      province: newProvince,
      city: newCity
    }

    var url = '/api/patient'
    return this.http.post(url, body);
  }

  ChangePassword(hash: string, password: string, tempPassword: string, salt) {
    var url = "/api/useraccount/account/change";
    var hashPassword = this.encryptionService.hash(password);
    var hashWithSalt = hashPassword + salt;
    var hashedPassAndSalt = this.encryptionService.hash(hashWithSalt);
    var newEncryptedPassword = this.encryptionService.encrypt(hashedPassAndSalt);

    var hashPassword = this.encryptionService.hash(tempPassword);
    var hashWithSalt = hashPassword + salt;
    var hashedPassAndSalt = this.encryptionService.hash(hashWithSalt);
    var encryptedTempPassword = this.encryptionService.encrypt(hashedPassAndSalt);

    var body = {
      userID: hash,
      newEncryptedPassword: newEncryptedPassword,
      encryptedTempPassword: encryptedTempPassword
    }

    return this.http.put(url, body);
  }

  AssignPlan(id: string, plan: any){
    var body={
      ID: id,
      rehabPlan: plan
    }
    var url = '/api/patient/assign/' + id;

    return this.http.put(url, body);
  }

  GetPatientsUnderPlan(id: string){
    var url = '/api/patient/plan/' + id;
    return this.http.get(url);
  }

  GetPatientsNotUnderPlan(id: string, pageSize){
    var url ='/api/patient/notplan/' + id + '/?&offset=0' + '&sortorder=asc' + '&pageSize=' + pageSize;
    return this.http.get(url);
  }

  RemovePatient(id: string){
    var body = {
      patient: id
    }
    var url = '/api/patient/plan/remove';
    return this.http.put(url, body);
  }

  SearchPatientRehab(id: string, searchString: string, offset, pageSize){
    var url = '/api/patient/notplan/'+ id + '/?q=' + searchString + '&s=familyName' + '&sortorder=asc' + '&offset=' + offset + '&pageSize=' + pageSize;
    return this.http.get(url);
  }

  GetPatientInfo(id: string){
    var url = '/api/patient/patientinfo/' + id;
    return this.http.get(url);
  }

  GetPatientApppointments(id: string){
    var url = '/api/patient/appointments/' + id;
    return this.http.get(url);
  }

  GetSalt(id: string) {
    var url = "/api/useraccount/account/getsalt/" + id;

    return this.http.get(url);
  }

  GetPatient() {
    var userID = this.cookieService.get('ID');
    console.log(userID);
    var url = '/api/patient/getclient/' + userID;

    return this.http.get(url);
  }

  GetSpecificPatient(id: string){
    var url = '/api/patient/getspecific/' + id;
    return this.http.get(url);
  }

}
