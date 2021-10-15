//PROVINCE ROUTE HANDLING
//========================================================

var express = require('express');
var router = express.Router();
var Province = require('../models/province');
var Country = require('../models/country');
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
        var province = new Province();
        province.name = request.body.name;
        console.log(request.body.country);
        province.country = request.body.country;
        province.city = request.body.city;
        province.patient = request.body.patient;
        
        province.save(function (error) {
            if (error) {
                console.log('error');
                response.send(error);
            }
            //console.log(province.country);
            response.json({province: province});
        });
        
        // Country.findById(request.body.country, function(err, country) {
        //     if(err) {
        //         console.log(err);
        //     }
        //     console.log(country);
        //     country.province.push(province);
        //     country.save(function(err){
        //         if(err) {
        //             console.log('err');
        //             console.log(err);
        //         }
                
        //         console.log('done');
        //         response.send(country);
        //     })
        // })
        
        
        
        
        // Province.Model.findById('5a7c84d0dec4fe4a6d6f40e1').populate('country').exec(function(err, province) {
        //     if(err) {
        //         response.send(err);
        //     }
        // })
        
    })

    .get(function (request, response) {
        Province.find(function (error, province) {
            if (error) {
                response.send(error);
            }
            
            response.json({province: province});
        });
    });

//fetching a specific province. The options are to retrieve the province, update the province or delete the province

router.route('/:province_id')

    .get(function (request, response) {
        Province.findById(request.params.province_id, function (error, province) {
            if (error) {
               response.send({error: error});
            }
            else {
               response.json({province: province});
            }
        });
    })

    .put(function (request, response) {
        Province.findById(request.params.province_id, function (error, province) {
            if (error) {
                response.send({error: error});
            }
            else {
                
                //save updated information of province
                province.name = request.body.name;
                province.country = request.body.country;
                province.city = request.body.city;
                province.patient = request.body.patient;

                province.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({province: province});
                    }
                });
            }
        });
    })

    .delete(function (request, response) {
        Province.findByIdAndRemove(request.params.province_id,
            function (error, deleted) {
                if (!error) {
                    response.json({province: deleted});
                }
            }
        );
    });
    
router.route('/getcities/:province_id')
    .get(function(request, response){
        City.find({province: request.params.province_id}, function(err, cities) {
           if(err){
               response.send(err);
               return;
           } 
           
           response.send({cities: cities});
        }).sort({name: 1});
    });

module.exports = router;