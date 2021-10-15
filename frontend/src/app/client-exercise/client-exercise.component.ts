import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap/carousel/carousel';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ImageService } from '../image.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import * as jsPDF from 'jspdf';
import { CookieService } from 'ngx-cookie-service';
import { PatientService } from '../patient.service';
import { RehabPlansService } from '../rehab-plans.service';


@Component({
  selector: 'app-client-exercise',
  templateUrl: './client-exercise.component.html',
  styleUrls: ['./client-exercise.component.css']
})
export class ClientExerciseComponent implements OnInit {

  exercises: Object [];
  currExercise: any;
  images: any [];
  timeOfDay: string;
  currSteps: string [];
  client: any;
  clientID: any;
  clientPlan: any;
  noPause = true;

  @ViewChild('test') test: ElementRef;
  @ViewChild('test2') test2: ElementRef;
  
  constructor( private router: Router,
               private imageService: ImageService,
               private iconRegistry: MatIconRegistry,
               private sanitizer: DomSanitizer,
               private cookieService: CookieService,
               private patientService: PatientService,
               private planService: RehabPlansService) {
                 iconRegistry.addSvgIcon(
                    'dumbbell',
                    sanitizer.bypassSecurityTrustResourceUrl('../assets/images/dumbbell.svg'));
                }

  ngOnInit() {
    this.timeOfDay = this.getTimeOfDay();
    this.cookieService.set('stupidID', "5ab0007926bba10fad373817");
    this.clientID = this.cookieService.get('ID');
    this.client = this.patientService.GetPatientInfo(this.clientID).subscribe(data =>{
      var obj: any = data;
      obj = obj.patient;
      this.client = obj;
      this.clientPlan = obj.rehabPlan;
      this.exercises = this.clientPlan.exerciseObjects;
      this.currExercise = this.exercises[0];
      this.getExerciseInfo(this.currExercise);
      this.getExerciseImages(this.currExercise._id, this.currExercise.name);
    })
  }

  getTimeOfDay(): string{
    var now = new Date();
    var hour = now.getHours();
    if(hour < 13 && hour >= 0){ return "Morning"}
    if(hour < 17){ return "Afternoon"}
    else{ return "Evening"};
  }

  getExerciseInfo(exercise: any){
    if(exercise.actionSteps == null || exercise.actionSteps == undefined){ return; }
    this.currExercise = exercise;
    var steps = exercise.actionSteps.split(/[0-9]+\./g);
    this.currSteps = steps;
    this.currSteps.shift();
  }

  getExerciseImages(id: string, name:string){
    this.images = null;
    this.imageService.GetExerciseImage(id).subscribe(data=>{
      var obj: any = data;
      this.images = obj.images;
    })
  }

  openPrint(exercise: any){
    let doc = new jsPDF();

    let specialElementHandlers = {
      '#editor': function(element, renderer){
        return true;
      }
    }

    let content = this.test.nativeElement;

    doc.fromHTML(content.innerHTML, 15, 15, {
      'width': 180,
      'elementHandlers': specialElementHandlers
    });

    var pageHeight = doc.internal.pageSize.height;
    
    // Before adding new content
    var y = 500 // Height position of new content
    if (y >= pageHeight)
    {
      doc.addPage();
      y = 0 // Restart height position
    }

    var vert = 0;
    doc.text( 30, 30, "Images:");
    this.images.forEach(image => {

      if(image.type === 'PNG' || image.type === "png"){ console.log("png"); var imgData = 'data:image/png;base64,' + image.data;}
      if(image.type === 'JPG' || image.type === "jpg"){ console.log("jpg"); var imgData = 'data:image/jpg;base64,' + image.data;}

      if(vert == 0){
        vert = 40;
      }
      else{
        vert = 140;
      }
      console.log(imgData);
      doc.addImage(imgData, 'PNG', 50, vert, 100, 100);
    });

    doc.save(exercise.name + '.pdf');

  }

  // openCarousel(carouel: any){
  //   document.
  // }
}
