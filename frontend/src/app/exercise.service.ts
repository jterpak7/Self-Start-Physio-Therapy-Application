import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class ExerciseService {

  constructor( private httpClient: HttpClient ) { }

  GetAllExercises() : any{
    var url = '/api/exercises?s=name&offset=0&pageSize=10';
    return this.httpClient.get(url);
  }

  GetClientExercises(id: string){
    var url = '/api/' + id + 'exercises';
    return this.httpClient;
  }

  DeleteExercise(id: string) {
    var url = '/api/exercises/' + id;
    return this.httpClient.delete(url);
  }

  UpdateExercise(id:string,  exName: string, descrip: string, objs: string, actSteps: string, loc: string, freq: number, dur: number, media: any) : any {
    // body of the exercise request
    var body ={
      name: exName,
      description: descrip,
      objectives: objs,
      actionSteps: actSteps,
      location: loc,
      frequency: freq,
      duration: dur,
      multimedia: media
    }

    var url = '/api/exercises/' + id;
    return this.httpClient.put(url, body);
  }

  AddExercise(exName: string, descrip: string, objs: string, actSteps: string, loc: string, freq: number, dur: number, media: any) : any{
    var body ={
      name: exName,
      description: descrip,
      objectives: objs,
      actionSteps: actSteps,
      location: loc,
      frequency: freq,
      duration: dur,
      multimedia: media
    }

    var url = '/api/exercises';
    return this.httpClient.post(url, body);
  }

  SearchExercises(searchString: string, searchArea: string, offset, pageSize){
    var url = '/api/exercises?q=' + searchString + '&s=' + searchArea + '&offset=' + offset + '&pageSize=' + pageSize;
    return this.httpClient.get(url);
  }
  
}
