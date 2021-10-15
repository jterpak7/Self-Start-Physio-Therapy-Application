//ASSESSMENT TEST ROUTE HANDLING
//========================================================

var express = require('express');
var router = express.Router();
var AssessmentTest = require('../models/assessmentTest');
var CompletedAssessment = require('../models/completedAssessmentTest');
var InitialIntake = require('../models/initialIntake');
let Account = require('../models/userAccount');
var Session = require('../models/session');


router.use(function(req, res, next){
  // do logging
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

router.route('/')

    .post(function (request, response) {
        var assessmentTest = new AssessmentTest();
        assessmentTest.name = request.body.name;
        assessmentTest.description = request.body.description;
        assessmentTest.completed = request.body.completed;
        assessmentTest.creator = request.body.creator;
        assessmentTest.belongsTo = request.body.belongsTo;
        assessmentTest.questions = request.body.questions;
        assessmentTest.dateCreated = new Date();
        // assessmentTest.authorName = request.body.authorName;
        // assessmentTest.recommendation = request.body.recommendation;
        // assessmentTest.testResults = request.body.testResults;
        // assessmentTest.rehabilitionPlans = request.body.rehabilationPlans;
        
        assessmentTest.save(function (error) {
            if (error) {
                response.send(error);
                return;
            }
            
            response.json({assessmentTest: assessmentTest});
        });
    })

    .get(function (request, response) {

        // AssessmentTest.find().populate('belongsTo').exec(function (error, assessmentTest) {
        //     if (error) {
        //         response.send(error);
        //     }
            
        //     response.json({assessmentTest: assessmentTest});
        //});
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
            populate: ['belongsTo'],
            limit: 10,
            offset: Number(request.query.offset)
        };
        
        AssessmentTest.paginate(query, options, function(err, results) {
            if(err) {
                console.log(err);
                response.send(err);
// =======
//         AssessmentTest.find().populate('belongsTo').exec(function (error, assessmentTest) {
//             if (error) {
//                 response.send({error: error});
// >>>>>>> 68ffc52ae9893ccf74363ccc9257eb369218d3f0
                return;
            }
            
            response.send(results);
        });
    });
router.route ('/getCompleted')
 .get(function (request, response) {

   
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
            populate: ['userID'],
            limit: 10,
            offset: Number(request.query.offset)
        };
        
        
        CompletedAssessment.paginate(query, options, function(err, results) {
            if(err) {
                console.log(err);
                response.send(err);
                return;
            }
            
            response.send(results);
        });
    });

    


//fetching a specific assessment test. This could then retrieve the test, modify the test or delete the test

router.route('/:assessment_id')

    .get(function (request, response) {
        AssessmentTest.findById(request.params.assessment_id, function (error, assessmentTest) {
            if (error) {
               response.send({error: error});
               return;
            }
            else {
               response.json({assessmentTest: assessmentTest});
            }
        });
    })

    .put(function (request, response) {
        AssessmentTest.findById(request.params.assessment_id, function (error, assessmentTest) {
            if (error) {
                response.send({error: error});
                return;
            }
            else {
                
                //save updated information of assessmentTest
                assessmentTest.name = request.body.name;
                assessmentTest.description = request.body.description;
                assessmentTest.authorName = request.body.authorName;
                assessmentTest.recommendation = request.body.recommendation;
                assessmentTest.testResults = request.body.testResults;
                assessmentTest.rehabilitionPlans = request.body.rehabilationPlans;
                
                assessmentTest.save(function (error) {
                    if (error) {
                        response.send({error: error});
                        return;
                    }
                    else {
                        response.json({assessmentTest: assessmentTest});
                    }
                });
            }
        });
    })

    .delete(function (request, response) {
        AssessmentTest.findByIdAndRemove(request.params.assessment_id,
            function (error, deleted) {
                if (!error) {
                    response.json({assessmentTest: deleted});
                }
            }
        );
    });
    
