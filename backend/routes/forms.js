//routes for forms

var express = require('express');
var router = express.Router();
var Forms = require('../models/forms');
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
        var form = new Forms();
        form.name = request.body.name;
        form.description = request.body.description;
        form.questions = request.body.questions;
        
        form.save(function (error) {
            if (error){
                response.send(error);
                return;
            } 
            
            response.json({form: form});
        });
    })
    
    .get(function (request, response) {
        Forms.find(function (error, form) {
            if (error){
                 response.send(error);
                 return;
            }
            response.json({form: form});
        });
    });

//fetching a form with a desiginated ID
router.route('/:form_id')
    .get(function (request, response) {
        Forms.findById(request.params.form_id, function (error, form) {
            if (error) {
               response.send({error: error});
               return;
            }
            else {
               response.json({form: form});
            }
        });
    })

    .put(function (request, response) {
        Forms.findById(request.params.form_id, function (error, form) {
            if (error) {
                response.send({error: error});
                return;
            }
            else {

                //save updated info for the form
                form.name = request.body.name;
                form.description = request.body.description;
                form.questions = request.body.questions;

                form.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({form: form});
                    }
                });
            }
        });
    })

    //delete a form with a specific ID
    .delete(function (request, response) {
        Forms.findByIdAndRemove(request.params.form_id,
            function (error, deleted) {
                if (!error) {
                    response.json({form: deleted});
                }
            }
        );
    });

module.exports = router;
