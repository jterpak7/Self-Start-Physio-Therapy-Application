import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class PhysiotherapistService {

  constructor(private http: HttpClient,
              private cookieService: CookieService) { }
  
  
  getTherapists(): any{
      var url = 'api/physiotherapist?s=familyName&sortorder=asc&offset=0';
      return this.http.get(url);
  }

  SearchPhysio(searchString: string, searchArea: string, offset, ascvsdesc) {
    var url = '/api/physiotherapist?q=' + searchString + '&s=' + searchArea + '&sortorder=' + ascvsdesc + '&offset=' + offset;
    return this.http.get(url);
  }

  createPhysio(newPhysioFirstName: string, newPhysioLastName: string, newPhysioEmail: string, newPhysioHired: string, newPhysioFinished: string, newPhysioUserName: string, newPhysioPassword: string, salt: string ): any{
      var url = "/api/physiotherapist";
      var body = {
          username: newPhysioUserName,
          password: newPhysioPassword,
          ID: 0,
          dateHired: newPhysioHired,
          dateFinished: newPhysioFinished,
          email: newPhysioEmail,
          givenName: newPhysioFirstName,
          familyName: newPhysioLastName,
          salt: salt
      }
      return this.http.post(url, body);
   }
  
  createPhysiobyAdmin(newPhysioFirstName: string, newPhysioLastName: string, newPhysioEmail: string, newPhysioHired: string, newPhysioFinished: string, newPhysioUserName: string, newPhysioPassword: string, salt: string ): any{
      var url = "/api/physiotherapist/admincreated";
      var body = {
          username: newPhysioUserName,
          encryptedPassword: newPhysioPassword,
          ID: 0,
          dateHired: newPhysioHired,
          dateFinished: newPhysioFinished,
          email: newPhysioEmail,
          givenName: newPhysioFirstName,
          familyName: newPhysioLastName,
          salt: salt
          
      }
      return this.http.post(url, body);
  }
  deletePhysioTherapist(ID: string){
       var url = '/api/physiotherapist/' + ID;
       return this.http.delete(url);
  }

  updatePhysio(givenName1: string, familyName1: string, email1: string, ID1: string, dateHired1: string, dateFinished1: string, _id1: string){
      //var string1 = therapist._id;
      var url = '/api/physiotherapist/' + _id1;
      var body = {
          ID: ID1,
          familyName: familyName1,
          givenName: givenName1,
          email: email1,
          dateHired: dateHired1,
          dateFinished: dateFinished1
      }
   
  
      return this.http.put(url, body);
  }

  getInfo(id: string){
      var url = '/api/physiotherapist/' + id;
      return this.http.get(url);
  }

  GetPhysioByUserID() {
    var userID = this.cookieService.get('ID');

    var url = '/api/physiotherapist/getphysio/' + userID;
    return this.http.get(url);
  }

  PhysioUpdateOwnInformation(firstname: string, lastname: string, email: string) {
      var userID = this.cookieService.get('ID');
      var url = '/api/physiotherapist/update/' + userID;
      
      var body = {
        firstname: firstname,
        lastname: lastname,
        email: email
      }

      return this.http.put(url, body);
  }
}
