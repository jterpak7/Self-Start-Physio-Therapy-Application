import { Component, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import {AssessmentTestService} from '../assessment-test.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { PatientService } from '../patient.service';
import {RehabPlansService} from '../rehab-plans.service'
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';
import { EmailService } from '../email.service';
import { PhysiotherapistService } from '../physiotherapist.service';

@Component({
  selector: 'app-assessment-test',
  templateUrl: './assessment-test.component.html',
  styleUrls: ['./assessment-test.component.css']
})
export class AssessmentTestComponent implements OnInit {
  showDrop: boolean; 
  type: string;
  shortAnswer: boolean = false;
  multipleChoice: boolean = false;
  rating: boolean = false;
  manageTests: boolean = true;
  showPatients: boolean = false;
  showCreat: boolean = true;
  viewDetails:boolean = false;
  viewDetailsCompleted: boolean = false;
  options: any[];
  optionText: any[];
  questions: any[];
  name: string;
  description: string;
  clients: any[];
  selectedPlan: any[];
  offset: number = 0;
  offset1: number = 0;
  offset2: number = 0;
  physioRating: number =0;
  pageInfo: string;
  comments: string;
  qEdit: any;
  tests = new MatTableDataSource();
  completedTests = new MatTableDataSource();
  displayedColumns = ["Patient", "Plan Assigned", "Date", "View Test Results"];  
  displayedColumns1 = ["Patient", "Test Assigned", "Date Completed", "Status", "View Test Results"];  
  today: any;
  timeOfDay: any;
  physio: any;
  length;
  pageSize = 10;
  pageSizeOptions = [10];
  length1;
  length2;
  
  currOption: string = 'c';
  
  // @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private assessmentTestService: AssessmentTestService,  private modalService: NgbModal,
              private patientService: PatientService, private rehabPlanService: RehabPlansService, private config: NgbRatingConfig,
              private emailService: EmailService,
              private physioService: PhysiotherapistService) {
                this.config.max = 10;
                setInterval(() => {
                  this.today = new Date();
                }, 30000);  
              }
              
  

  ngOnInit() {
    this.showDrop = false;
    this.type = "Type Of Question";
    this.options = [];
    this.optionText = [];
    this.questions = [];
    this.clients = [];
    this.selectedPlan =[];
    this.tests = new MatTableDataSource();
    this.completedTests = new MatTableDataSource();
    this.physioService.GetPhysioByUserID().subscribe(data =>{
      let obj: any = data;
      this.physio = obj.physio;
    })
    this.timeOfDay = this.getTimeOfDay();
    this.assessmentTestService.getTests().subscribe(data => {
      var retObj: any = data;
      this.length = retObj.total;
      this.tests.data = retObj.docs;
    });
    this.assessmentTestService.getAllCompleted().subscribe(data =>{
      var retObj: any = data;
      this.length1 = retObj.total;
      this.completedTests.data = retObj.docs;
    })
  }

  getTimeOfDay(): string{
    this.today = new Date();
    var hour = this.today.getHours();
    if(hour < 13 && hour >= 0){ return "Morning"}
    if(hour < 17){ return "Afternoon"}
    else{ return "Evening"};
  }
  

  /**
   * Set the sort after the view init since this component will
   * be able to query its view for the initialized sort.
   */
 
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    //this.tests.filter = filterValue;
    this.searchTests(filterValue);
  }
  applyFilter1(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    //this.tests.filter = filterValue;
    this.searchCompletedTests(filterValue);
  }
  applyFilter2(filterValue: string){
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    //this.tests.filter = filterValue;
    this.searchPlans(filterValue);
 
  }
  searchPlans(searchString:string){
    
    this.rehabPlanService.SearchPlans(searchString, this.offset2).subscribe(data =>{
       if(data != []) {
        var retObj : any = data;
        this.clients =  retObj.docs;
        this.length2 = retObj.total;
        if(this.offset + 10 > this.length) {
          this.pageInfo = `${this.offset} - ${this.length} of ${retObj.total}` 
        }
        else{
          this.pageInfo = `${this.offset} - ${this.offset + 10} of ${retObj.total}`    
        }
        
      }
    });
  }
  enable(){
    this.showCreat = false;
    this.viewDetails = false;
    this.viewDetailsCompleted = false;
    this.manageTests = false;
    this.showPatients = false;
    var temp: string = "How Do you Feel Today"
    this.questions = [];
    
    var tempQuestion = {
      questionText: temp,
      questionCode: "RA",
      answer: null
      
    }
    
    this.questions.push(tempQuestion);
    // this.manageTests = true;
    
  }
  enableAddQuestion(){
    
    this.showDrop = true;
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
  
  createTest(){
    var temp:any = document.getElementById('name');
    temp = temp.value;
    this.name = temp;
    
    var temp2:any = document.getElementById('description');
    temp2 = temp2.value;
    this.description = temp2;
    
    
    this.assessmentTestService.createPlan(this.name, this.description, this.questions).subscribe(data => {
    });
    this.tests = new MatTableDataSource();
    this.assessmentTestService.getTests().subscribe(data => {
      var retObj: any = data;
      this.tests.data = retObj.assessmentTest;
      
      
    });
    this.showDrop = false;
    this.rating = false;
    this.multipleChoice = false;
    this.showPatients = false;
    this.type = "type of question";
    this.showCreat = true;
    this.manageTests = false;
    this.viewDetails = false;
    this.viewDetailsCompleted = false;
    this.optionText = [];
    this.options =[];
    this.questions = [];
    //this.ngOnInit();
    //this.ngAfterViewInit();
    
  }
  open(content) {
    this.modalService.open(content, {size: 'lg'});
    //content.show();
    
  }
  setQedit(Q:any){
    this.qEdit = Q;
  }
  
  openListOfPlans(){
     var temp:any = document.getElementById('name');
    temp = temp.value;
    this.name = temp;
    
    var temp2:any = document.getElementById('description');
    temp2 = temp2.value;
    this.description = temp2;
    
  
   this.showCreat =true;
   this.showDrop = false;
   this.rating = false;
   this.multipleChoice = false;
   this.type = "type of question";
   this.manageTests = false;
   
   this.rehabPlanService.getPlans().subscribe(data => {
     this.length2 = data.total;
     this.clients = Object.assign([], data.docs);
   });
   this.showPatients = true;
   
    
  }
  
  
  
  openListOfPatients(){
    var temp:any = document.getElementById('name');
    temp = temp.value;
    this.name = temp;
    
    var temp2:any = document.getElementById('description');
    temp2 = temp2.value;
    this.description = temp2;
    
  
   this.showCreat =true;
   this.showDrop = false;
   this.rating = false;
   this.multipleChoice = false;
   this.type = "type of question";
   this.manageTests = false;
  
   this.patientService.GetAllPatients().subscribe(data => {
      this.clients = Object.assign([], data.docs);
      
    });
   
    this.showPatients = true;
    
  }
  assignTest(listOfClients: any[]){
    var clientIds: string[] = [];
    
    for (var i = 0; i<listOfClients.length; i++){
      clientIds.push(listOfClients[i].value);
    }

    for (var i = 0; i<clientIds.length; i++){
      this.assessmentTestService.createPlanwithAssignedTest(this.name, this.description, this.questions,clientIds[i]).subscribe(data => {
        console.log(data);
        var retObj: any = data;
        retObj = retObj.assessmentTest;
        this.assessmentTestService.linktoPlan(retObj._id, retObj.belongsTo).subscribe(data1 =>{
          
        });
      });
      this.emailService.EmailClientsAboutNewAssessmentTest(clientIds[i], this.name).subscribe(data => {
      })
    }
    
    this.tests = new MatTableDataSource();
    this.assessmentTestService.getTests().subscribe(data => {
      var retObj: any = data;
      this.tests.data = retObj.assessmentTest;
      
      
    });
    this.showCreat = true;
    this.optionText = [];
    this.options =[];
    this.questions = [];
    this.showPatients = false;
    this.manageTests = false;
  }
  showTable(){
    this.viewDetails = false;
    this.viewDetailsCompleted = false;
    this.manageTests = true;
    this.showPatients = false;
    this.showCreat = true;
    this.tests = new MatTableDataSource();
    this.assessmentTestService.getTests().subscribe(data => {
      var retObj: any = data;
      this.tests.data = retObj.docs;
      
      
    });
    this.questions = [];
  }
  view(planSel: any){
    this.selectedPlan = planSel;
    this.manageTests = false;
    this.viewDetails = true;
    this.viewDetailsCompleted = false;
    
    //this.managaeTests = false;
    
  }
  viewcomp(testSel: any){
    this.selectedPlan = testSel;
    this.manageTests = false;
    this.viewDetails = false;
    this.viewDetailsCompleted = true;
    
    
    
  }
  deleteQuestion(que: any){
    var index = this.questions.indexOf(que);
    this.questions.splice(index,1);
  }
  
  
  searchPatients(searchString: string, searchArea: string) {
    // var ascvsdesc;
    // if(this.ascendingOrd == true) {
    //   ascvsdesc = 'asc';
    // }
    // else {
    //   ascvsdesc = 'desc';
    // }
    this.patientService.SearchPatient(searchString, searchArea, this.offset, 'asc').subscribe(data => {
      if(data != []) {
        var retObj : any = data;
        this.clients = Object.assign([], retObj.docs);
      }
    });
  }
  NextPage(searchString: string, searchArea: string) {
    this.offset += 10;
    this.searchPatients(searchString, searchArea);
  }

  PreviousPage(searchString: string, searchArea: string) {
    if(this.offset != 0) {
      this.offset -= 10;
    }
    this.searchPatients(searchString, searchArea);
  }
  moveUp(q: any){
    var index = this.questions.indexOf(q);
    if (index!=1){
      var temp = this.questions[index-1];
      this.questions[index-1] = q;
      this.questions[index] = temp;
    }
  }
  moveDown(q:any){
    var index = this.questions.indexOf(q);
    if (index!=this.questions.length - 1){
      var temp = this.questions[index+1];
      this.questions[index+1] = q;
      this.questions[index] = temp;
    }
    
  }
  deleteOption(opt:any, Q:any){
    var index = this.questions.indexOf(Q);
    var indexOpt = this.questions[index].questionContent.indexOf(opt);
    if (this.questions[index].questionContent.length > 2){
      this.questions[index].questionContent.splice(indexOpt,1);
    }
  }
  updateQuestion(Q: any){
    var index = this.questions.indexOf(Q);
    var temp:any = document.getElementById('inputQuestionText');
    this.questions[index].questionText = temp.value;
    
    if (this.questions[index].questionContent != null){
      for (var i=0; i<this.questions[index].questionContent.length; i++){
        var opt:any  = document.getElementById(i.toString());
        this.questions[index].questionContent[i] = opt.value;
      }
    }
    
  }
  addOptionInEdit(Q: any){
    var index = this.questions.indexOf(Q);
    if(this.questions[index].questionContent.length<=10){
      this.questions[index].questionContent.push("");
    }
  }
  
  SwitchPageEvent(pageEvent: any, searchString: string) {
    this.offset = pageEvent.pageIndex * pageEvent.pageSize;
    this.searchTests(searchString);
  }
  SwitchPageEvent1(pageEvent: any, searchString: string) {
    this.offset1 = pageEvent.pageIndex * pageEvent.pageSize;
    this.searchCompletedTests(searchString);
  }
  
   SwitchPageEvent2(pageEvent: any, searchString: string) {
    this.offset2 = pageEvent.pageIndex * pageEvent.pageSize;
    this.searchPlans(searchString);
  }

  searchCompletedTests(searchString: string){
    this.completedTests = new MatTableDataSource();
    this.assessmentTestService.searchCompletedTests(searchString, "name", this.offset, 'asc').subscribe(data =>{
      if(data != []) {
        var retObj : any = data;
        this.completedTests.data =  retObj.docs;
        this.length1 = retObj.total;
        if(this.offset + 10 > this.length) {
          this.pageInfo = `${this.offset} - ${this.length} of ${retObj.total}` 
        }
        else{
          this.pageInfo = `${this.offset} - ${this.offset + 10} of ${retObj.total}`    
        }
        
      }
    });
  }

  searchTests(searchString: string){
    this.tests = new MatTableDataSource();
    this.assessmentTestService.search(searchString, "name", this.offset, 'asc').subscribe(data =>{
       if(data != []) {
        var retObj : any = data;
        this.tests.data =  retObj.docs;
        this.length = retObj.total;
        if(this.offset + 10 > this.length) {
          this.pageInfo = `${this.offset} - ${this.length} of ${retObj.total}` 
        }
        else{
          this.pageInfo = `${this.offset} - ${this.offset + 10} of ${retObj.total}`    
        }
        
      }
    });
  }
  SendBack(index: any){
    this.physioRating = index;
  }
  assignFollowUp(){
    
    
    var temp: any = this.selectedPlan;
    this.assessmentTestService.assignFollowUp(this.comments,this.physioRating, temp._id).subscribe(data =>{
      this.completedTests = new MatTableDataSource();
      this.assessmentTestService.getAllCompleted().subscribe(data =>{
        var retObj: any = data;
        this.length1 = retObj.total;
        this.completedTests.data = retObj.docs;
      })
    });
  }
  closeInjury(finalThoughts:string){
    var temp: any = this.selectedPlan;
    this.assessmentTestService.closeInjury(this.comments, temp._id,this.physioRating,finalThoughts).subscribe(data =>{
      this.completedTests = new MatTableDataSource();
      this.assessmentTestService.getAllCompleted().subscribe(data =>{
        var retObj: any = data;
        this.length1 = retObj.total;
        this.completedTests.data = retObj.docs;
      })
    });
  }
  
  setphysioComments(comments: string){
    this.comments = comments;
  }
}
