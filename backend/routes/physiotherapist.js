//PHYSIOTHERAPIST ROUTE HANDLING
//========================================================

var express = require('express');
var router = express.Router();
var Physiotherapist = require('../models/physiotherapist');
var UserAccount = require('../models/userAccount');
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
        var physiotherapist = new Physiotherapist();
        physiotherapist.ID = request.body.ID;
        physiotherapist.familyName = request.body.familyName;
        physiotherapist.givenName = request.body.givenName;
        physiotherapist.email = request.body.email;
        var myDate = new Date(request.body.dateHired);
        physiotherapist.dateHired = myDate;
        var myDate1 = new Date(request.body.dateFinished);
        physiotherapist.dateFinished = myDate1;
        physiotherapist.account = request.body.account;
        physiotherapist.treatments = request.body.treatments;
         
        
        var userAccount = new UserAccount();
                userAccount.userAccountName = request.body.username;
                userAccount.encryptedPassword = request.body.encryptedPassword;
                userAccount.salt = request.body.salt;
                userAccount.needToChangePass = false;
                userAccount.isDisabled = false;
                userAccount.resetRequestSent = false;
                userAccount.userCode = "PH"; //this is a user account
                userAccount.dateRegistered = new Date();
                userAccount.lastLoggedIn = new Date();
                console.log(userAccount.encryptedPassword);
                UserAccount.find({'userAccountName': userAccount.userAccountName}, function(err, retphysio) {
                    if(err) {
                        response.send(err);
                        return;
                    }
                    
                    console.log(retphysio.length);
                    
                    if(retphysio.length != 0) {
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
                        physiotherapist.account = userAccount._id;
                        
                        physiotherapist.save(function (error) {
                        if (error) {
                            response.send(error);
                            console.log(error);
                            return;
                        }
                        
                        response.json({success: true, physio: physiotherapist});
                    });
                    });
                });
    })

    .get(function (request, response) {
        // Physiotherapist.find(function (error, physiotherapist) {
        //     if (error) {
        //         response.send(error);
        //     }
            
        //     response.json({physiotherapist: physiotherapist});
        // });
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
            populate: [{path: 'account', select: 'userAccountName'}],
            limit: 10,
            offset: Number(request.query.offset)
        };
        
        Physiotherapist.paginate(query, options, function(err, results) {
            if(err) {
                console.log(err);
                response.send(err);
                return;
            }
            
            response.send(results);
        });
    });

//fetching a specific physiotherapist. The options are to retrieve the physiotherapist, update the physiotherapist or delete the physiotherapist

router.route('/:physiotherapist_id')

    .get(function (request, response) {
        Physiotherapist.findById(request.params.physiotherapist_id, function (error, physiotherapist) {
            if (error) {
               response.send({error: error});
            }
            else {
               response.json({physiotherapist: physiotherapist});
            }
        });
    })

    .put(function (request, response) {
        Physiotherapist.findById(request.params.physiotherapist_id, function (error, physiotherapist) {
            if (error) {
                response.send({error: error});
            }
            else {
                console.log(request.body);
                
                //save updated information of the physiotherapist
                physiotherapist.familyName = request.body.familyName;
                physiotherapist.givenName = request.body.givenName;
                physiotherapist.email = request.body.email;

                physiotherapist.save(function (error) {
                    if (error) {
                        response.send({success: false, error: error});
                    }
                    else {
                        response.json({success: true, physiotherapist: physiotherapist});
                    }
                });
            }
        });
    })

    .delete(function (request, response) {
        Physiotherapist.findByIdAndRemove(request.params.physiotherapist_id,
            function (error, deleted) {
                if (!error) {
                    response.json({physiotherapist: deleted});
                }
            }
        );
        
    });


router.route('/admincreated')

     .post(function (request, response) {
        var physiotherapist = new Physiotherapist();
        physiotherapist.ID = request.body.ID;
        physiotherapist.familyName = request.body.familyName;
        physiotherapist.givenName = request.body.givenName;
        physiotherapist.email = request.body.email;
        var myDate = new Date(request.body.dateHired);
        physiotherapist.dateHired = myDate;
        var myDate1 = new Date(request.body.dateFinished);
        physiotherapist.dateFinished = myDate1;
        physiotherapist.account = request.body.account;
        physiotherapist.treatments = request.body.treatments;
        
        var userAccount = new UserAccount();
                userAccount.userAccountName = request.body.username;
                userAccount.encryptedPassword = request.body.encryptedPassword;
                userAccount.salt = request.body.salt;
                userAccount.needToChangePass = true;
                userAccount.isDisabled = false;
                userAccount.resetRequestSent = false;
                userAccount.userCode = "PH"; //this is a user account
                console.log(userAccount.encryptedPassword);
                UserAccount.find({'userAccountName': userAccount.userAccountName}, function(err, retphysio) {
                    if(err) {
                        response.send(err);
                        return;
                    }
                    
                    console.log(retphysio.length);
                    
                    if(retphysio.length != 0) {
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
                        physiotherapist.account = userAccount._id;
                        
                        physiotherapist.save(function (error) {
                        if (error) {
                            response.send(error);
                            console.log(error);
                            return;
                        }
                        
                        response.json({success: true, physio: physiotherapist});
                    });
                    });
                });
    });
    
router.route('/getphysio/:userid')
    .get(function(request, response) {
        Physiotherapist.findOne({'account': request.params.userid}, function(err, physio) {
            if(err) {
                response.send(err);
                return;
            }
            
            if(physio == null) {
                response.send({success: false, message: 'could not find the physio'});
                return;
            }
            
            response.send({success: true, physio: physio});
        });
    });
    
router.route('/update/:userid')
    .put(function(request, response) {
        Physiotherapist.findOne({'account': request.params.userid}, function(err, physio) {
            if(err) {
                response.send(err);
                return;
            }
            
            if(physio == null) {
                response.send({success: false, message: 'could not update physio'});
                return;
            }
            
            physio.givenName = request.body.firstname;
            physio.familyName = request.body.lastname;
            physio.email = request.body.email;
             
            physio.save(function(err) {
                if(err) {
                    response.send(err);
                    return;
                }
                
                response.send({success: true, message: 'you have succesfully updated your account', updatedPhysio: physio});
            });
        });
    });
    
module.exports = router;