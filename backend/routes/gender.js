//GENDER ROUTE HANDLING
//========================================================

var express = require('express');
var router = express.Router();
var Gender = require('../models/gender');
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
        var gender = new Gender();
        gender.name = request.body.name;
        gender.patient = request.body.patient;
        
        gender.save(function (error) {
            if (error) {
                response.send(error);
            }
            
            response.json({gender: gender});
        });
    })

    .get(function (request, response) {
        Gender.find(function (error, gender) {
            if (error) {
                response.send(error);
            }
            
            response.json({gender: gender});
        });
    });

//fetching a specific gender. The options are to retrieve the gender, update the gender or delete the gender

router.route('/:gender_id')

    .get(function (request, response) {
        Gender.findById(request.params.gender_id, function (error, gender) {
            if (error) {
               response.send({error: error});
            }
            else {
               response.json({gender: gender});
            }
        });
    })

    .put(function (request, response) {
        Gender.findById(request.params.gender_id, function (error, gender) {
            if (error) {
                response.send({error: error});
            }
            else {
                
                //save updated information of gender
                gender.name = request.body.name;
                gender.patient = request.body.patient;

                gender.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({gender: gender});
                    }
                });
            }
        });
    })

    .delete(function (request, response) {
        Gender.findByIdAndRemove(request.params.gender_id,
            function (error, deleted) {
                if (!error) {
                    response.json({gender: deleted});
                }
            }
        );
    });

module.exports = router;