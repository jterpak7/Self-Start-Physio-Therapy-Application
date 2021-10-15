import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class EmailService {

  constructor(private http: HttpClient) { }

  SendEmail(toEmail: String, subject: String, content: String) {
    var url = "/api/email";
    var body = {
      email: toEmail,
      subject: subject,
      emailContent: content
    }

    return this.http.post(url, body);
  }

  SendRecoveryEmail(username: string) {
    var url = "/api/email/forgotten";
    var body = {
      username: username
    }

    return this.http.post(url, body);
  }

  SendPDFToClient(pdf, toEmail, message, fileName) {
    var url = '/api/email/update/sendpdf';
    var body = {
      pdf: pdf,
      toEmail: toEmail,
      message: message,
      fileName: fileName
    }

    return this.http.post(url, body);
  }

  EmailClientAboutNewRehabPlan(name, rehabPlanName, toEmail) {
    var url = '/api/email/rehabplan/notify';
    var body = {
      name: name,
      rehabPlanName: rehabPlanName,
      toEmail: toEmail
    }

    return this.http.post(url, body);
  }

  EmailClientsAboutNewAssessmentTest(planid: string, assessmenttest: string) {
    var url = "/api/email/assessmenttest/notify/" + planid;
    var body = {
      assessmenttest: assessmenttest
    }

    return this.http.post(url, body);
  }

  AskAnExpert(firstname: string, lastname: string, email: string, question: string) {
    var name = firstname + " " + lastname;
    var url = "/api/email/expert/ask"
    var body = {
      name: name,
      email: email,
      question: question
    }

    return this.http.post(url, body);
  }

}
