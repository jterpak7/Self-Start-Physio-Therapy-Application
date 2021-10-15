//EXERCISE ROUTE HANDLING

var express = require('express');
var router = express.Router();
var Exercise = require('../models/exercises');
// var Session = require('../models/session');

// router.use(function(req, res, next){
//   // do logging
//   Session.findOne(req.params.token, function(err, session) {
//       if(err) {
//           res.send(err);
//           return;
//       }
//       if(session == null) {
//         res.status(401).send({error: "Unauthorized to access this content"});
//         return;
//       }
//       else{
//           //the user has a valid session token
//           next();
//       }
//   });
// });

router.route('/')

    .post(function (request, response) {
        var exercise = new Exercise();

        exercise.name = request.body.name;
        exercise.description = request.body.description;
        exercise.objectives = request.body.objectives;
        exercise.authorName = request.body.authorName;
        exercise.actionSteps = request.body.actionSteps;
        exercise.location = request.body.location;
        exercise.frequency = request.body.frequency;
        exercise.duration = request.body.duration;
        exercise.targetDate = request.body.targetDate;
        exercise.multimedia = request.body.multimedia;

        exercise.rehabilitationPlans = request.body.rehabilitationPlans; 
        
        exercise.save(function (error) {
            if (error) {
                response.send(error);
            }
            
            response.send({exercise: exercise});
        });
    })

    .get(function (request, response) {
            
            var query = {};
            if(request.query.q != null || request.query.q != undefined){
                var search = request.query.q;
                var regexexp = new RegExp(search, 'i');
                query[request.query.s] = regexexp;
            }
            else{
                query = {};
            }
            
            var parameter = request.query.s;
            var sortOrder = 1;
            var sort =  {};
            sort[parameter] = sortOrder;
            var options = {
                sort: sort,
                limit: request.query.pageSize,
                offset: Number(request.query.offset)
            };
            
            Exercise.paginate(query, options, function(err, results){
                if(err){
                    console.log(err);
                    response.send(err);
                    return;
                 }
                
                response.send(results);
            });
    });

//fetching a specific exercise

router.route('/:exercise_id')

    .get(function (request, response) {
        Exercise.findById(request.params.exercise_id, function (error, exercise) {
            if (error) {
               response.send({error: error});
            }
            else {
               response.json({exercise: exercise});
            }
        });
    })

    .put(function (request, response) {
        Exercise.findById(request.params.exercise_id, function (error, exercise) {
            if (error) {
                response.send({error: error});
            }
            else {
                
                //save updated information of exercise
                exercise.name = request.body.name;
                exercise.description = request.body.description;
                exercise.objectives = request.body.objectives;
                exercise.authorName = request.body.authorName;
                exercise.actionSteps = request.body.actionSteps;
                exercise.location = request.body.location;
                exercise.frequency = request.body.frequency;
                exercise.duration = request.body.duration;
                exercise.targetDate = request.body.targetDate;
                exercise.multimedia = request.body.multimedia;
                exercise.rehabilitationPlans = request.body.rehabilitationPlans;


                exercise.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({exercise: exercise});
                    }
                });
            }
        });
    })

    .delete(function (request, response) {
        Exercise.findByIdAndRemove(request.params.exercise_id,
            function (error, deleted) {
                if (error) {
                    response.send(error);
                    return;
                }
                
                response.json({exercise: deleted});
            }
        );
    });

router.route('/rehabPlan/:rehabPlans_id')

    .get(function (request, response) {
        console.log("work");
        Exercise.find({"rehabilitationPlans": request.params.rehabPlans_id}, function (error, exercise) {
            if (error) {
               response.send({error: error});
               return;
            }
            else {
               response.json({exercise: exercise});
            }
        });
    });
    
    

    
module.exports = router;