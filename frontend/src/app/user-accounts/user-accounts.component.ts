import { Component, OnInit } from '@angular/core';
import { PatientService } from '../patient.service';
import { UserAccountsService } from '../user-accounts.service';
import {RehabPlansService} from '../rehab-plans.service';
import {PhysiotherapistService} from '../physiotherapist.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { NewClientService } from '../new-client.service';
import { Router } from '@angular/router';
import { EmailService } from '../email.service';
import { EncryptionService } from '../encryption.service';
import * as moment from 'moment';

@Component({
  selector: 'app-user-accounts',
  templateUrl: './user-accounts.component.html',
  styleUrls: ['./user-accounts.component.css']
})
export class UserAccountsComponent implements OnInit {

  constructor(private patientService: PatientService,
              private userAccountService: UserAccountsService,
              private rehabPlansService: RehabPlansService,
              private physiotherapistService: PhysiotherapistService,
              private modalService: NgbModal,
              private newClientService: NewClientService,
              private emailService: EmailService,
              private encryptionService: EncryptionService,
              private router: Router) { }
  
  clients: Object[];
  pageInfo: string;
  closeResult: string;
  offset: number = 0;
  physioOffset:number = 0;
  therapists: Object[];
  content: boolean;
  activated: any;
  genders: Object[];
  countries: Object[];
  provinces: Object[];
  cities: Object[];
  totalPatients: number;
  showSuccess: boolean;
  showCreationSuccess: boolean;
  showDeleteSuccess: boolean;
  showFailure: boolean;
  emailSuccess: boolean;
  ascendingOrd: boolean = true;
  
  invalidFirstname: boolean = false;
  invalidLastname: boolean = false;
  invalidDOB: boolean = false;
  invalidPhoneNumber: boolean = false;
  invalidPostalCode: boolean = false;
  invalidEmail: boolean = false;
  invalidGender: boolean = false;
  invalidCountry: boolean = false;
  invalidAddress: boolean = false;
  cannotContinue: boolean = false;

  //genders: Object[];
  length;
  pageSize = 10;
  pageSizeOptions = [10];
  
  length1;//tempory change this
  pageSize1 = 10;
  pageSizeOptions1 = [10];
  
