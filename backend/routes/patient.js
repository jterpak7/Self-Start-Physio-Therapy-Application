
//patient route handling

var express = require('express');
var router = express.Router();
var Patient = require('../models/patient');
var UserAccount = require('../models/userAccount');
var ResetEmail = require('../models/resetEmail');
    


//generic route for fetching all patients

router.route('/')

    .post(function (request, response) {
        var patient = new Patient();
        patient.ID = request.body.ID;
        patient.familyName = request.body.familyName;
        patient.givenName = request.body.givenName;
        patient.email = request.body.email;
        patient.physioId = request.body.physioId;
        var myDate = new Date(request.body.DOB);
        patient.DOB = myDate;
        patient.postalCode = request.body.postalCode;
        patient.phone = request.body.phone;
        patient.maritalStatus = request.body.maritalStatus;
        patient.healthCardNumber = request.body.healthCardNumber;
        patient.occupation = request.body.occupation;
        patient.others = request.body.others;
        patient.account = request.body.account;
        patient.payment = request.body.payment;
        patient.country = request.body.country;
        patient.province = request.body.province;
        patient.city = request.body.city;
        patient.gender = request.body.gender;
        patient.appointment = request.body.appointment;
        patient.address = request.body.address;
        patient.verified = false;
        
        var userAccount = new UserAccount();
        userAccount.userAccountName = request.body.username;
        userAccount.encryptedPassword = request.body.encryptedPassword;
        userAccount.salt = request.body.salt;
        userAccount.needToChangePass = false;
        userAccount.isDisabled = false;
        userAccount.resetRequestSent = false;
        userAccount.dateRegistered = new Date();
        userAccount.lastLoggedIn = new Date();
        userAccount.numbInitial = 0;
        userAccount.numbAppoint = 0;
        userAccount.verified = false;
        userAccount.userCode = "US"; //this is a user account
        console.log(userAccount.encryptedPassword);
        UserAccount.find({'userAccountName': userAccount.userAccountName}, function(err, retpatient) {
            if(err) {
                response.send(err);
                return;
            }
            
            console.log(retpatient.length);
            
            if(retpatient.length != 0) {
                //someone with this username already exists
                response.send({success: false, message: "Please choose a different username"});
                return;
            }
        
            userAccount.save(function(err, userAccount) {
                if(err){
                    response.send(err);
                    return;
                }
                //create the user account of the patient and then sets the patient's account to it's ID, then save the patient
                patient.account = userAccount._id;
                
                patient.save(function (error) {
                if (error) {
                    response.send(error);
                    console.log(error);
                    return;
                }
                
                response.json({success: true, patient: patient});
            });
            });
        })
        
    })

    .get(function (request, response) {
        Session.findOne({nonce: request.header('Authorization')}, function(err, session) {
              if(err) {
                  response.send(err);
                  return;
              }
              if(session == null) {
                response.status(401).send({error: "Unauthorized to access this content"});
                return;
              }
              else{
                  var query = {};
                if(request.query.s == "ID"){
                    
                    query['ID'] = Number(request.query.q);
                }
                else if(request.query.q != null || request.query.q != undefined) {
                    //if the query string isn't null, set the query to search for the query string
                    var search = '^' + request.query.q;
                    var regexexp = new RegExp(search, 'i');
                    query[request.query.s] = regexexp;
                }
                else{
                    query = {};
                }
                
                var sortOrder;
                if(request.query.sortorder == 'asc') {
                    sortOrder = 1;
                }
                else {
                    sortOrder = -1;
                }
                
                var myparameter = request.query.s;
                var sort ={};
                sort[myparameter] = sortOrder;
                var options = 
                {
                    sort: sort,
                    populate: [{path: 'account', select: 'userAccountName'}, 'country', 'city', 'province', 'gender'],
                    limit: 10,
                    offset: Number(request.query.offset)
                };
                
                Patient.paginate(query, options, function(err, results) {
                    if(err) {
                        console.log(err);
                        response.send(err);
                        return;
                    }
                    
                    response.send(results);
                });
      }
    });
});
    
    

//fetching a specific patient

