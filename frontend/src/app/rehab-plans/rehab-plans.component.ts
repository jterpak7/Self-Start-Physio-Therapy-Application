import { Component, OnInit } from '@angular/core';
import { ExerciseService } from '../exercise.service';
import {RehabPlansService} from '../rehab-plans.service'
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { PhysiotherapistService } from '../physiotherapist.service';



@Component({
  selector: 'app-rehab-plans',
  templateUrl: './rehab-plans.component.html',
  styleUrls: ['./rehab-plans.component.css']
})
export class RehabPlansComponent implements OnInit {


  constructor(private rehabPlansService: RehabPlansService, 
              private modalService: NgbModal, 
              private exerciseService: ExerciseService,
              private router: Router,
              private physioService: PhysiotherapistService) { 
                setInterval(() => {
                  this.today = new Date();
                }, 30000);  
              }

  

  rehabPlans: Object[];
  exercise: Object[];
  allExercises: Object[];
  currPlan: any;
  exercisesInCurrPlan: any =[];
  total: any;
  pageIndex:any = 0;
  offset: number = 0;
  offset2: number = 0;
  pageInfo: string;
  length2;
  pageSize = 10;
  pageSizeOptions = [10];
  today: Date;
  timeOfDay: string;
  physio: any;

  ngOnInit() {
    this.rehabPlansService.getPlans().subscribe(data => {
      this.total = data.total;
      this.rehabPlans = Object.assign([], data.docs);
      this.currPlan = this.rehabPlans[0];
      this.exercisesInCurrPlan = this.currPlan.exerciseObjects;
    });
     this.exerciseService.GetAllExercises().subscribe(data =>{
      var retObj: any = data;
      this.length2 = retObj.total;
      this.allExercises = Object.assign([], retObj.docs);
    });
    this.physioService.GetPhysioByUserID().subscribe(data =>{
      let obj: any = data;
      this.physio = obj.physio;
    })

    this.timeOfDay = this.getTimeOfDay();
  }

  getTimeOfDay(): string{
    this.today = new Date();
    var hour = this.today.getHours();
    if(hour < 13 && hour >= 0){ return "Morning"}
    if(hour < 17){ return "Afternoon"}
    else{ return "Evening"};
  }
  
  
  applyFilter(filterValue: string){
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.rehabPlansService.SearchPlans(filterValue, 0).subscribe(data => {
      var retObj : any = data;
      this.total = retObj.total;
      
      this.offset = 0;
      this.rehabPlans = Object.assign([], retObj.docs);
    });
  }
  
  createPlan(planName: string, descript: string, author: string, goalOfPlan: string){

    var body = {
      name: planName,
      description: descript,
      authorName: author,
      goal: goalOfPlan
    };
    this.rehabPlansService.CreatePlan(body).subscribe(data =>{
      
      this.rehabPlansService.getPlans().subscribe(data => {
        this.total = data.total;
        this.rehabPlans = Object.assign([], data.docs)
      });
    });
   
  }
  
  open(content){
    this.modalService.open(content, {size: "lg"});
  }
  
  plan(content){
    this.modalService.open(content, {size: "lg"});
  }
  
  loadAllExercises(){
    this.exerciseService.GetAllExercises().subscribe(data =>{
      var retObj: any = data;
      this.allExercises = Object.assign([], retObj.docs);
    });
  }
  
  updateExercises(){
  }

  goBack(){
    this.router.navigate(['../adminhome']);
  }
  
