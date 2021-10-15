import { Component, OnInit } from '@angular/core';
import { PatientService } from '../patient.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NewClientService } from '../new-client.service';
import {PhysiotherapistService} from '../physiotherapist.service';


@Component({
  selector: 'app-clients-of-therapist',
  templateUrl: './clients-of-therapist.component.html',
  styleUrls: ['./clients-of-therapist.component.css']
})
export class ClientsOfTherapistComponent implements OnInit {

  constructor(private patientService: PatientService,
              private newClientService: NewClientService,
              private modalService: NgbModal,
              private router: Router,
              private location: Location, private physiotherapistService: PhysiotherapistService ) { }
  
  
  clients: Object[];
  allClients: Object[];
  activated: any;
  physioId: string;
  therapist: any = " ";
  genders: Object[];
  countries: Object[];
  provinces: Object[];
  cities: Object[];
  invalidUsername: boolean = false;
  invalidPassword: boolean = false;
  invalidFirstname: boolean = false;
  invalidLastname: boolean = false;
  invalidEmail: boolean = false;
  invalidGender: boolean = false;
  invalidDOB: boolean = false;
  invalidPhoneNumber: boolean = false;
  invalidPostalCode: boolean = false;
  invalidCountry: boolean = false;

  
  
  ngOnInit() {
    this.physioId=((this.location.path()).split("/",3))[2];
    this.physiotherapistService.getInfo(this.physioId).subscribe(data =>{
      var retObj: any = data;
      this.therapist = Object.assign([], retObj.physiotherapist);
    });
    
    this.patientService.getPhysioPatients(this.physioId).subscribe(data => {
      console.log(data);
      var retObj: any = data;
      this.clients = Object.assign([], retObj.docs);
      
    });
    this.patientService.GetAllPatients().subscribe(data => {
        this.allClients = Object.assign([], data.docs);
    });

    this.patientService.GetGenders().subscribe(data => {
      var retObj: any = data;
      this.genders = Object.assign([], retObj.gender);
    });
    this.patientService.GetCountries().subscribe(data => {
      var retObj: any = data;
      this.countries = Object.assign([], retObj.country);
    });
  }
   show(client: any){
    //this.content = !(this.content);
    if(this.activated == client){
      this.activated =null;
    }
    else{
      this.activated = client;
    }
    
  }
  open(content) {
    this.modalService.open(content, {size: 'lg'});
  }
  GetProvinces(countryId: string) {
    //retrieve all provinces within a certain country
    this.patientService.GetProvinces(countryId).subscribe(data => {
      var retObj: any = data;
      this.provinces = Object.assign([], retObj.province);
    })
  }
  clear(){
  
    
  }

  GetCities(provinceId: string) {
    //retrieve all cities within a certain province
    this.patientService.GetCities(provinceId).subscribe(data => {
      var retObj: any = data;
      this.cities = Object.assign([], retObj.cities);
    })
  }

