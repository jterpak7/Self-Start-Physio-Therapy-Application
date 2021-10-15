import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ExerciseService } from '../exercise.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { ImageService } from '../image.service';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap/carousel/carousel';
import { PageEvent, MatIconRegistry } from '@angular/material';
import { FormControl } from '@angular/forms';
import { PhysioHomeService } from '../physio-home.service';
import { CookieService } from 'ngx-cookie-service';
import { DomSanitizer } from '@angular/platform-browser';
import { PhysiotherapistService } from '../physiotherapist.service';


const URL = '/api/image';

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.css']
})
export class ExercisesComponent implements OnInit {

  obj: Object [];
  exercises: Object [];
  closeResult: string;
  images: any [];
  activated: any;
  invalidSearchArea: boolean;
  offset = 0;
  length = 0;
  pageSize = 10;
  pageSizeOptions = [10];
  pageEvent: PageEvent;
  noPause = true;
  panelColor = new FormControl('blue');
  physio: any;
  today: Date;
  timeOfDay: string;


  @ViewChild('carousel') carousel:NgbCarousel;

  public uploader:FileUploader = new FileUploader({url: URL});

  constructor( private exerciseService: ExerciseService, 
               private modalService: NgbModal,
               private router: Router,
               private imageService: ImageService,
               private physioHome: PhysioHomeService,
               private cookieService: CookieService,
               private sanitizer: DomSanitizer,
               private iconRegistry: MatIconRegistry,
               private physioService: PhysiotherapistService) { 
                iconRegistry.addSvgIcon(
                  'dumbbell',
                  sanitizer.bypassSecurityTrustResourceUrl('../assets/images/dumbbell.svg'));
                  setInterval(() => {
                    this.today = new Date();
                  }, 30000);  
               }

  ngOnInit() {
    this.timeOfDay = this.getTimeOfDay();
    this.exerciseService.GetAllExercises().subscribe(data =>{
      // data comes back as exercise (singular!!!!!)
      var obj : any = data;
      this.exercises = obj.docs;
      this.length = data.total;
    })
    this.physioService.GetPhysioByUserID().subscribe(data =>{
      let obj: any = data;
      this.physio = obj.physio;
    })
  }

  getTimeOfDay(): string{
    this.today = new Date();
    var hour = this.today.getHours();
    if(hour < 13 && hour >= 0){ return "Morning"}
    if(hour < 17){ return "Afternoon"}
    else{ return "Evening"};
  }

  SetOffset( searchValue: string, searchArea: string, event: PageEvent){
    this.offset = event.pageIndex;
    this.pageSize = event.pageSize;

    this.exerciseService.SearchExercises(searchValue, searchArea, this.offset * this.pageSize, this.pageSize).subscribe(data =>{
      if(data != []){
        var obj: any = data;
        this.exercises = obj.docs;
      }
    })
  }

  open(content) {
    this.modalService.open(content, {size: "lg"});
  }

  updateExercise(id: string, exName: string, descrip: string, objs: string, actSteps: string, loc: string, freq: number, dur: number) {

    var fileNames = []; 
    for(var i = 0; i < this.uploader.queue.length; i++){
      fileNames[i] = this.uploader.queue[i].file.name;
    }

    this.exerciseService.UpdateExercise(id, exName, descrip, objs, actSteps, loc, freq, dur, fileNames)
    .subscribe(data =>{
      //now link images to exercise

      if(this.uploader.queue.length > 0){
        fileNames.forEach(element => {
          this.imageService.sendExerciseID(data.exercise._id, element).subscribe(data =>{
          })
        })
      }

      this.exerciseService.GetAllExercises().subscribe(data =>{
        // data comes back as exercise (singular!!!!!)
        var obj : any = data;
        this.exercises = obj.docs;
        this.length = data.total;
      })
    })
  }

  deleteExercise(id: string) {
    this.exerciseService.DeleteExercise(id).subscribe(data => {
      this.exerciseService.SearchExercises("", "name", this.offset, this.pageSize).subscribe(data =>{
        if(data != []){
          var obj: any = data;
          this.exercises = obj.docs;
          this.length = obj.total;
        }
      })
    })
  }

  addExercise(exName: string, descrip: string, objs: string, actSteps: string, loc: string, freq: number, dur: number){
    
    var fileNames = []; 
    for(var i = 0; i < this.uploader.queue.length; i++){
      fileNames[i] = this.uploader.queue[i].file.name;
    }
    
    this.exerciseService.AddExercise(exName, descrip, objs, actSteps, loc, freq, dur, fileNames).subscribe(data =>{
      if(this.uploader.queue.length > 0){
        fileNames.forEach(element => {
          this.imageService.sendExerciseID(data.exercise._id, element).subscribe(data =>{
          })
        })
      }
      this.exerciseService.SearchExercises("", "name", this.offset, this.pageSize).subscribe(data =>{
        if(data != []){
          var obj: any = data;
          this.exercises = obj.docs;
          this.length = obj.total;
        }
      })
    })
  }

  getExerciseImages( exercise: any ){
    this.imageService.GetExerciseImage(exercise).subscribe(data =>{
      var obj: any;
      obj = data;
      this.images = obj.images;
    })
  }

  deleteImage( image: any){
    this.imageService.deleteImage(image).subscribe(data =>{

      var index = this.images.indexOf(image);
      this.images.splice(index, 1);     
    })
  }

  show(exercise: any){
    if(this.activated == exercise){
      this.activated = null;
    }
    else{
      this.activated = exercise;
    }
  }

  SearchExercises(searchString: string, searchArea: string){
    this.exerciseService.SearchExercises(searchString, searchArea, this.offset, this.pageSize).subscribe(data =>{
      if(data != []){
        var obj: any = data;
        this.exercises = obj.docs;
      }
    })
  }

  openSearchArea(searchArea: any){
    searchArea.show();
  }

}

