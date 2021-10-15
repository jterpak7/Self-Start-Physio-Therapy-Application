import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import { EncryptionService } from './encryption.service';
import { CookieService } from 'ngx-cookie-service';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserAccountsService {

  constructor(private http: HttpClient,
              private encryptionService: EncryptionService,
              private cookieService: CookieService) { }

  RequestResetPassword(username: string) {
    var url = "/api/useraccount/account/reset";
    var body = { username: username};

    return this.http.put(url, body);
  }

  GetUsersWantingAPasswordReset() {
    var url = '/api/useraccount/account/reset';

    return this.http.get(url);
  }

  Login(username: string, password: string, nonce: string, salt: string) {
    var url = "/api/useraccount/account/login";
    var hashPassword = this.encryptionService.hash(password);
    var hashWithSalt = hashPassword + salt;
    var hashedPassAndSalt = this.encryptionService.hash(hashWithSalt);
    var encryptedPassword = this.encryptionService.encrypt(hashedPassAndSalt);
    var encryptedNonce = this.encryptionService.encrypt(nonce);
    var body = {username: username, 
                encryptedpass: encryptedPassword,
                encryptednonce: encryptedNonce};

    return this.http.post(url, body);
  }

  InitialConnection(username: string) {
    var url = '/api/useraccount/account/initial';
    var body = {
      username: username,
      request: 'open'
    }

    return this.http.post(url, body);
  }

  async GetAuthorization() {
    var url = '/api/useraccount/session/loggedin';
    var sessionCookie = this.cookieService.get('session');
    var encryptedSessionCookie = this.encryptionService.encrypt(sessionCookie);    
    var body = {
      sessionToken: encryptedSessionCookie
    }

    var response: any = await this.http.post(url, body).toPromise();
    return response;
  }

  LoggedIn(){
    //All this route does it check if the user has a session token, if they do true is returned but if the cookie is null return false
    var sessionCookie = this.cookieService.get('session');
    if(!sessionCookie) {
      return false;
    }

    return true;
  }

  LogOut(nonce: string) {  
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': nonce
      })
    };
    //This route is to log out
    var url = "/api/useraccount/session/logout"
    return this.http.delete(url, httpOptions);
  }

  RefreshSession() {
    var session = this.cookieService.get('session');
    var encryptedSessionToken = this.encryptionService.encrypt(session);        
    var url = "/api/useraccount/session/refresh";
    var body = {
      session: encryptedSessionToken
    }

    return this.http.put(url, body);
  }

  SetAppointmentCounter(id: string, appoint: number, initial: number){
    var body = {
      appointment: appoint,
      initial: initial
    }

    var url = '/api/useraccount/appointments/' + id;
    return this.http.put(url, body);
  }

  GetInfoDates(id: string){
    var url = '/api/useracccount/getdates/' + id;

    return this.http.get(url);
  }


  GetAdminByUserID() {
    var userID = this.cookieService.get('ID');
    var url = '/api/administrator/getadmin/' + userID;

    return this.http.get(url);
  }

}
