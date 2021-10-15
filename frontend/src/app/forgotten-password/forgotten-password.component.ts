import { Component, OnInit } from '@angular/core';
import { EmailService } from '../email.service';
import { UserAccountsService } from '../user-accounts.service'
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-forgotten-password',
  templateUrl: './forgotten-password.component.html',
  styleUrls: ['./forgotten-password.component.css']
})
export class ForgottenPasswordComponent implements OnInit {

  inputtedUsername: boolean;
  username: string;
  badUsername: boolean;
  alreadySent: boolean;
  constructor(private emailService: EmailService,
              private userAccountService: UserAccountsService,
              private modalService: NgbModal) { }

  ngOnInit() {
  }

  SendEmail(inputUsername: string, successModal) {
    if(!inputUsername) {
      this.inputtedUsername = false;
      return;
    }
    this.userAccountService.RequestResetPassword(inputUsername).subscribe(data => {
      var retObj :any = data;
      if(retObj.success == true) {
        this.inputtedUsername = true;
        this.username = inputUsername;
        this.modalService.open(successModal)
      }
      else {
        if(retObj.alreadySent) {
          this.alreadySent = true;
          this.badUsername = false;
          var newAddressBox = document.getElementById('inputUsername').style.borderColor = 'red';          
          return;
        }
        else {
          this.badUsername = true;
          this.alreadySent = false;
          var newAddressBox = document.getElementById('inputUsername').style.borderColor = 'red';
        }
      }
    })
    
  }

}