router.route('/client/completed')
    .put(function(request, response) {
        AssessmentTest.findById(request.body.assessmentID, function(error, assessmentTest) {
            if(error){
                response.send({error: error});
                return;
            }
            
            if(assessmentTest == null) {
                response.send({success: true, message: "could not retrieve the assessment test"});
                return;
            }
            
            assessmentTest.questions = request.body.questions;
            assessmentTest.completed = true;
            assessmentTest.dateCompleted = new Date();
            assessmentTest.save(function(err) {
                if(err) {
                    response.send({error: err});
                    return;
                }
                
                response.json({assessmentTest: assessmentTest, success: true});
            });
        });
    });
    
router.route('/putquestions/:id')

    .put(function(request, response){
        AssessmentTest.findById(request.params.id, function(error, assessmentTest){
            if(error){
                response.send({error: error});
                return;
            }
            
            assessmentTest.questions = request.body.questions;
            assessmentTest.save(function(err){
                if(error){
                    response.send({error: err})
                    return;
                }
                response.json({test: assessmentTest});
            })
        })
    });
    
router.route('/getresults/:id')
    
    .get(function (request, response){
       CompletedAssessment.find({"userID": request.params.id}).sort({dateCompleted: 1}).exec(function(error, tests){
           if(error){
               response.send({error: error});
               return;
           }
           console.log("HERE");
           response.json({completedTests: tests});
       })
    })
// router.route('/completedTests')

//     .post(function(request,response){
//         var completedAssessment = new CompletedAssessment();
//         completedAssessment.name = request.body.name;
//         completedAssessment.description = request.body.description;
//         completedAssessment.completed = true;
//         completedAssessment.dateCompleted = request.body.dateCompleted;
//         completedAssessment.dateCreated = request.body.dateCreated;
//         completedAssessment.questions = request.body.questions;
//         completedAssessment.physioRate = request.body.physioRate;
//         completedAssessment.physioDescription = request.body.physioDescription;
//         completedAssessment.patient =request.body.patient;
        
//         completedAssessment.save(function (error) {
//             if (error) {
//                 response.send(error);
//                 return;
//             }
            
//             response.json({completedAssessment: completedAssessment});
//         });
        
        
        
//     })
// =======
//           response.json({completedTests: tests});
//       })
//     });
    
router.route('/completedtest/:id')

    .post(function(request, response){
        let completedTest = new CompletedAssessment();
        completedTest.name = request.body.name;
        completedTest.description = request.body.descrip;
        completedTest.completed = false;
        let date = new Date();
        completedTest.dateCompleted = date;
        completedTest.physioRate = 0;
        completedTest.physioDescription = '';
        completedTest.questions = request.body.questions;
        completedTest.userID = request.params.id;
        completedTest.treatmentClosed = false
        
        InitialIntake.find({'userID': request.params.id}, function(err, injuries) {
            if(err) {
                response.send(err);
                return;
            }
            
            completedTest.injuryNumber = injuries.length;
            
            completedTest.save(function(err){
            if(err){
                response.send({error: err});
                return;
            }
            
            response.json({completedTest: completedTest});
        })
        })
    });
    
router.route('/completedtest/final/:id')
    .get(function(request, response) {
        console.log('variables sent to me', request.params.id, request.query.num);
        CompletedAssessment.findOne({'userID': request.params.id, 'injuryNumber': request.query.num, 'treatmentClosed': true}, function(err, results) {
            if(err) {
                response.send(err);
                return;
            }
            
            if(results == null) {
                response.send({success: false, message: 'this treatment is still ongoing'});
                return;
            }
            
            response.send({success: true, results: results});
        })
    })
    
