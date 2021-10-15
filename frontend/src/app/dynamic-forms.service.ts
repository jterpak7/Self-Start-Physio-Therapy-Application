import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class DynamicFormsService {

  constructor(private http: HttpClient) { }
  
  //Get All forms
  GetAllForms() : any{
    var url = '/api/forms';
    return this.http.get(url);
  }
  
  //Create a form
  CreateNewForm(name: string, description: string, questions) {
    //request body
    var body = {
      name: name,
      description: description,
      questions: questions
    }
    
    var url = '/api/forms';
    return this.http.post(url, body);
  }
  
  //Delete a form
  DeleteForm(id: string){
    var url = '/api/forms/' + id;
    return this.http.delete(url);
  }
  
  //Update a form
  UpdateForm(id: string, name: string, description: string, questions){
    //id is the variable from mongo, newID is a self assigned id to track forms numerically
    var body = {
      name: name,
      description: description,
      questions: questions
    }
    
    var url = '/api/forms/' + id;
    return this.http.put(url, body);
  }
  
  //Create a question
  CreateQuestion(questionText: string, helpDescription: string, order: Number, formID: string, questionType: string){
    var body = {
      questionText: questionText,
      helpDescription: helpDescription,
      order: order,
      form: formID,
      questionType: questionType
    }
    
    var url = '/api/question';
    return this.http.post(url, body);
    
  }
  
  UpdateQuestion(id: string, questionText: string, helpDescription: string, order: Number, formID: string, questionType: string){
    var body = {
      questionText: questionText,
      helpDescription: helpDescription,
      order: order,
      form: formID,
      questionType: questionType
    }
    
    var url = '/api/question/' + id;
    return this.http.put(url, body);
  }
  
  DeleteQuestion(id: string){
    var url = '/api/question/' + id;
    return this.http.delete(url);
  }
  
  //This works
  GetFormQuestions(formID: string){
    var url = '/api/question/form/' + formID;
    return this.http.get(url);
  }
  
  CreateType(name: string, questionID: string){
    
    var body = {
      name: name,
      question: questionID
    }
    
    var url = '/api/questiontype';
    return this.http.post(url, body);
  }
  
  GetTypes(){
    var url = '/api/questiontype'
    return this.http.get(url);
  }
  
  GetTypeID(name: string){
    var url = '/api/questiontype/type/' + name;
    return this.http.get(url);
  }
  
  

}
