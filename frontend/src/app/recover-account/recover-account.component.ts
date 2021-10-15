import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router'
import { PatientService } from '../patient.service'


@Component({
  selector: 'app-recover-account',
  templateUrl: './recover-account.component.html',
  styleUrls: ['./recover-account.component.css']
})

export class RecoverAccountComponent implements OnInit {

  username: string;
  userID: string;
  passwordNull: boolean;
  repeatPasswordNull: boolean;
  passwordsDontMatch: boolean;
  successfullyChangePassword: boolean;
  constructor(private route: ActivatedRoute,
              private patientService: PatientService,
              private router: Router) { }

  ngOnInit() {
    //this component should have a hash passed in the url
    this.userID = this.route.snapshot.paramMap.get("id");
  }

  RemoveErrors() {
    var passwordBox = document.getElementById('inputPassword').style.borderColor = 'rgba(0,0,0,.15)';
    var repeatPasswordBox = document.getElementById('inputRepeatPassword').style.borderColor = 'rgba(0,0,0,.15)';
    var tempPasswordBox = document.getElementById('inputTempPassword').style.borderColor = 'rgba(0,0,0,.15)';    
    this.passwordNull = false;
    this.repeatPasswordNull = false;
    this.passwordsDontMatch = false;
  }

  ResetPassword(password: string, repeatPassword: string, tempPassword: string) {
    var cannotContinue = false;
    if(!tempPassword) {
      var tempPasswordBox = document.getElementById('inputTempPassword').style.borderColor = 'red';
      cannotContinue = true;
    }

    if(!password) {
      var passwordBox = document.getElementById('inputPassword').style.borderColor = 'red';
      cannotContinue = true;
      this.passwordNull = true;
    }

    if(!repeatPassword) {
      var repeatPasswordBox = document.getElementById('inputRepeatPassword').style.borderColor = 'red';
      cannotContinue = true;
      this.repeatPasswordNull = true;
    }

    if(password != repeatPassword && !cannotContinue) {
      this.passwordsDontMatch = true;
      return;
    }

    if(cannotContinue) {
      return;
    }

    this.patientService.GetSalt(this.userID).subscribe(data => {
      var retObj: any = data;
      if(retObj.success == true){
        this.patientService.ChangePassword(this.userID, password, tempPassword, retObj.salt).subscribe(data => {
          var retObj: any = data;
          if(retObj.success) {
            this.router.navigate(['../login']);           
          }
          else {
            //do later
          }
        })
      }
      
    })

  }

}
