import { Component, AfterViewInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserAccountsService } from './user-accounts.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  showLogin: boolean;
  isClient;
  isPhysio;
  isAdmin
  constructor(private router: Router,
              private cookieService: CookieService,
              private userAccountsService: UserAccountsService) 
              {
                if(this.cookieService.get('session')) {
                  //there is a current session going on so the logout button should be displayed
                  this.showLogin = false;
                }
                else {
                  this.showLogin = true;
                  this.isAdmin = false;
                  this.isClient = false;
                  this.isPhysio = false;
                }
                this.CheckRole();

              }
  
  goHome(){
    this.router.navigate(['home']);
  }

  CheckRole() { 
    this.isClient = false;
    this.isPhysio = false;
    this.isAdmin = false;
    var role = this.cookieService.get('role');
    if(role == "US") {
      this.isClient = true;
    }
    else if(role == "PH") {
      this.isPhysio = true;
    }
    else if(role == "AD"){
      this.isAdmin = true;
    }
  }

  alterLoginState() : void{
    this.showLogin = false;
    this.isClient = false;
    this.isPhysio = false;
    this.isAdmin = false;
  }

  toggleToClient(){
    this.isClient = true;
    this.isPhysio = false;
    this.isAdmin = false;
  }

  toggleToPhysio() {
    this.isClient = false;
    this.isPhysio = true;
    this.isAdmin = false;
  }

  toggleToAdmin() {
      this.isClient = false;;
      this.isPhysio = false;
      this.isAdmin = true;
  }

  logout() {
    
    var session = this.cookieService.get('session');
    this.cookieService.delete('ID');
    this.cookieService.delete('session');
    this.cookieService.delete('role');
    this.showLogin = true;
    this.isAdmin= false;
    this.isClient = false;
    this.isPhysio = false; 
    this.userAccountsService.LogOut(session).subscribe(data => {
    });
    document.body.style.cursor = "wait";    
    let router2 = this.router;
    setTimeout(function() { 
      document.body.style.cursor = "default";     
      router2.navigate(['./welcome']);
    }, 1000);
    
  }
  
}
