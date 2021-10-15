var express = require('express');
var router = express.Router();
var nodemailer = require("nodemailer");
var ResetEmail = require('../models/resetEmail');
var UserAccount = require('../models/userAccount');
var Patient = require('../models/patient');
var Administrator = require('../models/administrator');
var Physiotherapist = require('../models/physiotherapist');
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

var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "loopsolutionsuwo@gmail.com",
        pass: "Selfstart"
    } 
});

function makeHash() {
  var text = "";
  var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 10; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}


router.route('/')
    .post(function(request, response) {
        console.log('hello');
        var mailOptions = {
            to: request.body.email,
            subject: request.body.subject,
            html: request.body.emailContent
        };
        
        smtpTransport.sendMail(mailOptions, function(error, resp) {
            if(error) {
                console.log(error);
                response.send(error);
                return;
            }
            console.log(resp);
            response.send({success: true, message: "Sent Mail!"});
        });
    });
    
router.route('/appointment')
    .post(function(request, response){
        var options = {  
            weekday: "long", year: "numeric", month: "short",  
            day: "numeric", hour: "2-digit", minute: "2-digit"  
        }; 
        var mydate = new Date(request.body.date).toLocaleTimeString("en-us", options)
        var body = `<body style="background: whitesmoke; text-align: center">
                    <h1 style="color: #0275d8; font-family: Helvetica, Arial;">Self Start</h1>
                    <h4>Hello ${request.body.name},</h4>
                    <h4>Your appointment on
                    ${mydate}
                    has been cancelled by your Self Start specialist.
                    Please contact them for more details or try re-booking your appointment for another time.</h4>
                    <h4>We apologize for the inconvience.</h4>
                    <br>
                    <h4>Have a nice day!</h4>
                    <img src="http://marcottephysio.com/wp-content/uploads/2017/03/growing-in-cement_940x434.jpg" style="margin: 1rem;">
                    </body>
                    `;
        var mailOptions = {
            to: request.body.toEmail,
            subject: 'Self Start - Cancelled Appointment',
            html: body
        };
        
        smtpTransport.sendMail(mailOptions, function(error, resp) {
            if(error) {
                console.log(error);
                response.send(error);
                return;
            }
            response.send({success: true, message: "Sent Mail!"});
        });
    });
    
