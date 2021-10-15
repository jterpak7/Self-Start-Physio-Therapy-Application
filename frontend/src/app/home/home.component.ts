import { Component, OnInit } from '@angular/core';
import { ExerciseService } from '../exercise.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  constructor(private exerciseService: ExerciseService,
              private cookieService: CookieService) { }

  ngOnInit() {
    
  }

}