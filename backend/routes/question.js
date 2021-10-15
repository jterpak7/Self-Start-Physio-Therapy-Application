//QUESTION ROUTE HANDLING
//========================================================

var express = require('express');
var router = express.Router();
var Question = require('../models/question');
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
        var question = new Question();
        question.questionText = request.body.questionText;
        question.helpDescription = request.body.helpDescription;
        question.order = request.body.order;
        question.form = request.body.form;
        question.questionType = request.body.questionType;
        console.log('hello');
        question.save(function (error) {
            if (error) {
                response.send(error);
                return;
            }
            
            response.json({question: question});
        });
    })

    .get(function (request, response) {
        Question.find({form: request.query.form}, function (error, question) {
            if (error) {
                response.send(error);
                return;
            }
            
            response.json({question: question});
        });
    });

//fetching a specific question. The options are to retrieve the question, update the question or delete the question

router.route('/:question_id')

    .get(function (request, response) {
        Question.findById(request.params.question_id, function (error, question) {
            if (error) {
               response.send({error: error});
               return;
            }
            else {
               response.json({question: question});
            }
        });
    })

    .put(function (request, response) {
        Question.findById(request.params.question_id, function (error, question) {
            if (error) {
                response.send({error: error});
            }
            else {
                
                //save updated information of question
                question.questionText = request.body.questionText;
                question.helpDescription = request.body.helpDescription;
                question.order = request.body.order;
                question.form = request.body.form;
                question.questionType = request.body.questionType;

                question.save(function (error) {
                    if (error) {
                        response.send({error: error});
                        return;
                    }
                    else {
                        response.json({question: question});
                    }
                });
            }
        });
    })

    .delete(function (request, response) {
        Question.findByIdAndRemove(request.params.question_id,
            function (error, deleted) {
                if (!error) {
                        response.json({question: deleted});
                }
            }
        );
    });
    
router.route('/form/:form_id')

    .get(function (request, response) {
        Question.find({form: request.params.form_id}, function (error, question) {
            if (error) {
               response.send({error: error});
               return;
            }
            else {
               response.json({question: question});
            }
        });
    });

module.exports = router;