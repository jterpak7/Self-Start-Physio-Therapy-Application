import { Component, OnInit } from '@angular/core';
import { UserAccountsService } from '../user-accounts.service';
import { Router } from '@angular/router'
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from '../app.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  showFailure: boolean;
  userIsDisabled: boolean;
  needToVerify: boolean;
  constructor(private userAccountsService: UserAccountsService,
              private router: Router,
              private cookieService: CookieService,
              private appComponent: AppComponent,
              private modalService: NgbModal) { }

  ngOnInit() {
    this.showFailure = false;
    
  }

  Open(modal) {
    this.modalService.open(modal, {size: 'lg'});
  }

  Login(username: string, password: string) {

    if(!username || !password) {
      var cityBox = document.getElementById('inputPassword').style.borderColor = 'red';    
      this.showFailure = true;
      return;      
    }

    if(!navigator.cookieEnabled) {
      //user has cookies disabled
      var button: any = document.getElementById('showEnableCookies').click();
      return;
      //button
    }

    var cityBox = document.getElementById('inputPassword').style.borderColor = 'rgba(0,0,0,.15)';        
    this.userAccountsService.InitialConnection(username).subscribe(data => {
        var retObj1: any = data;
        if(retObj1.success == false) {
            this.showFailure = true;
            var cityBox = document.getElementById('inputPassword').style.borderColor = 'red';    
            return;
        }

        this.userAccountsService.Login(username, password, retObj1.nonce, retObj1.salt).subscribe(data => {
        var retObj: any = data;
        if(retObj.success == true) {
          if(retObj.changePass == true) {
            var url = '../login/recover/' + retObj.userID;
            this.router.navigate([url]);
            this.appComponent.alterLoginState();
          }
          
            // if(retObj.role == "US" && retObj.verified == false ) {
            //   this.needToVerify = true;
            //   return;
            // }
            //expires in 1 hour, expires takes days so 1 hour is 1/24
            this.cookieService.set('ID', retObj.userID, 1/24);
            this.cookieService.set('session', retObj1.nonce, 1/24);
            this.cookieService.set('role', retObj.role, 1/24);

            if(retObj.role == "US") {
              this.appComponent.alterLoginState();
              this.appComponent.toggleToClient();
              this.router.navigate(['../client/home']);
              
            }

            else if (retObj.role == "AD") {
              this.appComponent.alterLoginState();
              this.appComponent.toggleToAdmin();
              this.router.navigate(['../admin/home']);

              
            }
            else {

              this.appComponent.alterLoginState();
              this.appComponent.toggleToPhysio();
              this.router.navigate(['../physio/home']);
              
            }
          
        }
        else{ 

          if(retObj.incPass == true) {
            this.showFailure = true;
            var cityBox = document.getElementById('inputPassword').style.borderColor = 'red';                
          }
          if(retObj.isDisabled) {
            this.userIsDisabled = true;
            var cityBox = document.getElementById('inputPassword').style.borderColor = 'red';                            
          }
        }
      })
    })
    
  }

}
