//ADMINISTRATOR ROUTE HANDLING
// NOTE: THIS IS TEMPORARY, IT WILL NEED TO BE CHANGED AS ADDITIONAL FUNCTIONALITY IS NEEDED
//========================================================

var express = require('express');
var router = express.Router();
var Administrator = require('../models/administrator');
var UserAccount = require('../models/userAccount');
const crypto = require('crypto');
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
        var administrator = new Administrator();
        administrator.ID = request.body.ID;
        administrator.familyName = request.body.familyName;
        administrator.givenName = request.body.givenName;
        administrator.email = request.body.email;
        administrator.dateHired = request.body.dateHired;
        administrator.dateFinished = request.body.dateFinished;
        
        var userAccount = new UserAccount();
        userAccount.userAccountName = request.body.username;
        var hashedPass = userAccount.hash(request.body.password);
        var salt = crypto.randomBytes(16).toString('base64');
        var saltAndHashedPass = hashedPass + salt;
        var HashedSaltAndPass = userAccount.hash(saltAndHashedPass);
        var encryptedPassword = userAccount.encrypt(HashedSaltAndPass);
        userAccount.encryptedPassword = encryptedPassword;
        userAccount.salt = salt;
        userAccount.needToChangePass = false;
        userAccount.isDisabled = false;
        userAccount.resetRequestSent = false;
        userAccount.dateRegistered = new Date();
        userAccount.lastLoggedIn = new Date();
        userAccount.userCode = "AD"; //this is a user account
        console.log(userAccount.encryptedPassword);
        UserAccount.find({'userAccountName': userAccount.userAccountName}, function(err, retadmin) {
            if(err) {
                response.send(err);
                return;
            }
            
            console.log(retadmin.length);
            
            if(retadmin.length != 0) {
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
                administrator.account = userAccount._id;
                
                administrator.save(function (error) {
                if (error) {
                    response.send(error);
                    console.log(error);
                    return;
                }
                
                response.json({success: true, admin: administrator});
            });
            });
        });
    })

    .get(function (request, response) {
        Administrator.find().populate('account').exec(function (error, administrator) {
            if (error) {
                response.send(error);
            }
            
            response.json({administrator: administrator});
        });
    });

//routes to fetch a specific administrator. This can then be retreived, updated or deleted

router.route('/:administrator_id')

    .get(function (request, response) {
        Administrator.findById(request.params.administrator_id, function (error, administrator) {
            if (error) {
               response.send({error: error});
            }
            else {
               response.json({administrator: administrator});
            }
        });
    })

    .put(function (request, response) {
        Administrator.findById(request.params.administrator_id, function (error, administrator) {
            if (error) {
                response.send({error: error});
            }
            else {
                
                //save updated information of administrator
                administrator.ID = request.body.ID;
                administrator.familyName = request.body.familyName;
                administrator.givenName = request.body.givenName;
                administrator.email = request.body.email;
                administrator.dateHired = request.body.dateHired;
                administrator.dateFinished = request.body.dateFinished;
                administrator.account = request.body.account;
                administrator.forms = request.body.forms;
                
               

                administrator.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({administrator: administrator});
                    }
                });
            }
        });
    })

    .delete(function (request, response) {
        Administrator.findByIdAndRemove(request.params.administrator_id,
            function (error, deleted) {
                if (!error) {
                    response.json({administrator: deleted});
                }
            }
        );
    });
    
router.route('/getadmin/:userid')
    .get(function(request, response) {
        Administrator.findOne({'account': request.params.userid}, function(err, admin) {
            if(err) {
                response.send(err);
                return;
            }
            
            if(admin == null) {
                response.send({success: false, admin: admin});
                return;
            }
            
            response.send({success: true, admin: admin});
        });
    });

module.exports = router;