  SetProvinceBox(provinceBox, cityBox){
    // a new country has been selected so remove all entries from the province and city boxes 
    provinceBox.selectedIndex = -1;
    cityBox.selectedIndex = -1;
    while (provinceBox.options.length > 0) {                
      provinceBox.remove(0);
    } 
    while (cityBox.options.length > 0) {                
      cityBox.remove(0);
    } 
  }
   DifferentGetProvince(countryId: string) {
     //This gets the cities for the first province selected
     this.patientService.GetProvinces(countryId).subscribe(data => {
      var retObj: any = data;
      this.provinces = Object.assign([], retObj.province);
      console.log(data);
      this.GetCities(retObj.province[0]._id);
    })
  }
  ClearAndGetCities(provinceId: string, cityBox) {
    //clear the city box and repopulate it with cities within the selected province
    while (cityBox.options.length > 0) {                
      cityBox.remove(0);
    } 

    this.patientService.GetCities(provinceId).subscribe(data => {
      var retObj: any = data;
      this.cities = Object.assign([], retObj.cities);
    });
  }
  updatePatient(ID: string, firstName: string, lastName: string, patientID: string, email: string, DOB: string, postalCode: string, phoneNumber: string, others: string, newCountry: any, newProvince: any, newCity: any, newGender: any, newAddress: any) {
    
   //this.showSuccess = true;
    this.patientService.UpdatePatient(ID, firstName, lastName, patientID, email, DOB, postalCode, phoneNumber, others, newCountry, newProvince, newCity, newGender, newAddress).subscribe(data => {
      console.log(data);
      //reload the list of patients
      this.patientService.getPhysioPatients(this.physioId).subscribe(data => {
        var retObj: any = data;
        this.clients = Object.assign([], retObj.patient);
        console.log(data);
      });
      this.activated = null;
      if(data.success) {
        //the update was successful
        //this.showSuccess = true;
      }
      else{
        //it was not successfuls
        //this.showFailure = true;
      }
    });

  }
   deletePatient(ID: string) {
    this.patientService.DeletePatient(ID).subscribe(data => {
      var retObj: any = data;
      if(retObj.success){
        // this.showDeleteSuccess = true;
        // this.showSuccess = false;
        // this.showFailure = false;
        // this.showCreationSuccess = false;
        this.activated = null;
        //acc.activeIds = []; //close all accordian panels
        this.patientService.getPhysioPatients(this.physioId).subscribe(data => {
          var retObj: any = data;
          this.clients = Object.assign([], retObj.patient);
        });
      }
      else { 
       // this.showFailure = true;
      }
      
    });

  }
   ResetErrorMessages() {
    //Reset all the error messages. Then new ones will be shown if some still exist
    var usernameBox = document.getElementById('inputUsername').style.borderColor = 'rgba(0,0,0,.15)';
    var passwordBox = document.getElementById('inputPassword').style.borderColor = 'rgba(0,0,0,.15)';
    var repeatPasswordBox = document.getElementById('inputRepeatPassword').style.borderColor = 'rgba(0,0,0,.15)';
    var firstnameBox = document.getElementById('inputFirstName').style.borderColor = 'rgba(0,0,0,.15)';  
    var lastnameBox = document.getElementById('inputLastName').style.borderColor = 'rgba(0,0,0,.15)';  
    var DOBBox = document.getElementById('inputDOB').style.borderColor = 'rgba(0,0,0,.15)';
    var postalCodeBox = document.getElementById('inputPostalCode').style.borderColor = 'rgba(0,0,0,.15)';
    var firstnameBox = document.getElementById('inputGender').style.borderColor = 'rgba(0,0,0,.15)';   
    var countryBox = document.getElementById('inputCountry').style.borderColor = 'rgba(0,0,0,.15)';    
    var provinceBox = document.getElementById('inputProvince').style.borderColor = 'rgba(0,0,0,.15)';    
    var cityBox = document.getElementById('inputCity').style.borderColor = 'rgba(0,0,0,.15)';  
    var emailBox = document.getElementById('inputEmail').style.borderColor = 'rgba(0,0,0,.15)';
    var phoneBox = document.getElementById('inputPhoneNumber').style.borderColor = 'rgba(0,0,0,.15)';
    this.invalidUsername= false;
    this.invalidPassword= false;
    this.invalidFirstname= false;
    this.invalidLastname= false;
    this.invalidGender= false;
    this.invalidDOB= false;
    this.invalidPhoneNumber = false;
    this.invalidPostalCode = false;
    this.invalidCountry = false;  
    this.invalidEmail = false;
  }
   createClient(makeChanges,successfulModal) {
    //because of the scoping rules of the md-step, the values of the text boxes need to be retrieved with javascript
    //need to retrieve all the textboxes and extract their values
    var username: any = document.getElementById('inputUsername');
    username = username.value;
    var password: any = document.getElementById('inputPassword');
    password = password.value;
    var repeatPassword: any = document.getElementById('inputRepeatPassword');
    repeatPassword = repeatPassword.value;
    var firstName: any = document.getElementById('inputFirstName');  
    firstName = firstName.value;
    var lastName: any = document.getElementById('inputLastName');  
    lastName = lastName.value;
    var DOB: any = document.getElementById('inputDOB');
    DOB = DOB.value;
    var postalCode: any = document.getElementById('inputPostalCode');
    postalCode = postalCode.value;
    var gender: any = document.getElementById('inputGender');   
    gender = gender.value;
    var country: any = document.getElementById('inputCountry'); 
    country = country.value;
    var province: any = document.getElementById('inputProvince');   
    province = province.value;
    var city: any = document.getElementById('inputCity'); 
    city = city.value;
    var email: any = document.getElementById('inputEmail');
    email = email.value;
    var phone: any = document.getElementById('inputPhoneNumber');
    phone = phone.value;
    //var maritalStatus: any = document.getElementById('inputMaritalStatus');
    // maritalStatus = maritalStatus.value;
    // var occupation: any = document.getElementById('inputOccupation');
    // occupation = occupation.value;
    // var healthCardNumber: any = document.getElementById('inputHealthCardNumber');
    // healthCardNumber = healthCardNumber.value;
     var others: any = document.getElementById('inputOthers');
    others = others.value;
    var address: any = document.getElementById('inputAddress');
    address = address.value;
    this.ResetErrorMessages();
    var cannotContinue: boolean = false; //if there are any errors in the form this stops from sending the request from the server
    if(password != repeatPassword || !password || !repeatPassword){
      //error in this case, handle it and let the user know they made a mistake
      var passwordBox = document.getElementById('inputPassword').style.borderColor = 'red';
      var repeatPasswordBox = document.getElementById('inputRepeatPassword').style.borderColor = 'red';
      this.invalidPassword = true;
      cannotContinue = true;
    }

    var badFormat = /[ !\s\t@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/; //regex statement to limit bad characters in a username
    var badFormatWithNumbers =  /[ !\s\t@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\d]/ //regex format to confirm input of first name and last name
    var badFormatWithLetters = /[ !\s\t@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
    var emailFormat =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    var validPhoneNumber = /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/

    if(badFormat.test(username) || !username) {
      //username contains an illegal character
      var usernameBox = document.getElementById('inputUsername').style.borderColor = 'red';
      this.invalidUsername = true;
      cannotContinue = true;
    }
    
    if(badFormatWithNumbers.test(firstName) || !firstName) {
      var firstnameBox = document.getElementById('inputFirstName').style.borderColor = 'red';    
      this.invalidFirstname = true;
      cannotContinue = true;
    }

    if(badFormatWithNumbers.test(lastName) || !lastName) {
      var firstnameBox = document.getElementById('inputLastName').style.borderColor = 'red';    
      this.invalidLastname = true;
      cannotContinue = true;
    }

    if(!DOB) {
      var DOBBox = document.getElementById('inputDOB').style.borderColor = 'red';
      this.invalidDOB = false;
      cannotContinue = true;
    }

    if(!postalCode) {
      var postalCodeBox = document.getElementById('inputPostalCode').style.borderColor = 'red';
      this.invalidPostalCode = true;
      cannotContinue = true;
    }

    
    if(!validPhoneNumber.test(phone)){
      var phoneBox = document.getElementById('inputPhoneNumber').style.borderColor = 'red';
      this.invalidPhoneNumber = true;
      cannotContinue = true;
    }
    if(!emailFormat.test(email)) {
      var emailBox = document.getElementById('inputEmail').style.borderColor = 'red';
      this.invalidEmail = true;
      cannotContinue = true;
    }

    //if gender is "badvalue" than a selection wasn't chosen
    if(gender == "badvalue") {
      var firstnameBox = document.getElementById('inputGender').style.borderColor = 'red';    
      this.invalidGender = true;
      cannotContinue = true;
    }

    //if country is "badvalue" than a selection wasn't chosen
    if(country == "badvalue") {
      var countryBox = document.getElementById('inputCountry').style.borderColor = 'red';    
      var provinceBox = document.getElementById('inputProvince').style.borderColor = 'red';    
      var cityBox = document.getElementById('inputCity').style.borderColor = 'red';    
      this.invalidCountry = true;
      cannotContinue = true;
    }

    //if this if statement is triggered, there are errors in the code
    if(cannotContinue) {
      this.modalService.open(makeChanges, {size: 'lg'});
      return;
    }

    this.newClientService.CreateClientWithPhysioAssigned(username, password, lastName, firstName, email, DOB, gender, postalCode, phone, others, country, province, city,this.physioId,address).subscribe(data => {
      var retObj: any = data;
      if(retObj.success == true) {
        this.newClientService.SendToVerification(retObj.patient._id, email,firstName,lastName).subscribe(data => {
        })
         this.patientService.getPhysioPatients(this.physioId).subscribe(data => {
           var retObj: any = data;
          this.clients = Object.assign([], retObj.docs);
         
    });
      }
      else {
        //the user will be shown an error in the creation problem along the lines of there being a server problem.
      }
    })
  }
}
