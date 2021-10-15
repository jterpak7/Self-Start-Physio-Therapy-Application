import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAccountsService } from '../user-accounts.service';
import { EmailService} from '../email.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { PhysiotherapistService } from '../physiotherapist.service';
import { ExerciseService } from '../exercise.service';
import { PatientService } from '../patient.service';
import { RehabPlansService } from '../rehab-plans.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

  resetUsers: any[];
  physioList: any[];
  currPhysios: any;
  currPatients: any;
  currExercises: any;
  currPlans: any;

  constructor(private router: Router, 
              private userAccountService: UserAccountsService,
              private emailService: EmailService,
              private modalService: NgbModal,
              private physioService: PhysiotherapistService,
              private exerciseService: ExerciseService,
              private clientService: PatientService,
              private rehabPlanService: RehabPlansService) { }

  ngOnInit() {
    this.userAccountService.GetUsersWantingAPasswordReset().subscribe(data => {
      if(data === []){
        return;
      }

      let obj: any = data;
      this.resetUsers = obj;
    })
    this.physioService.getTherapists().subscribe(data =>{
      let obj: any = data;
      this.physioList = obj.docs;
      this.currPhysios = obj.total;
    })
    this.exerciseService.GetAllExercises().subscribe(data => {
      let obj: any = data;
      this.currExercises = obj.total;
    })
    this.clientService.GetAllPatients().subscribe(data =>{
      let obj: any = data;
      this.currPatients = obj.total;
    })
    this.rehabPlanService.getPlans().subscribe(data =>{
      let obj: any = data;
      this.currPlans = obj.total;
    })
  }
  
  goToExercises(){
    this.router.navigate(['../exercises']);
  }
  
  gotToPatients(){
    this.router.navigate(['../client']);
  }
  
  goToDynamicForm(){
    this.router.navigate(['../manageforms']);
    
  }
  
  goToRehabPlans(){
    this.router.navigate(['../rehabplans']);
  }

  ResetPassword(username: string, resetModal) {
    this.emailService.SendRecoveryEmail(username).subscribe(data => {
      this.modalService.open(resetModal);
      this.userAccountService.GetUsersWantingAPasswordReset().subscribe(data => {
        this.resetUsers = Object.assign([], data);
      })
    })
  }

  ResetAllRequests(allResetModal){
    this.resetUsers.forEach(element =>{
      this.emailService.SendRecoveryEmail(element.userAccountName).subscribe(data => {
        this.userAccountService.GetUsersWantingAPasswordReset().subscribe(data => {
          this.resetUsers = Object.assign([], data);
        })
      })
    })
    this.modalService.open(allResetModal);
  }
  
}