router.route('/initial/completed')
    .post(function(request, response) {
        
        InitialIntake.find({'userID': request.body.userID}, function(err, injuries) {
            if(err) {
                response.send(err);
                return;
            }
            
            var initialIntake = new InitialIntake();
            initialIntake.injuryarea = request.body.injuryarea;
            initialIntake.painScale = request.body.painScale;
            initialIntake.started = request.body.started;
            initialIntake.dateStarted = new Date(request.body.dateStarted);
            initialIntake.describe = request.body.describe;
            initialIntake.ratePain = request.body.ratePain;
            initialIntake.weeklyPain = request.body.weeklyPain;
            initialIntake.aggravates = request.body.aggravates;
            initialIntake.easePain = request.body.easePain;
            initialIntake.morningPain = request.body.morningPain;
            initialIntake.eveningPain = request.body.eveningPain;
            initialIntake.treatment = request.body.treatment;
            initialIntake.moreThanOneSymptom = request.body.moreThanOneSymptom;
            initialIntake.hasOtherMedicalCondition = request.body.hasOtherMedicalCondition;
            initialIntake.describeOtherMedCondition = request.body.describeOtherMedCondition;
            initialIntake.symptoms = request.body.symptoms;
            initialIntake.medicalTraumas = request.body.medicalTraumas;
            initialIntake.explainTraumas = request.body.explainTraumas;
            initialIntake.occupation = request.body.occupation;
            initialIntake.hobbies = request.body.hobbies;
            initialIntake.goals = request.body.goals;
            initialIntake.userID = request.body.userID;
            initialIntake.injuryNumber = injuries.length + 1;
            
            initialIntake.save(function(err) {
                if(err) {
                    response.send(err);
                    return;
                }
                
                Account.findOne({"_id": initialIntake.userID}, function(err, account){
                    if(err){
                        response.send({message: "Can't Find Patient"});
                        return;
                    }
                    
                    if(account.numbInitial === 0){
                        response.send({appointmentsLeft: "none"});
                        return;
                    }
                    
                    --account.numbInitial;
                    account.save(function(err){
                        if(err){
                            response.send({error: err});
                            return;
                        }
                        
                        response.send({success: true, message: 'successfully filled out the initial intake form'});  
                    })
                })
            })
        })
    });
    
router.route('/initial/getbyid/:userID')
    .get(function(request, response) {
        InitialIntake.find({'userID': request.params.userID}).sort({dateStarted: -1}).exec(function(err, intakes) {
            if(err) {
                response.send(err);
                return;
            }
            
            response.send({intakes: intakes});
        });
    });

router.route('/assignFollowup/:id')

    .put(function(request,response){
        CompletedAssessment.findById(request.params.id,function(error,completedAssessment){
             if(error){
                response.send({error: error});
                return;
            }
            
            if(completedAssessment == null) {
                response.send({success: true, message: "could not retrieve the assessment test"});
                return;
            }
            
            completedAssessment.physioRate = request.body.physioRate;
            completedAssessment.physioDescription = request.body.physioDescription;
            completedAssessment.completed = true;
            completedAssessment.dateClosed = new Date();
            completedAssessment.finalThoughts = request.body.finalThoughts;
            completedAssessment.treatmentClosed = false;
            completedAssessment.save(function(err) {
                if(err) {
                    response.send({error: err});
                    return;
                }
                
                response.json({assessmentTest: completedAssessment, success: true});
            });
            
        })
    })

router.route('/closeTreatment/:id')

    .put(function(request, response){
        CompletedAssessment.findById(request.params.id, function(error, completedAssessment){
            if(error){
                response.send({error: error});
                return;
            }
            
            if(completedAssessment == null) {
                response.send({success: true, message: "could not retrieve the assessment test"});
                return;
            }
            
            completedAssessment.physioRate = request.body.physioRate;
            completedAssessment.physioDescription = request.body.physioDescription;
            completedAssessment.completed = true;
            completedAssessment.dateClosed = new Date();
            completedAssessment.finalThoughts = request.body.finalThoughts;
            completedAssessment.treatmentClosed = true;
            completedAssessment.save(function(err) {
                if(err) {
                    response.send({error: err});
                    return;
                }
                
                response.json({assessmentTest: completedAssessment, success: true});
            });
            
        })
    })

module.exports = router;