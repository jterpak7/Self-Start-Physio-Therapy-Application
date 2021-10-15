import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'appliaction/json'})
}

@Injectable()
export class ImageService {

  constructor( private httpClient: HttpClient ) { }

  GetExerciseImage(exercise: String) {
    var url = '/api/image/' + exercise;
    return this.httpClient.get(url);
  }

  sendExerciseID( exercise_id: any , fileName: any ) {
    var url = 'api/image/setid';
    var body = {
      _id: exercise_id,
      image: fileName
    }
    return this.httpClient.put(url, body);
  }

  deleteImage( image: any ){
    var url = "/api/image/" + image;
    return this.httpClient.delete(url);
  }

  GetAppointmentImages(id: string){
    var url = '/api/image/appointimages/' + id;
    return this.httpClient.get(url);
  }

  LinkAppointment(id: string, image: string){
    var body = {
      image: image
    };
    var url = '/api/image/appointment/' + id;
    return this.httpClient.put(url, body);
  }

}
