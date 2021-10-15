//RECOMMENDATION ROUTE HANDLING
//========================================================

var express = require('express');
var router = express.Router();
var Recommendation = require('../models/recommendation');
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
        var recommendation = new Recommendation();
        recommendation.timeStamp = request.body.timeStamp;
        recommendation.decision = request.body.decision;
        recommendation.test = request.body.test;
        recommendation.response = request.body.response;
        
        recommendation.save(function (error) {
            if (error) {
                response.send(error);
            }
            
            response.json({recommendation: recommendation});
        });
    })

    .get(function (request, response) {
        Recommendation.find(function (error, recommendation) {
            if (error) {
                response.send(error);
            }
            
            response.json({recommendation: recommendation});
        });
    });

//fetching a specific recommendation. The options are to retrieve the recommendation, update the recommendation or delete the recommendation

router.route('/:recommendation_id')

    .get(function (request, response) {
        Recommendation.findById(request.params.recommendation_id, function (error, recommendation) {
            if (error) {
               response.send({error: error});
            }
            else {
               response.json({recommendation: recommendation});
            }
        });
    })

    .put(function (request, response) {
        Recommendation.findById(request.params.recommendation_id, function (error, recommendation) {
            if (error) {
                response.send({error: error});
            }
            else {
                
                //save updated information of recommendation
                recommendation.timeStamp = request.body.timeStamp;
                recommendation.decision = request.body.decision;
                recommendation.test = request.body.test;
                recommendation.response = request.body.response;

                recommendation.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({recommendation: recommendation});
                    }
                });
            }
        });
    })

    .delete(function (request, response) {
        Recommendation.findByIdAndRemove(request.params.recommendation_id,
            function (error, deleted) {
                if (!error) {
                    response.json({recommendation: deleted});
                }
            }
        );
    });

module.exports = router;