import { Component, OnInit } from '@angular/core';
import { DynamicFormsService } from '../dynamic-forms.service';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dynamic-forms',
  templateUrl: './dynamic-forms.component.html',
  styleUrls: ['./dynamic-forms.component.css']
})
export class DynamicFormsComponent implements OnInit {

  public isCollapsed = false;
  //questions: Object [];
  forms: Object [];
  types: Object [];
  showSuccess: boolean;
  showDeleteSuccess: boolean;
  showFailure: boolean;
  editMode: boolean;
  onForm: boolean;
  tempFID: string;
  tempQID: string;
  selectedType: string;
  openEditor: boolean;
  showDrop: boolean;
  type: string;
  shortAnswer: boolean = false;
  multipleChoice: boolean = false;
  rating: boolean = false;
  showCreat: boolean = true;
  options: any[];
  optionText: any[];
  questions: any[];
  name: string;
  description: string;
  currOption: string = 'c';
  editquestion: any = {};
  chosenForm: any;
  myform: any = {};
  constructor(private dynamicFormsService: DynamicFormsService,
              private modalService: NgbModal,
              private router: Router) { }

  ngOnInit() {
    this.dynamicFormsService.GetAllForms().subscribe(data =>{
      this.forms = Object.assign([], data.form);
    })
    
    this.editMode = false;
    this.getTypes();

    this.showDrop = false;
    this.type = "Type Of Question";
    this.options = [];
    this.optionText = [];
    this.questions = [];
  }

  EditQuestion(index, questions, form) {
    this.editquestion = form.questions[index];
    this.chosenForm = form;
  }

  SetMyForm(form) {
    this.myform = form;
  }

  changeSA(){
    this.type = "Short Answer";
    this.shortAnswer =true;
    this.multipleChoice = false;
    this.rating = false;
  }

  changeMC(){
    this.type = "Multiple Choice";
    this.shortAnswer =false;
    this.multipleChoice = true;
    this.rating = false;
  }

  SaveChanges(value ) {

  }

  changeRA(){
    this.type = "Rating";
    this.shortAnswer =false;
    this.multipleChoice = false;
    this.rating = true;
  }

  addOption(){
     if (this.options.length<=8){
      this.options.push(this.currOption);
      this.currOption = String.fromCharCode(this.currOption.charCodeAt(0) + 1);
     }
  }

  saveMCQuestion(){
    var temp: any = document.getElementById('inputOption');
    temp = temp.value;
    this.optionText.push(temp);
    var temp2: any = document.getElementById('inputOption2');
    temp2 = temp2.value;
    this.optionText.push(temp2);
    for (var i = 0; i<this.options.length; i++){
      var temp: any = document.getElementById(this.options[i]);
      temp = temp.value;
      this.optionText.push(temp);
      
    }
    var temp3: any = document.getElementById('inputMCQuestion');
    temp3 = temp3.value;
    var question = {
      questionText: temp3,
      questionCode: "MC",
      questionContent: this.optionText,
      answer: null
    }
    this.questions.push(question);
    this.optionText = [];
    this.options =[];
    this.showDrop = false;
    this.multipleChoice = false;
    this.type = "type of question";

  }

  saveSAQuestion(){
    var temp: any = document.getElementById('inputShortAnswerQuestion');
    temp = temp.value;
    var question = {
      questionText: temp,
      questionCode: "SA",
      answer: null
    }
    this.questions.push(question);
    this.optionText = [];
    this.options =[];
    this.showDrop = false;
    this.shortAnswer = false;
    this.type = "type of question";
  }

  saveRatingQuestion(){
    var temp: any = document.getElementById('inputRatingQuestion');
    temp = temp.value;
    var question = {
      questionText: temp,
      questionCode: "RA",
      answer: null
    }
    this.questions.push(question);
    this.optionText = [];
    this.options =[];
    this.showDrop = false;
    this.rating = false;
    this.type = "type of question";
  }

  SendUpdate(questiontext) {
    if(this.editquestion.questionType = "MC") {
      for(var a = 0; a < this.editquestion.questionContent.length; a++) {
        var input: any = document.getElementById('editquestion' + a);
        this.editquestion.questionContent[a] = input.value
      }
    }

    this.editquestion.questionText = questiontext;

    this.dynamicFormsService.UpdateForm(this.chosenForm._id, this.chosenForm.name, this.chosenForm.description, this.chosenForm.questions).subscribe(data => {

    })
  }