router.route('/:patient_id')

    .get(function (request, response) {
        Patient.findById(request.params.patient_id).populate({path: 'account', select: 'userAccountName'}).populate('country').populate('province').populate('city').populate('rehabPlan').exec(function (error, patient) {
            if (error) {
               response.send({error: error});
               return;
            }
            else {
               response.json({patient: patient});
            }
        });
    })

    .put(function (request, response) {
        Patient.findById(request.params.patient_id, function (error, patient) {
            if (error) {
                response.send({error: error});
            }
            else {

                //save updated information of patient
                patient.ID = request.body.ID;
                patient.familyName = request.body.familyName;
                patient.givenName = request.body.givenName;
                patient.email = request.body.email;
                var myDate = new Date(request.body.DOB);
                patient.DOB = myDate;
                patient.postalCode = request.body.postalCode;
                patient.phone = request.body.phone;
                patient.maritalStatus = request.body.maritalStatus;
                patient.healthCardNumber = request.body.healthCardNumber;
                patient.occupation = request.body.occupation;
                patient.others = request.body.others;
                patient.country = request.body.country;
                patient.province = request.body.province;
                patient.city = request.body.city;
                patient.gender = request.body.gender;
                patient.address = request.body.address;

                patient.save(function (error) {
                    if (error) {
                        response.send({error: error});
                        return;
                    }
                    else {
                        response.json({success: true, patient: patient});
                    }
                });
            }
        });
    })

    .delete(function (request, response) {
        Patient.findByIdAndRemove(request.params.patient_id,
            function (error, deleted) {
                if(error) {
                    console.log(error);
                    response.send(error);
                    return;
                }
                response.json({success: true, patient: deleted});
                
            }
        );
    });

var Session = require('../models/session');

router.use(function(req, res, next){
  console.log(req.header('Authorization'));
  Session.findOne({nonce: req.header('Authorization')}, function(err, session) {
      if(err) {
          res.send(err);
          return;
      }
      if(session == null) {
        res.status(401).send({error: "Unauthorized to access this content"});
        return;
      }
      else{
          //the user has a valid session token
          next();
      }
  });
});
    
//search for a specific patient
router.route('/findpatient/search')
    .get(function(request, response) {
        
        Patient.find({"familyName": request.query.q})
        .sort({familyName: 1, givenName: 1})
        .populate('province').populate('city').populate('country')
        .exec(function(error, patients) {
            if (error) {
                response.send(error);
                return;
            }
            
            response.json({patients: patients});
            
        });
    });
    
router.route('/physiotherapist/:physiotherapist_id')
    .get(function (request, response) {
        
         var options = 
        {
            //sort: sort,
            populate: [{path: 'account', select: 'userAccountName'}, 'country', 'city', 'province', 'gender'],
           // limit: 10,
           // offset: Number(request.query.offset)
        };
        var query = {"physioId": request.params.physiotherapist_id};
        
        Patient.paginate(query, options, function(err, results) {
            if(err) {
                console.log(err);
                response.send(err);
                return;
            }
            
            response.send(results);
        });
        // Patient.find({"physioId": request.params.physiotherapist_id}, function (error, patient) {
        //     if (error) {
        //       response.send({error: error});
        //     }
        //     else {
        //       response.json({patient: patient});
        //     }
        // });
    });
    
router.route('/assign/:patient_id')

    .put(function (request, response) {
        Patient.findById(request.params.patient_id, function (error, patient) {
            if (error) {
                response.send({error: error});
                console.log("Error")
            }
            else {
                //save updated information of patient
                patient.rehabPlan = request.body.rehabPlan;
                console.log(patient.rehabPlan);

                console.log(request.body);
                patient.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        console.log("Here");
                        response.json({success: true, patient: patient});
                    }
                });
            }
        });
    });
    
router.route('/plan/:plan_id')

    .get(function (request, response) {
        Patient.find({"rehabPlan": request.params.plan_id}, function (error, patients) {
            if (error) {
               response.send({error: error});
            }
            else {
               response.json({patients: patients});
            }
        })
    });
    
router.route('/notplan/:plan_id')

    .get(function (request, response) {
        // Patient.find({"rehabPlan": { "$ne": request.params.plan_id}}).populate('rehabPlan').exec(function (error, patients) {
        //     if (error) {
        //       response.send({error: error});
        //     }
        //     else {
        //       response.json({patients: patients});
        //     }
        // })
        var query = {};
        if(request.query.q != null || request.query.q != undefined) {
            //if the query string isn't null, set the query to search for the query string
            var search = '^' + request.query.q;
            var regexexp = new RegExp(search, 'i');
            query[request.query.s] = regexexp;
        }
        else{
            query = {};
        }
        
        var sortOrder;
        if(request.query.sortorder == 'asc') {
            sortOrder = 1;
        }
        else {
            sortOrder = -1;
        }
        
        var myparameter = request.query.s;
        var sort = {};
        sort[myparameter] = sortOrder;
        var options = 
        {
            sort: sort,
            //populate: [{path: 'account', select: 'userAccountName'}, 'country', 'city', 'province', 'gender'],
            limit: 10,
            offset: Number(request.query.offset)
        };
        
        Patient.paginate(query, options, function(err, results) {
            if(err) {
                console.log(err);
                response.send(err);
                return;
            }
            
            response.send(results);
        });
    });
    
