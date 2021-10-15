import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute } from '@angular/router'


@Component({
  selector: 'app-wrong-account',
  templateUrl: './wrong-account.component.html',
  styleUrls: ['./wrong-account.component.css']
})
export class WrongAccountComponent implements OnInit {

  isAdmin: boolean;
  isPhysio: boolean;
  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    var url =this.route.snapshot.routeConfig.path
    if(url.includes('admin')){
      this.isAdmin = true;
    }
    else{
      this.isPhysio = true;
    }
  }

}
