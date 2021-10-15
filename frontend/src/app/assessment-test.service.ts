import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AssessmentTestService {

    constructor(private http: HttpClient,
                private cookieService: CookieService) { }


    createPlan(name1: string, description1: string, questions1: any[]){
        var url = '/api/assessmentTest';
        var body = {
            name: name1,
            description: description1,
            questions: questions1,
            completed: false
            
        };
        return this.http.post(url,body);

    }    
    getTests(){
        var url = '/api/assessmentTest?s=name&sortorder=asc&offset=0';
        return this.http.get(url);
    }
    
    search(searchString: string, searchArea: string, offset, ascvsdesc){
        var url = '/api/assessmentTest?q=' + searchString + '&s=' + searchArea + '&sortorder=' + ascvsdesc + '&offset=' + offset;
        return this.http.get(url);
    }

    createPlanwithAssignedTest(name1: string, description1: string, questions1: any[], clientId: string){
        var url = '/api/assessmentTest';
        var body = {
            name: name1,
            description: description1,
            questions: questions1,
            completed: false,
            belongsTo: clientId
            
        };
        return this.http.post(url,body);

    }    
    
    GetPlans() {
        var url = '/api/assessmentTest';

        return this.http.get(url);
    }
    
    getAllCompleted(){
        var url = '/api/assessmentTest/getCompleted';
        return this.http.get(url);
    }

    SendCompletedQuestions(assessmentID: string, completedQuestions) {
        var url = "/api/assessmentTest/client/completed";
        var body = {
            assessmentID: assessmentID,
            questions: completedQuestions
        }

        return this.http.put(url, body);

    }

    
    completeTest(name: string, description: string, dateCompleted: Date, dateCreated: Date, questions:any, physioRating: number, phsyioComments: string, pat_id: string){
        var url = "/api/assessmentTest/completedTests";
        var body = {
            name: name,
            description: description,
            completed: false,
            dateCompleted: dateCompleted,
            dateCreated: dateCreated,
            questions: questions,
            physioRate: physioRating,
            physioDescription: phsyioComments,
            patient: pat_id
        }
        return this.http.post(url, body);
    }
    
    assignFollowUp(physioComments: string, physioRating: number, testId: any){
        var url = '/api/assessmentTest/assignFollowup/' + testId;
        var body = {
            physioDescription: physioComments,
            physioRate: physioRating,
            //finalThoughts: finalThoughts
        }
        return this.http.put(url,body);
    }

    GetCompletedTests(id: string){
        var url = '/api/assessmentTest/getresults/' + id;
        return this.http.get(url);
    }

    CompletedInitialAppointment(completedTest: any) {
        var url = '/api/assessmentTest/initial/completed';
        var body = completedTest;
        return this.http.post(url, body);
    }

    GetUsersInitialInjuries(userID: string) {
        var url = '/api/assessmentTest/initial/getbyid/' + userID;
        return this.http.get(url);
    }

    CreateCompletedTest(userID: string, name: string, description: string, questions: any) {
        var url = '/api/assessmentTest/completedtest/' + userID;
        var body = {
            name: name, 
            description: description,
            questions: questions
        }

        return this.http.post(url, body);
    }

    GetFinalResults(userID: string, injuryNum) {
        var url = '/api/assessmentTest/completedtest/final/' + userID + '?num=' + injuryNum;

        return this.http.get(url);
    }
    linktoPlan(ID: any, rehabID:any){
        var url = '/api/rehabPlans/assignTest/'+rehabID;
        var body = {
            assessmentTests: ID
        }
        return this.http.put(url,body);
    }
    closeInjury(physioComments: string, testId: any, physioRating: Number, finalThoughts: string){
        var url = '/api/assessmentTest/closeTreatment/' + testId;
        var body = {
            physioDescription: physioComments,
            physioRate: physioRating,
            finalThoughts: finalThoughts
        }
        return this.http.put(url,body);
    }
    searchCompletedTests(searchString: string, searchArea: string, offset, ascvsdesc){
        var url = '/api/assessmentTest/getCompleted?q=' + searchString + '&s=' + searchArea + '&sortorder=' + ascvsdesc + '&offset=' + offset;
        return this.http.get(url);
    }

    GetOldestTests(){
        var url = '/api/assessmentTest/getCompleted/?s=dateCompleted&sortorder=asc&offset=0';
        return this.http.get(url);
    }
}