router.route('/plan/remove')

    .put(function (request, response) {
        Patient.findById(request.body.patient, function (error, patient) {
            if (error) {
                response.send({error: error});
            }
            else {
                patient.rehabPlan = undefined;

                console.log(request.body);
                patient.save(function (error) {
                    if (error) {
                        console.log("Error");
                        response.send({error: error});
                    }
                    else {
                        console.log("Here");
                        response.json({success: true, patient: patient});
                    }
                });
            }
        });
    });
    
router.route('/unassignPlan/:id')

    .put(function(request,response){
        Patient.find({"rehabPlan": request.params.id}, function(error, patients){
           if (error){
                console.log("Error");
                response.send({error: error});
           } 
           else{
               patients.rehabPlan = undefined;
               patients.save(function (error) {
                    if (error) {
                        console.log("Error");
                        response.send({error: error});
                    }
                    else {
                        console.log("Here");
                        response.json({success: true, patient: patients});
                    }
                });
           }
        });
    });
    
router.route('/patientinfo/:id')

    .get(function(request, response){
        Patient.findOne({"account": request.params.id}).populate('rehabPlan').populate('account').populate('appointments').exec(function(err, patient){
            if(err){
                response.send({error: err});
                return;
            }
            
            response.send({patient: patient});
        });
    });
    
router.route('/patient/appointments/:id')

    .get(function(request, response){
        Patient.findOne({"_id": request.params.id}).populate('appointment', 'account').exec(function(err, patient){
            if(err){
                response.send({error: err})
            }
            response.send({patient: patient});   
        })
    });
    
router.route('/appointments/calInfo/:user_id')

    .get(function(request, response){
        Patient.findOne({"account": request.params.user_id}, function(err, patient){
            console.log("here: " + request.params.user_id)
            if(err){
                response.send({error: err});
            }else{
            console.log(patient);
            response.send({patient: patient});   
            }
        })
    });
    
    
    
router.route('/admincreated')

    .post(function (request, response) {
        var patient = new Patient();
        patient.ID = request.body.ID;
        patient.familyName = request.body.familyName;
        patient.givenName = request.body.givenName;
        patient.email = request.body.email;
        patient.physioId = request.body.physioId;
        var myDate = new Date(request.body.DOB);
        patient.DOB = myDate;
        patient.postalCode = request.body.postalCode;
        patient.phone = request.body.phone;
        patient.maritalStatus = request.body.maritalStatus;
        patient.healthCardNumber = request.body.healthCardNumber;
        patient.occupation = request.body.occupation;
        patient.others = request.body.others;
        patient.account = request.body.account;
        patient.payment = request.body.payment;
        patient.country = request.body.country;
        patient.province = request.body.province;
        patient.city = request.body.city;
        patient.gender = request.body.gender;
        patient.appointment = request.body.appointment;
        patient.address = request.body.address;
        patient.verified = false;
        
        var userAccount = new UserAccount();
        userAccount.userAccountName = request.body.username;
        userAccount.encryptedPassword = request.body.encryptedPassword;
        userAccount.salt = request.body.salt;
        userAccount.needToChangePass = true;
        userAccount.isDisabled = false;
        userAccount.resetRequestSent = false;
        userAccount.userCode = "US"; //this is a user account
        console.log(userAccount.encryptedPassword);
        UserAccount.find({'userAccountName': userAccount.userAccountName}, function(err, retpatient) {
            if(err) {
                response.send(err);
                return;
            }
            
            console.log(retpatient.length);
            
            if(retpatient.length != 0) {
                //someone with this username already exists
                response.send({success: false, message: "Please choose a different username"});
                return;
            }
        
            userAccount.save(function(err, userAccount) {
                if(err){
                    response.send(err);
                    return;
                }
                //create the user account of the patient and then sets the patient's account to it's ID, then save the patient
                patient.account = userAccount._id;
                
                patient.save(function (error) {
                    if (error) {
                        response.send(error);
                        console.log(error);
                        return;
                    }
                
                    response.json({success: true, patient: patient});
                });
            });
        });
        

});



router.route('/getclient/:userid')
    .get(function(request, response) {
        var options = 
        {
            populate: [{path: 'account', select: 'userAccountName'}, 'country', 'city', 'province', 'gender', 'rehabPlan'],
        };
        var query = {'account': request.params.userid};
        Patient.paginate(query, options, function(err, client) {
            if(err) {
                response.send(err);
                return;
            }
            
            if(client == null) {
                response.send({success: true, message: 'could not find client'});
                return;
            }
            console.log(client);
            response.send({success: true, client: client});
        });
    });
    
router.route('/getspecific/:id')

    .get(function(request, response){
        Patient.findOne({"_id": request.params.id}).populate('rehabPlan').exec(function(err, patient){
            if(err){
                response.send({error: err});
                return;
            }
            
            response.send({patient: patient});   
        })
    })

module.exports = router;