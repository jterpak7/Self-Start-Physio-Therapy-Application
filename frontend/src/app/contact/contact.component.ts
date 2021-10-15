import { Component, OnInit } from '@angular/core';
import { EmailService } from '../email.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  messageSent: boolean;
  constructor(private emailService: EmailService) { }

  ngOnInit() {
  }

  SendQuestion(firstname, lastname, email, question) {
    this.messageSent = false;
    if(!firstname || !lastname || !email || !question) {
      return;
    }

    this.emailService.AskAnExpert(firstname, lastname, email, question).subscribe(data => {
      this.messageSent = true;
    })
  }

}


