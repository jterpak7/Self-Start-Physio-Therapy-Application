//CITY ROUTE HANDLING
//========================================================

var express = require('express');
var router = express.Router();
var City = require('../models/city');
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
        var city = new City();
        city.name = request.body.name;
        city.province = request.body.province;
        city.patient = request.body.patient;
        
        city.save(function (error) {
            if (error) {
                response.send(error);
            }
            
            response.json({city: city});
        });
    })

    .get(function (request, response) {
        City.find(function (error, city) {
            if (error) {
                response.send(error);
            }
            
            response.json({city: city});
        });
    });

//fetching city by id, can then retrieve this city, modify the city or delete the city
router.route('/:city_id')

    .get(function (request, response) {
        City.findById(request.params.city_id, function (error, city) {
            if (error) {
               response.send({error: error});
            }
            else {
               response.json({city: city});
            }
        });
    })

    .put(function (request, response) {
        City.findById(request.params.city_id, function (error, city) {
            if (error) {
                response.send({error: error});
            }
            else {
                
                //save updated information of city
                city.name = request.body.name;
                city.province = request.body.province;
                city.patient = request.body.patient;
                
                city.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({city: city});
                    }
                });
            }
        });
    })

    .delete(function (request, response) {
        City.findByIdAndRemove(request.params.city_id,
            function (error, deleted) {
                if (!error) {
                    response.json({city: deleted});
                }
            }
        );
    });

module.exports = router;