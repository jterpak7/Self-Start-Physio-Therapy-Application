import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute } from '@angular/router'
import { CookieService } from 'ngx-cookie-service';
import { PatientService} from '../patient.service'
import { PhysiotherapistService } from '../physiotherapist.service'
import {UserAccountsService } from '../user-accounts.service'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  patient: any;
  admin: any;
  physio: any;

  isClient: boolean;
  isPhysio: boolean;
  isAdmin: boolean;
  passwordNull: boolean;
  repeatPasswordNull: boolean;
  passwordsDontMatch: boolean;
  successfullyChangedPassword: boolean;
  couldntProcessRequest: boolean;
  incorrectOldPassword: boolean;
  showSuccess: boolean;
  showCreationSuccess: boolean;
  showDeleteSuccess: boolean;
  showFailure: boolean;
  emailSuccess: boolean;
  invalidSearchArea: boolean;
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
  countries: any[];
  provinces: any[];
  cities: any[];
  genders: any[];
  needToChangeInfo: boolean;
  infoUpdated: boolean;
  couldntProcessUpdateRequest: boolean;

  constructor(private route: ActivatedRoute,
              private cookieService: CookieService,
              private patientService: PatientService,
              private physiotherapistService: PhysiotherapistService,
              private userAccountsService: UserAccountsService) { }

  ngOnInit() {
    var url = this.route.routeConfig.path;
    
    if(url.includes('client')) {
      this.isClient = true;   
      this.isPhysio = false;  
      this.patient = {};   
      this.patientService.GetPatient().subscribe(data => {
        var retObj: any = data;
        this.patient = retObj.client.docs[0];
              
      })
    }
    else {
      this.isPhysio = true;
      this.isClient = false;
      this.physio = {};
      this.physiotherapistService.GetPhysioByUserID().subscribe(data => {
        var retObj: any = data;

        this.physio = retObj.physio;
      })
    }
    this.successfullyChangedPassword = false;
    this.couldntProcessRequest = false;
    this.patientService.GetCountries().subscribe(data => {
      var retObj: any = data;
      this.countries = Object.assign([], retObj.country);
    })

    this.patientService.GetGenders().subscribe(data => {
      var retObj: any = data;
      this.genders = Object.assign([], retObj.gender);
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

  closeWarning() {
    this.cannotContinue = false;
  }

  ResetPassword(password: string, repeatPassword: string, tempPassword: string) {
    var cannotContinue = false;
    if(!tempPassword) {
      var tempPasswordBox = document.getElementById('inputTempPassword').style.borderColor = 'red';
      cannotContinue = true;
    }

    if(!password) {
      var passwordBox = document.getElementById('inputPassword').style.borderColor = 'red';
      cannotContinue = true;
      this.passwordNull = true;
    }

    if(!repeatPassword) {
      var repeatPasswordBox = document.getElementById('inputRepeatPassword').style.borderColor = 'red';
      cannotContinue = true;
      this.repeatPasswordNull = true;
    }

    if(password != repeatPassword && !cannotContinue) {
      this.passwordsDontMatch = true;
      return;
    }

    if(cannotContinue) {
      return;
    }

    var userId = this.cookieService.get('ID');
    this.patientService.GetSalt(userId).subscribe(data => {
      var retObj: any = data;
      if(retObj.success == true){
        this.patientService.ChangePassword(userId, password, tempPassword, retObj.salt).subscribe(data => {
          var retObj: any = data;
          if(retObj.success) {
            this.successfullyChangedPassword = true;            
          }
          else {
            if(retObj.incTempPass) {
              this.incorrectOldPassword = true;
              document.getElementById('inputOldPassword').style.borderColor = "red";
            } 
            else {
              this.couldntProcessRequest = true;              
            }
          }
        })
      }
      
    })

  }

  ResetErrorMessages() {
    //Reset all the error messages. Then new ones will be shown if some still exist
    var firstnameBox = document.getElementById('inputFirstName').style.borderColor = 'rgba(0,0,0,.15)';  
    var lastnameBox = document.getElementById('inputLastName').style.borderColor = 'rgba(0,0,0,.15)';  
    var DOBBox = document.getElementById('inputDOB').style.borderColor = 'rgba(0,0,0,.15)';
    var postalCodeBox = document.getElementById('inputPostalCode').style.borderColor = 'rgba(0,0,0,.15)'; 
    var emailBox = document.getElementById('inputEmail').style.borderColor = 'rgba(0,0,0,.15)';
    var phoneBox = document.getElementById('inputPhoneNumber').style.borderColor = 'rgba(0,0,0,.15)';
    var newAddressBox = document.getElementById('inputAddress').style.borderColor = 'rgba(0,0,0,.15)';    
    this.invalidFirstname= false;
    this.invalidLastname= false;
    this.invalidGender= false;
    this.invalidDOB= false;
    this.invalidPhoneNumber = false;
    this.invalidPostalCode = false;
    this.invalidEmail = false;
  }


  updatePatient(ID: string, firstName: string, lastName: string, patientID: string, email: string, DOB: string, postalCode: string, phoneNumber: string, others: string, newCountry: string, newProvince: string, newCity: string, newGender: string, newAddress: string) {
    var badFormat = /[ !\s\t@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/; //regex statement to limit bad characters in a username
    var badFormatWithNumbers =  /[ !\s\t@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\d]/ //regex format to confirm input of first name and last name
    var badFormatWithLetters = /[ !\s\t@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
    var emailFormat =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    var validPhoneNumber = /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/
    this.cannotContinue = false;
    if(badFormatWithNumbers.test(firstName) || !firstName) {
      var firstnameBox = document.getElementById('inputFirstName').style.borderColor = 'red';    
      this.invalidFirstname = true;
      this.cannotContinue = true;
    }

    if(badFormatWithNumbers.test(lastName) || !lastName) {
      var firstnameBox = document.getElementById('inputLastName').style.borderColor = 'red';    
      this.invalidLastname = true;
      this.cannotContinue = true;
    }

    if(!DOB) {
      var DOBBox = document.getElementById('inputDOB').style.borderColor = 'red';
      this.invalidDOB = false;
      this.cannotContinue = true;
    }

    if(!newAddress) {
      var newAddressBox = document.getElementById('inputAddress').style.borderColor = 'red';
      this.invalidAddress = true;
      this.cannotContinue = true;
    }

    if(!postalCode) {
      var postalCodeBox = document.getElementById('inputPostalCode').style.borderColor = 'red';
      this.invalidPostalCode = true;
      this.cannotContinue = true;
    }
    
    if(!validPhoneNumber.test(phoneNumber)){
      var phoneBox = document.getElementById('inputPhoneNumber').style.borderColor = 'red';
      this.invalidPhoneNumber = true;
      this.cannotContinue = true;
    }
    if(!emailFormat.test(email)) {
      var emailBox = document.getElementById('inputEmail').style.borderColor = 'red';
      this.invalidEmail = true;
      this.cannotContinue = true;
    }

    if(this.cannotContinue) {
      //user cannot continue until changes have been fixed
      return;
    }

    this.showSuccess = false;
    this.showFailure = false;
    this.patientService.UpdatePatient(ID, firstName, lastName, patientID, email, DOB, postalCode, phoneNumber, others, newCountry, newProvince, newCity, newGender, newAddress).subscribe(data => {

      if(data.success) {
        //the update was successful
        this.showSuccess = true;
        //var closebtn: any= document.getElementById('closeBtn');
        this.ResetErrorMessages();
        //closebtn.click();
      }
      else{
        //it was not successful
        this.showFailure = true;
      }
    })

  }

  resetPhysioErrorMessages() {
    var firstNameBox = document.getElementById('inputPhysioFirstName').style.borderColor = 'rgba(0,0,0,.15)';    
    var lastNameBox = document.getElementById('inputPhysioLastName').style.borderColor = 'rgba(0,0,0,.15)'; 
    var emailBox = document.getElementById('inputPhysioEmail').style.borderColor = 'rgba(0,0,0,.15)'; 
  }

  UpdatePhysio(firstname, lastname, email) {
    var cannotContinue = false;
    this.infoUpdated = false;
    this.couldntProcessUpdateRequest = false;
    this.resetPhysioErrorMessages();
    if(!firstname) {
      var firstNameBox = document.getElementById('inputPhysioFirstName').style.borderColor = 'red';       
      cannotContinue = true;
    }

    if(!lastname) {
      var lastNameBox = document.getElementById('inputPhysioLastName').style.borderColor = 'red';       
      cannotContinue = true;
    }

    if(!email) {
      var emailBox = document.getElementById('inputPhysioEmail').style.borderColor = 'rgba(0,0,0,.15)';       
      cannotContinue = true;
    }

    if(cannotContinue) {
      this.needToChangeInfo = true;
      return;
    }

    this.physiotherapistService.PhysioUpdateOwnInformation(firstname, lastname, email).subscribe(data => {
      var retObj: any = data;
      if(retObj.success == true) {
        this.infoUpdated = true;
      }
      else {
        this.couldntProcessUpdateRequest = true;
      }

    })

  }

}