  AddAnotherQuestion(questionType) {
    if(questionType=="SA") {
      this.saveSAQuestion();
    }
    else if(questionType == "MC") {
      this.saveMCQuestion();
    }
    else {
      this.saveRatingQuestion();
    }

    this.myform.questions.push(this.questions[0]);
    this.dynamicFormsService.UpdateForm(this.myform._id, this.myform.name, this.myform.description, this.myform.questions).subscribe(data => {

      this.openEditor = false;
      this.showDrop = false;
      this.rating = false;
      this.multipleChoice = false;
      this.shortAnswer =  false;
      this.type = "type of question";
      this.showCreat = true;
      this.optionText = [];
      this.options =[];
      this.questions = [];
    })
  }

  SetQuestion(questionType) {
    if(questionType == "RA") {
      this.changeRA();
    }
    else if(questionType == "SA") {
      this.changeSA();
    }
    else {
      this.changeMC();
    }
  }

  NumToChar(n) {
    var ch = String.fromCharCode(97 + n);
    return ch;
  }

  RemoveQuestion(num, formID, questions, name, description) {
   
    questions.splice(num, 1);
    this.dynamicFormsService.UpdateForm(formID, name, description, questions).subscribe(data => {
    })

  }

  SaveDynamicForm(name: string, description: string) {
    var cannotContinue: boolean = false;;
    if(!name) {
      //name value is bad
      cannotContinue = true;
    }

    if(!description) {
      //description value is null
      cannotContinue = true;
    }

    if(cannotContinue) {
      return;
    }

    this.dynamicFormsService.CreateNewForm(name, description, this.questions).subscribe(data => {
      this.dynamicFormsService.GetAllForms().subscribe(data => {
        this.forms = Object.assign([], data.form);
        
      });

      this.openEditor = false;
      this.showDrop = false;
      this.rating = false;
      this.multipleChoice = false;
      this.shortAnswer =  false;
      this.type = "type of question";
      this.showCreat = true;
      this.optionText = [];
      this.options =[];
      this.questions = [];
    })
  }

  CancelNewForm() {
    this.openEditor = false;
    this.showDrop = false;
    this.rating = false;
    this.multipleChoice = false;
    this.shortAnswer =  false;
    this.type = "type of question";
    this.showCreat = true;
    this.optionText = [];
    this.options =[];
    this.questions = [];
  }
  
  switchMode(){
    if(this.editMode == true){
      this.editMode = false;
    }
    else{
      this.editMode = true;
    }
  }
  
  deleteForm(ID: string) {
    this.dynamicFormsService.DeleteForm(ID).subscribe(data => {
      //update the list to reflect deletion
      this.dynamicFormsService.GetAllForms().subscribe(data =>{
      this.forms = Object.assign([], data.form);
      })
      
    })
  }
  
  open(content) {
    this.modalService.open(content, {size: 'lg'});
    //this.tempFID = formID;
  }
  
  createQuestion(questionText: string, helpDescription: string, order: Number, formID: string, qType: string){
    this.dynamicFormsService.CreateQuestion(questionText, helpDescription, order, formID, qType).subscribe(data => {
      
      this.dynamicFormsService.GetFormQuestions(formID).subscribe(data => {
        var retObj: any = data;
        this.questions = Object.assign([], retObj.question);
      })
      
    })
  }
  
  createType(name: string, questionID: string){
    this.dynamicFormsService.CreateType(name, questionID).subscribe(data => {
    })
  }
  
  getTypes(){
    this.dynamicFormsService.GetTypes().subscribe(data => {
      var retObj: any = data;
      this.types = Object.assign([], retObj.questionType);
    })
  }
  
  getTypeId(name: string){
    this.dynamicFormsService.GetTypeID(name).subscribe(data => {
      var retObj: any = data;
      this.tempQID = retObj._id;
    })
  }
  
  
  updateQuestion(id: string, questionText: string, helpDescription: string, order: Number, formID: string, questionType: string){
    this.dynamicFormsService.UpdateQuestion(id, questionText, helpDescription, order, formID, questionType).subscribe(data => {
      this.getFormQuestions(formID);
    })
  }

  
  //This is working
  deleteQuestion(ID: string, formID: string){
    this.dynamicFormsService.DeleteQuestion(ID).subscribe(data => {
      
      
      this.getFormQuestions(formID);
    })   
  }
  
  //This is working -- dont touch for now
  getFormQuestions(formID: string){
    this.dynamicFormsService.GetFormQuestions(formID).subscribe(data => {
      var retObj: any = data;
      this.questions = Object.assign([], retObj.question);
    })
  }
  
  
  
  
}
