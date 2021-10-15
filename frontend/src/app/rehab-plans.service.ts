import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders } from '@angular/common/http';


const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class RehabPlansService {

  constructor(private http: HttpClient) { }
  
  CreatePlan(body: any){
    return this.http.post('/api/rehabPlans', body);
  }
  getPlans(): any{
      //return this.http.get('/api/rehabPlans');
    var url = '/api/rehabPlans?s=name&sortorder=asc&offset=0';
    return this.http.get(url);
  }
  getExercises(ID: string):  any{
    return this.http.get('/api/exercises/rehabPlan/' + ID);
  }
  addExercise(ID: string, exercise: any){
    return this.http.put('/api/rehabPlans/' + ID + '/addEx', {exerciseObjects: exercise});
  }
  removePlan(ID: string){
    return this.http.delete('/api/rehabPlans/' + ID);
  }
  updatePlan(plan: any){
    return this.http.put('api/rehabPlans/' + plan._id, plan);
  }

  SearchPlans(searchString: string, offset){
    // var url = '/api/rehabPlans/findplan/search?q=' + word;
    // return this.http.get(url);
    var url = '/api/rehabPlans/?q=' + searchString + '&s=name'+ '&sortorder=asc' + '&offset=' + offset;
    return this.http.get(url);
  }
  
  removeClientFromPlan(ID: string){
    var url = '/api/patient/unassignPlan' + ID;
    return this.http.put(url, "");
  }

  GetCurrentAssesmentTest(id: string){
    var url = '/api/rehabPlans/gettest/' + id;
    return this.http.get(url);
  }
  
}