router.route('/forgotten')
    .post(function(request, response) {
       UserAccount.findOne({userAccountName: request.body.username}, function(err, useraccount) {
           if(err){
               response.send(err);
               return;
           }
           
           console.log(useraccount);
           if(useraccount == {} || useraccount == null) {
               console.log('bad guy');
               response.send({success: false, message: "username doesn't exist"});
               return;
           }
           
           if(useraccount.changePass == true) {
               response.send({success: false, message: "password request already issued"});
               return;
           }
           if(useraccount.userCode == "US") {
           
               Patient.findOne({account: useraccount._id}, function(err, myPatient) {
                   if(err) {
                       response.send('bad');
                       return;
                   }
                   
                   console.log(myPatient);
                   if(myPatient == {} || myPatient == null) {
                       console.log('something bad happened');
                       return;
                   }
                                  
                  var resetEmail = new ResetEmail();
                  resetEmail.username = request.body.username;
                  var randomHash = makeHash();
                  resetEmail.myHash = randomHash;
                  resetEmail.myDate = new Date();
                  resetEmail.save(function(err) {
                      if(err) {
                          console.log("couldn't save");
                      }
                  });
                  //need to generate a random password for the user, and set it to their account.
                  var newPassword = makeHash();
                  var hashedpass = useraccount.hash(newPassword);
                  var PassAndSalt = hashedpass + useraccount.salt;
                  var hashedSaltPlusPass = useraccount.hash(PassAndSalt);
                  var inputPassEncrypted = useraccount.encrypt(hashedSaltPlusPass);
                  useraccount.encryptedPassword = inputPassEncrypted;
                  useraccount.resetRequestSent = true;
                  useraccount.save(function(err) {
                      if(err) {
                          response.send(err);
                          return;
                      }
                  });
    
                  var emailBody = `
                  <h4>Hello, please follow the folowing instructions to recover your account </h4>
                  <p>We have assigned your account a temporary password to be used to log in to your account.</p> 
                  <p>Your temporary password is ${newPassword}. </p>
                  <p>Upon logging in, you will be prompted to enter a new password. Once you have entered your new password, your account will be updated accordingly</p>
                  <h5>Thank you for using Self Start </h5>
                  `;
                  var mailOptions = {
                      to: myPatient.email,
                      subject: "Self Start - Recover Account",
                      html: emailBody
                  }; 
                   
                  smtpTransport.sendMail(mailOptions, function(error, resp) {
                    if(error) {
                        console.log(error);
                        return;
                    }
                    console.log(resp);
                    response.send({success: true, message: "Sent Mail!"});
                  });
               });
            }
            
            if(useraccount.userCode == "PH") {
           
               Physiotherapist.findOne({account: useraccount._id}, function(err, myPatient) {
                   if(err) {
                       response.send('bad');
                       return;
                   }
                   
                   console.log(myPatient);
                   if(myPatient == {} || myPatient == null) {
                       console.log('something bad happened');
                       return;
                   }
                                  
                  var resetEmail = new ResetEmail();
                  resetEmail.username = request.body.username;
                  var randomHash = makeHash();
                  resetEmail.myHash = randomHash;
                  resetEmail.myDate = new Date();
                  resetEmail.save(function(err) {
                      if(err) {
                          console.log("couldn't save");
                      }
                  });
                  //need to generate a random password for the user, and set it to their account.
                  var newPassword = makeHash();
                  var hashedpass = useraccount.hash(newPassword);
                  var PassAndSalt = hashedpass + useraccount.salt;
                  var hashedSaltPlusPass = useraccount.hash(PassAndSalt);
                  var inputPassEncrypted = useraccount.encrypt(hashedSaltPlusPass);
                  useraccount.encryptedPassword = inputPassEncrypted;
                  useraccount.resetRequestSent = true;
                  useraccount.save(function(err) {
                      if(err) {
                          response.send(err);
                          return;
                      }
                  });
    
                  var emailBody = `
                  <h4>Hello, please follow the folowing instructions to recover your account </h4>
                  <p>We have assigned your account a temporary password to be used to log in to your account.</p> 
                  <p>Your temporary password is ${newPassword}. </p>
                  <p>Upon logging in, you will be prompted to enter a new password. Once you have entered your new password, your account will be updated accordingly</p>
                  <h5>Thank you for using Self Start </h5>
                  `;
                  var mailOptions = {
                      to: myPatient.email,
                      subject: "Self Start - Recover Account",
                      html: emailBody
                  }; 
                   
                  smtpTransport.sendMail(mailOptions, function(error, resp) {
                    if(error) {
                        console.log(error);
                        return;
                    }
                    console.log(resp);
                    response.send({success: true, message: "Sent Mail!"});
                  });
               });
            }
            
            else if(useraccount.userCode == "AD") {
                    Administrator.findOne({account: useraccount._id}, function(err, myPatient) {
                        console.log('admin')
                       if(err) {
                           response.send('bad');
                           return;
                       }
                       
                       console.log(myPatient);
                       if(myPatient == {} || myPatient == null) {
                           console.log('something bad happened');
                           return;
                       }
                                      
                      var resetEmail = new ResetEmail();
                      resetEmail.username = request.body.username;
                      var randomHash = makeHash();
                      resetEmail.myHash = randomHash;
                      resetEmail.myDate = new Date();
                      resetEmail.save(function(err) {
                          if(err) {
                              console.log("couldn't save");
                          }
                      });
                      //need to generate a random password for the user, and set it to their account.
                      var newPassword = makeHash();
                      var hashedpass = useraccount.hash(newPassword);
                      var PassAndSalt = hashedpass + useraccount.salt;
                      var hashedSaltPlusPass = useraccount.hash(PassAndSalt);
                      var inputPassEncrypted = useraccount.encrypt(hashedSaltPlusPass);
                      useraccount.encryptedPassword = inputPassEncrypted;
                      useraccount.resetRequestSent = true;
                      useraccount.save(function(err) {
                          if(err) {
                              response.send(err);
                              return;
                          }
                      });
        
                      var emailBody = `
                      <h4>Hello, please follow the folowing instructions to recover your account </h4>
                      <p>We have assigned your account a temporary password to be used to log in to your account.</p> 
                      <p>Your temporary password is ${newPassword}. </p>
                      <p>Upon logging in, you will be prompted to enter a new password. Once you have entered your new password, your account will be updated accordingly</p>
                      <h5>Thank you for using Self Start </h5>
                      `;
                      var mailOptions = {
                          to: myPatient.email,
                          subject: "Self Start - Recover Account",
                          html: emailBody
                      }; 
                       
                      smtpTransport.sendMail(mailOptions, function(error, resp) {
                        if(error) {
                            console.log(error);
                            return;
                        }
                        console.log(resp);
                        response.send({success: true, message: "Sent Mail!"});
                      });
                   });
                }
           
           });
       
    });
    