  ngOnInit() {
    this.content = false;
    this.ascendingOrd = true;
    this.patientService.GetAllPatients().subscribe(data => {
      this.length = data.total;
      this.clients = Object.assign([], data.docs);
      
    });
     this.patientService.GetGenders().subscribe(data => {
       
      var retObj: any = data;
      this.genders = Object.assign([], retObj.gender);
    });
  
    this.physiotherapistService.getTherapists().subscribe(data =>{
      this.length1 = data.total;
      var retObj: any = data;
      this.therapists = Object.assign([], data.docs);
    });
    this.patientService.GetCountries().subscribe(data => {
      var retObj: any = data;
      this.countries = Object.assign([], retObj.country);
    })

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
  showPhysio(therapist: any){
    // this.activated = null;
    if(this.activated == therapist){
      this.activated =null;
    }
    else{
      this.activated = therapist;
    }
    
  }
    
  
   open(content) {
    this.modalService.open(content, {size: 'lg'});
  }
   updatePatient(ID: string, firstName: string, lastName: string, patientID: string, email: string, DOB: string, postalCode: string, phoneNumber: string, others: string, newCountry: string, newProvince: string, newCity: string, newGender: string, newAddress: string) {

    var badFormat = /[ !\s\t@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/; //regex statement to limit bad characters in a username
    var badFormatWithNumbers =  /[ !\s\t@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\d]/ //regex format to confirm input of first name and last name
    var badFormatWithLetters = /[ !\s\t@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
    var emailFormat =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    var validPhoneNumber = /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/
    this.cannotContinue = false;
    if(badFormatWithNumbers.test(firstName) || !firstName) {
      var firstnameBox = document.getElementById('inputFirstName1').style.borderColor = 'red';    
      this.invalidFirstname = true;
      this.cannotContinue = true;
    }

    if(badFormatWithNumbers.test(lastName) || !lastName) {
      var firstnameBox = document.getElementById('inputLastName1').style.borderColor = 'red';    
      this.invalidLastname = true;
      this.cannotContinue = true;
    }

    if(!DOB) {
      var DOBBox = document.getElementById('inputDOB1').style.borderColor = 'red';
      this.invalidDOB = false;
      this.cannotContinue = true;
    }

    if(!newAddress) {
      var newAddressBox = document.getElementById('inputAddress1').style.borderColor = 'red';
      this.invalidAddress = true;
      this.cannotContinue = true;
    }

    if(!postalCode) {
      var postalCodeBox = document.getElementById('inputPostalCode1').style.borderColor = 'red';
      this.invalidPostalCode = true;
      this.cannotContinue = true;
    }
    
    if(!validPhoneNumber.test(phoneNumber)){
      var phoneBox = document.getElementById('inputPhoneNumber1').style.borderColor = 'red';
      this.invalidPhoneNumber = true;
      this.cannotContinue = true;
    }
    if(!emailFormat.test(email)) {
      var emailBox = document.getElementById('inputEmail1').style.borderColor = 'red';
      this.invalidEmail = true;
      this.cannotContinue = true;
    }

    if(this.cannotContinue) {
      //user cannot continue until changes have been fixed
      return;
    }

    this.showSuccess = true;
    this.patientService.UpdatePatient(ID, firstName, lastName, patientID, email, DOB, postalCode, phoneNumber, others, newCountry, newProvince, newCity, newGender, newAddress).subscribe(data => {
      //reload the list of patients
      this.patientService.GetAllPatients().subscribe(data => {
        this.length = data.total;
        this.clients = Object.assign([], data.docs);
      });

      if(data.success) {
        //the update was successful
        this.showSuccess = true;
        var closebtn: any= document.getElementById('closeBtn');
        this.ResetErrorMessages();
        closebtn.click();
      }
      else{
        //it was not successful
        this.showFailure = true;
      }
    })


  }
  updatePhysio(firstName: string, lastName: string, email:string, ID: string, dateHired: string, dateFinished: string, _id: string){
    
  
    var badFormat = /[ !\s\t@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/; //regex statement to limit bad characters in a username
    var badFormatWithNumbers =  /[ !\s\t@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\d]/ //regex format to confirm input of first name and last name
    var badFormatWithLetters = /[ !\s\t@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
    var emailFormat =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    var validPhoneNumber = /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/
    this.cannotContinue = false;
    if(badFormatWithNumbers.test(firstName) || !firstName) {
      var firstnameBox = document.getElementById('inputFirstName2').style.borderColor = 'red';    
      this.invalidFirstname = true;
      this.cannotContinue = true;
    }

    if(badFormatWithNumbers.test(lastName) || !lastName) {
      var firstnameBox = document.getElementById('inputLastName2').style.borderColor = 'red';    
      this.invalidLastname = true;
      this.cannotContinue = true;
    }

    if(!dateHired) {
      var DOBBox = document.getElementById('inputDateHired2').style.borderColor = 'red';
      this.invalidDOB = false;
      this.cannotContinue = true;
    }
     if(!dateFinished) {
      var DOBBox = document.getElementById('inputDateFinished2').style.borderColor = 'red';
      this.invalidDOB = false;
      this.cannotContinue = true;
    }

    if(!emailFormat.test(email)) {
      var emailBox = document.getElementById('inputEmail2').style.borderColor = 'red';
      this.invalidEmail = true;
      this.cannotContinue = true;
    }

    if(this.cannotContinue) {
      //user cannot continue until changes have been fixed
      return;
    }

    this.showSuccess = true;
    this.physiotherapistService.updatePhysio(firstName, lastName, email, ID, dateHired, dateFinished, _id).subscribe (data =>{
      var retObj: any = data;
      //reload the list of patients
      this.physiotherapistService.getTherapists().subscribe(data => {
        this.length1 = data.total;
        this.therapists = Object.assign([], data.docs);
      });
      var closebtn: any= document.getElementById('closeBtn1');
      if(retObj.success) {
        //the update was successful
        this.showSuccess = true;
        var closebtn: any= document.getElementById('closeBtn1');
        this.ResetErrorMessages();
        closebtn.click();
      }
      else{
        //it was not successful
        this.showFailure = true;
      }
    });
  }
  viewClients(id: string){
    this.router.navigate(["../clients/"+id]);
  }

  deletePatient(ID: string) {
    this.patientService.DeletePatient(ID).subscribe(data => {
      var retObj: any = data;
      if(retObj.success){
        this.showDeleteSuccess = true;
        this.showSuccess = false;
        this.showFailure = false;
        this.showCreationSuccess = false;
        this.activated = null;
        //acc.activeIds = []; //close all accordian panels
        this.patientService.GetAllPatients().subscribe(data => {
          this.length = data.total;
          this.clients = Object.assign([], data.docs)
        });
      }
      else { 
        this.showFailure = true;
      }
      
    });
  }

  NewPatient(makeChanges,successfulModal) {
 
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
    var yearDOB: any = document.getElementById('inputyearDOB');
    yearDOB = yearDOB.value;
    var monthDOB: any = document.getElementById('inputmonthDOB');
    monthDOB = monthDOB.value;
    var dayDOB: any = document.getElementById('inputdayDOB');
    dayDOB = dayDOB.value;
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
    var others: any = document.getElementById('inputOthers');
    others = others.value;
    var address: any = document.getElementById('inputAddress');
    address = address.value;
    this.ResetErrorMessages();
    //var cannotContinue: boolean = false; //if there are any errors in the form this stops from sending the request from the server
    if(password != repeatPassword || !password || !repeatPassword){
      //error in this case, handle it and let the user know they made a mistake
      var passwordBox = document.getElementById('inputPassword').style.borderColor = 'red';
      var repeatPasswordBox = document.getElementById('inputRepeatPassword').style.borderColor = 'red';
      //this.invalidPassword = true;
      this.cannotContinue = true;
    }

    var badFormat = /[ !\s\t@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/; //regex statement to limit bad characters in a username
    var badFormatWithNumbers =  /[ !\s\t@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\d]/ //regex format to confirm input of first name and last name
    var badFormatWithLetters = /[ !\s\t@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
    var emailFormat =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    var validPhoneNumber = /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/

    if(badFormat.test(username) || !username) {
      //username contains an illegal character
      var usernameBox = document.getElementById('inputUsername').style.borderColor = 'red';
      //this.invalidUsername = true;
      this.cannotContinue = true;
    }
    
    if(badFormatWithNumbers.test(firstName) || !firstName) {
      var firstnameBox = document.getElementById('inputFirstName').style.borderColor = 'red';    
      //this.invalidFirstname = true;
      this.cannotContinue = true;
    }

    if(badFormatWithNumbers.test(lastName) || !lastName) {
      var firstnameBox = document.getElementById('inputLastName').style.borderColor = 'red';    
      //this.invalidLastname = true;
      this.cannotContinue = true;
    }

    var DOB = yearDOB + '/' + monthDOB + '/' + dayDOB;
    if(!DOB) {
      var DOBBox = document.getElementById('inputyearDOB').style.borderColor = 'red';
      var DOBBox2 = document.getElementById('inputmonthDOB').style.borderColor = 'red';
      var DOBBox = document.getElementById('inputdayDOB').style.borderColor = 'red';
      //this.invalidDOB = false;
      this.cannotContinue = true;
    }

    if(!postalCode || !address) {
      var postalCodeBox = document.getElementById('inputPostalCode').style.borderColor = 'red';
      var addressBox = document.getElementById('inputAddress').style.borderColor = 'red';
      //this.invalidPostalCode = true;
      this.cannotContinue = true;
    }

    
    if(!validPhoneNumber.test(phone)){
      var phoneBox = document.getElementById('inputPhoneNumber').style.borderColor = 'red';
      //this.invalidPhoneNumber = true;
      this. cannotContinue = true;
    }
    if(!emailFormat.test(email)) {
      var emailBox = document.getElementById('inputEmail').style.borderColor = 'red';
      //this.invalidEmail = true;
      this.cannotContinue = true;
    }

    //if gender is "badvalue" than a selection wasn't chosen
    if(gender == "badvalue") {
      var firstnameBox = document.getElementById('inputGender').style.borderColor = 'red';    
      //this.invalidGender = true;
      this.cannotContinue = true;
    }

    //if country is "badvalue" than a selection wasn't chosen
    if(country == "badvalue") {
      var countryBox = document.getElementById('inputCountry').style.borderColor = 'red';    
      var provinceBox = document.getElementById('inputProvince').style.borderColor = 'red';    
      var cityBox = document.getElementById('inputCity').style.borderColor = 'red';    
      //this.invalidCountry = true;
      this.cannotContinue = true;
    }

    //if this if statement is triggered, there are errors in the code
    if(this.cannotContinue) {
      this.modalService.open(makeChanges, {size: 'lg'});
      //stepper.reset();
      return;
    }

    document.body.style.cursor = "wait";


    var hashPassword = this.encryptionService.hash(password);
    var salt = this.encryptionService.GenSalt();
    var hashWithSalt = hashPassword + salt;
    var hashedPassAndSalt = this.encryptionService.hash(hashWithSalt);
    var encryptedPassword = this.encryptionService.encrypt(hashedPassAndSalt);

    this.newClientService.CreateClientFromAdmin(username, encryptedPassword, lastName, firstName, email, DOB, gender, postalCode, phone, others, country, province, city, address, salt).subscribe(data => {

      var retObj: any = data;
      if(retObj.success == true) {
        this.newClientService.SendToVerification(retObj.patient._id, email, firstName, lastName).subscribe(data => {
          document.body.style.cursor = 'default';
          
          var closebtn: any= document.getElementById('closeBtn0');
          this.ResetErrorMessages();
          closebtn.click();
          this.modalService.open(successfulModal);
        });
      }
      else {
        //the user will be shown an error in the creation problem along the lines of there being a server problem.
        //stepper.reset();
        var usernameBox = document.getElementById('inputUsername').style.borderColor = 'red';
        //this.invalidUsername = true;
      }
      this.patientService.GetAllPatients().subscribe(data => {
          this.length = data.total;
          this.clients = Object.assign([], data.docs)
        });
    
      
    });
  }

  
  newPhysio(makeChanges,successfulModal){
    
    
    var username: any = document.getElementById('inputPhysioUsername');
    username = username.value;
    var password: any = document.getElementById('inputPhysioPassword');
    password = password.value;
    var repeatPassword: any = document.getElementById('inputPhysioRepeatPassword');
    repeatPassword = repeatPassword.value;
    var firstName: any = document.getElementById('inputPhysioFirstName');  
    firstName = firstName.value;
    var lastName: any = document.getElementById('inputPhysioLastName');  
    lastName = lastName.value;
    var yearDOB: any = document.getElementById('inputPhysioyearDOB');
    yearDOB = yearDOB.value;
    var monthDOB: any = document.getElementById('inputPhysiomonthDOB');
    monthDOB = monthDOB.value;
    var dayDOB: any = document.getElementById('inputPhysiodayDOB');
    dayDOB = dayDOB.value;
    
    var yearHired: any = document.getElementById('inputYearHired');
    yearHired = yearHired.value;
    var monthHired: any = document.getElementById('inputMonthHired');
    monthHired = monthHired.value;
    var dayHired: any = document.getElementById('inputDayHired');
    dayHired = dayHired.value;
    
    var yearFinished: any = document.getElementById('inputYearFinished');
    yearFinished = yearFinished.value;
    var monthFinished: any = document.getElementById('inputMonthFinished');
    monthFinished = monthFinished.value;
    var dayFinished: any = document.getElementById('inputDayFinished');
    dayFinished = dayFinished.value;
    
    
    // var postalCode: any = document.getElementById('inputPostalCode');
    // postalCode = postalCode.value;
    var gender: any = document.getElementById('inputPhysioGender');   
    gender = gender.value;
 
     var email: any = document.getElementById('inputPhysioEmail');
     email = email.value;
  
    this.ResetErrorMessages();
    //var cannotContinue: boolean = false; //if there are any errors in the form this stops from sending the request from the server
    if(password != repeatPassword || !password || !repeatPassword){
      //error in this case, handle it and let the user know they made a mistake
      var passwordBox = document.getElementById('inputPhysioPassword').style.borderColor = 'red';
      var repeatPasswordBox = document.getElementById('inputPhysioRepeatPassword').style.borderColor = 'red';
      //this.invalidPassword = true;
      this.cannotContinue = true;
    }

    var badFormat = /[ !\s\t@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/; //regex statement to limit bad characters in a username
    var badFormatWithNumbers =  /[ !\s\t@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\d]/ //regex format to confirm input of first name and last name
    var badFormatWithLetters = /[ !\s\t@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
    var emailFormat =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    var validPhoneNumber = /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/

    if(badFormat.test(username) || !username) {
      //username contains an illegal character
      var usernameBox = document.getElementById('inputPhysioUsername').style.borderColor = 'red';
      //this.invalidUsername = true;
      this.cannotContinue = true;
    }
    
    if(badFormatWithNumbers.test(firstName) || !firstName) {
      var firstnameBox = document.getElementById('inputPhysioFirstName').style.borderColor = 'red';    
      //this.invalidFirstname = true;
      this.cannotContinue = true;
    }

    if(badFormatWithNumbers.test(lastName) || !lastName) {
      var firstnameBox = document.getElementById('inputPhysioLastName').style.borderColor = 'red';    
      //this.invalidLastname = true;
      this.cannotContinue = true;
    }

    var DOB = yearDOB + '/' + monthDOB + '/' + dayDOB;
    if(!DOB) {
      var DOBBox = document.getElementById('inputyearDOB').style.borderColor = 'red';
      var DOBBox2 = document.getElementById('inputmonthDOB').style.borderColor = 'red';
      var DOBBox = document.getElementById('inputdayDOB').style.borderColor = 'red';
      //this.invalidDOB = false;
      this.cannotContinue = true;
    }
    var dateHired = yearHired + '/' + monthHired + '/' + dayHired;
    if(!dateHired) {
      var DOBBox = document.getElementById('inputYearHired').style.borderColor = 'red';
      var DOBBox2 = document.getElementById('inputMonthHired').style.borderColor = 'red';
      var DOBBox = document.getElementById('inputDayHired').style.borderColor = 'red';
      //this.invalidDOB = false;
      this.cannotContinue = true;
    }
    var dateFinished = yearFinished + '/' + monthFinished + '/' + dayFinished;
    if(!dateFinished) {
      var DOBBox = document.getElementById('inputYearFinished').style.borderColor = 'red';
      var DOBBox2 = document.getElementById('inputMonthFinished').style.borderColor = 'red';
      var DOBBox = document.getElementById('inputDayFinished').style.borderColor = 'red';
      //this.invalidDOB = false;
      this.cannotContinue = true;
    }


    if(!emailFormat.test(email)) {
      var emailBox = document.getElementById('inputPhysioEmail').style.borderColor = 'red';
      //this.invalidEmail = true;
      this.cannotContinue = true;
    }

    //if gender is "badvalue" than a selection wasn't chosen
    if(gender == "badvalue") {
      var firstnameBox = document.getElementById('inputPhysioGender').style.borderColor = 'red';    
      //this.invalidGender = true;
      this.cannotContinue = true;
    }

    //if this if statement is triggered, there are errors in the code
    if(this.cannotContinue) {
      this.modalService.open(makeChanges, {size: 'lg'});
      return;
    }

    document.body.style.cursor = "wait";


    var hashPassword = this.encryptionService.hash(password);
    var salt = this.encryptionService.GenSalt();
    var hashWithSalt = hashPassword + salt;
    var hashedPassAndSalt = this.encryptionService.hash(hashWithSalt);
    var encryptedPassword = this.encryptionService.encrypt(hashedPassAndSalt);

    //this.newClientService.CreateClient(username, encryptedPassword, lastName, firstName, email, DOB, gender, postalCode, phone, others, country, province, city, address, salt).subscribe(data => {
    this.physiotherapistService.createPhysiobyAdmin(firstName, lastName, email, dateHired, dateFinished, username, encryptedPassword, salt ).subscribe(data => {
      var retObj: any = data;
      if(retObj.success == true) {
        
        var closebtn: any= document.getElementById('closeBtn2');
        this.ResetErrorMessages();
        closebtn.click();
        this.modalService.open(successfulModal),{size: 'lg'};
        document.body.style.cursor = "default";
      }
      else {
        //the user will be shown an error in the creation problem along the lines of there being a server problem.
        var usernameBox = document.getElementById('inputPhysioUsername').style.borderColor = 'red';
      }
      this.physiotherapistService.getTherapists().subscribe(data => {
          this.length1 = data.total;
          var retObj: any = data;
          this.therapists = Object.assign([], data.docs);
        });
    });
    
  }
  GetProvinces(countryId: string) {
    //retrieve all provinces within a certain country
    this.patientService.GetProvinces(countryId).subscribe(data => {
      var retObj: any = data;
      this.provinces = Object.assign([], retObj.province);
    })
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
    })
  }
  deletePhysio1(id: any){
    this.physiotherapistService.deletePhysioTherapist(id).subscribe(data =>{
      var retObj: any = data;
       this.physiotherapistService.getTherapists().subscribe(data => {
          this.length1 = data.total;
          //this.physioOffset = 0;
          this.therapists = Object.assign([], data.docs);
        });
      
      
    });
  }
  calculateAge(DOB: string) {
    var years = moment().diff(DOB, 'years');
    return years;
  }
   HideMessage() {
    //hide all messages, if there are any
    this.showSuccess = false;
    this.showFailure = false;
    this.showDeleteSuccess = false;
    this.showCreationSuccess = false;
    this.emailSuccess = false;
  }
   SwitchPageEvent(pageEvent: any, searchString: string, searchArea: string) {
    this.offset = pageEvent.pageIndex * pageEvent.pageSize;
    this.searchPatients(searchString, searchArea);
  }
   SwitchPageEventPhysio(pageEvent: any, searchString: string, searchArea: string) {
    this.physioOffset = pageEvent.pageIndex * pageEvent.pageSize;
    this.searchPhysio(searchString, searchArea);
  }

   searchPatients(searchString: string, searchArea: string) {
    var ascvsdesc = 'asc';
    if(this.ascendingOrd == true) {
      ascvsdesc = 'asc';
    }
    else {
      ascvsdesc = 'desc';
    }
    this.patientService.SearchPatient(searchString, searchArea, this.offset, ascvsdesc).subscribe(data => {
      if(data != []) {
        var retObj : any = data;
        this.length = retObj.total;
        this.clients = Object.assign([], retObj.docs);
        if(this.offset + 10 > this.length) {
          this.pageInfo = `${this.offset} - ${this.length} of ${retObj.total}` 
        }
        else{
          this.pageInfo = `${this.offset} - ${this.offset + 10} of ${retObj.total}`    
        }
        //this.offset = 0;
        
      }
    })
  }
  searchPhysio(searchString: string, searchArea: string){
    var ascvsdesc;
    if(this.ascendingOrd == true) {
      ascvsdesc = 'asc';
    }
    else {
      ascvsdesc = 'desc';
    }
    this.physiotherapistService.SearchPhysio(searchString, searchArea, this.physioOffset, ascvsdesc).subscribe(data => {
      if(data != []) {
        var retObj : any = data;
        this.length1 = retObj.total;
        this.therapists = Object.assign([], retObj.docs);
        if(this.physioOffset + 10 > this.length1) {
          this.pageInfo = `${this.physioOffset} - ${this.length1} of ${retObj.total}` 
        }
        else{
          this.pageInfo = `${this.physioOffset} - ${this.physioOffset + 10} of ${retObj.total}`    
        }
       // this.physioOffset = 0;
        
      }
    })
  }
  CopyToClipboard(val: string) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
  
  StandardPatientList() {
    var searchAreaBox = document.getElementById('searchDropdown').style.borderColor = 'rgba(0,0,0,.15)';
    //this.invalidSearchArea = false;
    //this.ascendingOrd = true;
    
    this.patientService.GetAllPatients().subscribe(data => {
      var retObj: any = data;
      this.length = retObj.total;
      this.clients = Object.assign([], data.docs);
      this.length = retObj.total;
      this.totalPatients = retObj.total;
    });
  }
  
  
   StandardPhysioList() {
    var searchAreaBox = document.getElementById('searchDropdown').style.borderColor = 'rgba(0,0,0,.15)';
    //this.invalidSearchArea = false;
    //this.ascendingOrd = true;
    
    this.physiotherapistService.getTherapists().subscribe(data => {
      var retObj: any = data;
      this.length1 = retObj.total;
      this.therapists = Object.assign([], data.docs);
      //this.length = retObj.total;
      //this.totalPatients = retObj.total;
    });
  }
  ResetErrorMessages() {
    //Reset all the error messages. Then new ones will be shown if some still exist
    // var firstnameBox = document.getElementById('inputFirstName').style.borderColor = 'rgba(0,0,0,.15)';  
    // var lastnameBox = document.getElementById('inputLastName').style.borderColor = 'rgba(0,0,0,.15)';  
    // var DOBBox = document.getElementById('inputDOB').style.borderColor = 'rgba(0,0,0,.15)';
    // var postalCodeBox = document.getElementById('inputPostalCode').style.borderColor = 'rgba(0,0,0,.15)'; 
    // var emailBox = document.getElementById('inputEmail').style.borderColor = 'rgba(0,0,0,.15)';
    // var phoneBox = document.getElementById('inputPhoneNumber').style.borderColor = 'rgba(0,0,0,.15)';
    // var newAddressBox = document.getElementById('inputAddress').style.borderColor = 'rgba(0,0,0,.15)';    
    // this.invalidFirstname= false;
    // this.invalidLastname= false;
    // this.invalidGender= false;
    // this.invalidDOB= false;
    // this.invalidPhoneNumber = false;
    // this.invalidPostalCode = false;
    // this.invalidEmail = false;
  }
  SendEmail(toEmail: String, emailSubject: String, emailBody: String) { 
    this.emailService.SendEmail(toEmail, emailSubject, emailBody).subscribe(data => {
        var retObj: any = data;
        if(retObj.success == true) {
          this.emailSuccess = true;
        }
        else {
          this.showFailure = false;
        }
    })
  }
  success(newmodal){
    newmodal.dismiss();
  }
  ChangeOrder() {
    this.ascendingOrd = !this.ascendingOrd;
  }


}
