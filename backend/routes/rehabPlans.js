//routes for rehabilitation plans

var express = require('express');
var router = express.Router();
var RehabPlans = require('../models/rehabilitationPlans');
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
        console.log("route");
        var rehabPlans = new RehabPlans();
        rehabPlans.name = request.body.name;
        rehabPlans.description = request.body.description;
        rehabPlans.authorName = request.body.authorName;
        rehabPlans.goal = request.body.goal;
        rehabPlans.timeFrameToComplete = request.body.timeFrameToComplete;
        rehabPlans.assessmentTests = request.body.assessmentTests;
        rehabPlans.exercises = request.body.exercises;
        rehabPlans.treatments = request.body.treatments;
        rehabPlans.exerciseObjects = request.body.exerciseObjects;
        
        rehabPlans.save(function (error) {
            if (error) response.send(error);
            response.json({rehabPlans: rehabPlans});
        });
    })
    .get(function (request, response) {
        var query = {};
        // if(request.query.s == "ID"){
            
        //     query['ID'] = Number(request.query.q);
        // }
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
        var sort ={};
        sort[myparameter] = sortOrder;
        var options = 
        {
            sort: sort,
            //populate: [{path: 'account', select: 'userAccountName'}, 'country', 'city', 'province', 'gender'],
            limit: 10,
            offset: Number(request.query.offset)
        };
        
        RehabPlans.paginate(query, options, function(err, results) {
            if(err) {
                console.log(err);
                response.send(err);
                return;
            }
            
            response.send(results);
        });
    });

        
        // RehabPlans.find(function (error, rehabPlans) {
        //     if (error) response.send(error);
        //     response.json({rehabPlans: rehabPlans});
        // });
   // });

//getting a specific rehab plan
router.route('/:rehabPlans_id')
    .get(function (request, response) {
        RehabPlans.findById(request.params.rehabPlans_id, function (error, rehabPlans) {
            if (error) {
               response.send({error: error});
               return;
            }
            else {
               response.json({rehabPlans: rehabPlans});
            }
        });
    })

    .put(function (request, response) {
        RehabPlans.findById(request.params.rehabPlans_id, function (error, rehabPlans) {
            if (error) {
                response.send({error: error});
            }
            else {
                
                //save updated info of the rehab plan
                rehabPlans.name = request.body.name;
                rehabPlans.description = request.body.description;
                rehabPlans.authorName = request.body.authorName;
                rehabPlans.goal = request.body.goal;
                rehabPlans.timeFrameToComplete = request.body.timeFrameToComplete;
                rehabPlans.assessmentTests = request.body.assessmentTests;
                rehabPlans.exercises = request.body.exercises;
                rehabPlans.treatments = request.body.treatments;
                rehabPlans.exerciseObjects = (request.body.exerciseObjects) ;

                rehabPlans.save(function (error) {
                    if (error) {
                        response.send({error: error});
                        return;
                    }
                    else {
                        response.json({rehabPlans: rehabPlans});
                    }
                });
            }
        });
    })

    //deleting a specific rehab plan
    .delete(function (request, response) {
        RehabPlans.findByIdAndRemove(request.params.rehabPlans_id,
            function (error, deleted) {
                if (!error) {
                    response.json({rehabPlans: deleted});
                }
            }
        );
    });

router.route('/:rehabPlans_id/addEx')
    
        .put(function (request, response) {
        RehabPlans.findById(request.params.rehabPlans_id, function (error, rehabPlans) {
            if (error) {
                response.send({error: error});
            }
            else {
                rehabPlans.exerciseObjects.push(request.body.exerciseObjects) ;

                rehabPlans.save(function (error) {
                    if (error) {
                        response.send({error: error});
                        return;
                    }
                    else {
                        response.json({rehabPlans: rehabPlans});
                    }
                });
            }
        });
    });
    
router.route('/findplan/search')
    .get(function(request, response) {
        
        RehabPlans.find({"name": request.query.q})
        .sort({name: 1})
        .exec(function(error, plans) {
            if (error) {
                response.send({error: error});
                return;
            }
            
            response.json({rehabPlans: plans});
            
        });
    });
    
router.route('/assignTest/:id')

    .put(function(request, response){
        RehabPlans.findById(request.params.id, function(error, rehabPlan){
            if(error){
                console.log("i am error derrrrr");
                response.send({error: error});
                return;
            }
            
            rehabPlan.assessmentTests = request.body.assessmentTests;
            rehabPlan.save(function(err){
                if(err){
                    response.send({error: err});
                    return;
                }
                
                console.log(rehabPlan.assessmentTests);
                response.json({rehabPlan: rehabPlan});
            })
        })
    })
    
router.route('/gettest/:id')

    .get(function(request, response){
        RehabPlans.findOne({"_id": request.params.id}).populate('assessmentTests').exec(function(err, plan){
            if(err) { 
                response.send({error: err}); 
                return;
            }
            
            response.json({rehabPlan: plan});
        })
    })
    

    
module.exports = router;