router.route('/update/sendpdf')
    .post(function(request, response) {
        var body = `You have been sent a Patient Summary Report from your physiotherapist at Self Start. Please note the attachment in this email. <br>
                    ${request.body.message}
                    <br>
                    <br>
                    Self Start
                    `;
        var mailOptions = {
            to: request.body.toEmail,
            subject: 'Self Start - Patient Summary',
            html: body,
            attachments: [{filename: request.body.fileName, path: request.body.pdf}]
        };
        
        smtpTransport.sendMail(mailOptions, function(error, resp) {
            if(error) {
                console.log(error);
                response.send(error);
                return;
            }
            response.send({success: true, message: "Sent Mail!"});
        });
    });
    
router.route('/rehabplan/notify')
    .post(function(request, response) {
        var url = ""; //fix this
        var body = `<h1>New Rehab Plan</h1>
                    <p>Hello ${request.body.name}!</p>
                    <p>You have recently been assigned the exercise menu: ${request.body.rehabPlanName}</p>
                    <p>Please sign in to your account on Self Start to view the new exercise menu</p>
                    <p>Have a nice day! </p>
                    <br>
                    <img src="http://marcottephysio.com/wp-content/uploads/2017/03/growing-in-cement_940x434.jpg" />
                    
                    `;
                    
        console.log(request.body.toEmail);
        var to = request.body.toEmail;
        var mailOptions = {
            to: to,
            subject: "SelfStart - New Exercise Menu",
            html: body,
        };
        
        smtpTransport.sendMail(mailOptions, function(error, resp) {
            if(error) {
                response.send(error);
                return;
            }
            
            console.log(resp);
            response.send({success: true, message: "Sent Mail!"});
        });
    });
    
router.route('/assessmenttest/notify/:plan_id')
    .post(function(request, response) {
        Patient.find({"rehabPlan": request.params.plan_id}, function (error, patients) {
            if (error) {
               response.send({error: error});
            }
            else {
               var url = ""; //fix this
               
                    
                console.log(request.body.toEmail);
                for(var i = 0; i < patients.length; i++) {
                    var body = `<h1>New Rehab Plan</h1>
                    <p>Hello ${patients[i].givenName} ${patients[i].familyName}!</p>
                    <p>You have recently been assigned a new Assessment Test: ${request.body.assessmenttest}</p>
                    <p>Please sign in to your account on Self Start to complete the new assessment test</p>
                    <p>Have a nice day! </p>
                    <br>
                    <img src="http://marcottephysio.com/wp-content/uploads/2017/03/growing-in-cement_940x434.jpg" />
                    
                    `;
                    var to = patients[i].email;
                    var mailOptions = {
                        to: to,
                        subject: "SelfStart - Assessment Test Assigned",
                        html: body,
                    };
                    
                    smtpTransport.sendMail(mailOptions, function(error, resp) {
                        if(error) {
                            response.send(error);
                            return;
                        }
                        
                        console.log(resp);
                       
                    });
                }
                
                 response.send({success: true, message: "Sent Mail!"});
            }
        });
    });
    
router.route('/expert/ask')
    .post(function(request, response) {
        var url = ""; //fix this
        var body = `<h2>Ask an Expert Question</h2>
                    <p>Question from: ${request.body.name}</p>
                    <p>Provided reply address: ${request.body.email} </p>
                    <p><b>Question</b></p>
                    <p>${request.body.question}</p>
                    
                    `;
                    
        var to = "loopsolutionsuwo@gmail.com"
        var mailOptions = {
            to: to,
            subject: "SelfStart - New Exercise Menu",
            html: body,
        };
        
        smtpTransport.sendMail(mailOptions, function(error, resp) {
            if(error) {
                response.send(error);
                return;
            }
            
            console.log(resp);
            response.send({success: true, message: "Sent Mail!"});
        });
    });
    
module.exports = router;