  addExercise( exerciseToBeAdded: any, searchString: any){
    var flag = true;
    for (var i =0; i<this.exercisesInCurrPlan.length; i++){
      if(this.exercisesInCurrPlan[i]._id == exerciseToBeAdded._id){
        flag = false;
      }
    }
    var ID = this.currPlan._id;
    if (flag != false){
      this.rehabPlansService.addExercise(ID, exerciseToBeAdded).subscribe(data => {
        var retObj: any = data;
        this.rehabPlansService.SearchPlans(searchString, this.offset).subscribe(data => {
          var retObj : any = data;
          this.rehabPlans = Object.assign([], retObj.docs);
      
        });
        this.exercisesInCurrPlan.push(exerciseToBeAdded);
    
      });
    }
    this.allExercises.splice(this.allExercises.indexOf(exerciseToBeAdded),1)
  }
  removePlan(searchString){
    var ID = this.currPlan._id;
    this.rehabPlansService.removePlan(ID).subscribe(data => {
     this.rehabPlansService.SearchPlans(searchString, this.offset).subscribe(data => {
          var retObj : any = data;
          this.total = retObj.total;
          this.rehabPlans = Object.assign([], retObj.docs);
          this.currPlan = this.rehabPlans[0];
      
      });
    
    });
    this.rehabPlansService.removeClientFromPlan(ID).subscribe(data => {
    });
    
    
  }

  editThePlan(plan: any, newName: string, newAuthorName: string, newGoalName: string, newDescription: string, searchString){
    plan.name = newName;
    plan.authorName = newAuthorName;
    plan.goal = newGoalName;
    plan.description = newDescription;

    // var newTimeFrame = year + '/' + month + '/' + day;
    // plan.timeFrameToComplete = newTimeFrame;

    this.rehabPlansService.updatePlan(plan).subscribe(data =>{
      //window.location.reload();
      this.rehabPlansService.SearchPlans(searchString, this.offset).subscribe(data => {
          var retObj : any = data;
          this.rehabPlans = Object.assign([], retObj.docs);
      
      });
    
      
    });
    
  }
  removeExercise(exer: any, searchString: any){
    this.currPlan.exerciseObjects.splice(this.currPlan.exerciseObjects.indexOf(exer),1);
    this.rehabPlansService.updatePlan(this.currPlan).subscribe(data =>{
      
      this.rehabPlansService.SearchPlans(searchString, this.offset).subscribe(data => {
        var retObj : any = data;
        this.rehabPlans = Object.assign([], retObj.docs);
      
      });
    });
    var flag = this.allExercises.indexOf(exer);
    this.exercisesInCurrPlan = this.currPlan.exerciseObjects;
    if (flag == -1){
      this.allExercises.push(exer);
    }
  }
  
  viewPlan(plan:any){
    this.currPlan = plan;
    
    
    this.exercisesInCurrPlan = this.currPlan.exerciseObjects;
    
    this.exerciseService.GetAllExercises().subscribe(data =>{
      var retObj: any = data;
      this.allExercises = Object.assign([], retObj.docs);
    });
  } 

  switchPage(event: any, searchString: any){
    if (this.pageIndex<event.pageIndex){
      this.offset+=10;
      this.pageIndex++;
    }
    else{
      this.offset-=10;
      this.pageIndex--;
    }
    this.rehabPlansService.SearchPlans(searchString,this.offset).subscribe(data => {
      var retObj : any = data;
      this.rehabPlans = Object.assign([], retObj.docs);
      
    });
  }
  applyFilter1(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    //this.tests.filter = filterValue;
    this.searchExecises(filterValue);
  }
  searchExecises(searchString: string){
    this.exerciseService.SearchExercises(searchString,"name", this.offset2, 10).subscribe(data =>{
      if(data != []) {
        var retObj:any = data;
        //retObj = retObj.docs;
        this.length2 = retObj.total;
        this.allExercises = retObj.docs;
        if(this.offset2 + 10 > this.length2) {
          this.pageInfo = `${this.offset2} - ${this.length2} of ${retObj.total}` 
        }
        else{
          this.pageInfo = `${this.offset2} - ${this.offset2 + 10} of ${retObj.total}`    
        }
        
      }
    })
  }
   SwitchPageEvent(pageEvent: any, searchString: string) {
    this.offset2 = pageEvent.pageIndex * pageEvent.pageSize;
    this.searchExecises(searchString);
  }
}
