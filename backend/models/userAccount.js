var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
const crypto = require('crypto');

var userAccountSchema = mongoose.Schema(
    {
        userAccountName: String,
        encryptedPassword: String,
        salt: String, 
        verified: Boolean,
        needToChangePass: Boolean,
        isDisabled: Boolean, 
        resetRequestSent: Boolean, 
        userCode: String,
        dateRegistered: Date,
        lastLoggedIn: Date,
        adminUser: {type: mongoose.Schema.Types.ObjectId, ref: 'Administrator'},
        physioUser: {type: mongoose.Schema.Types.ObjectId, ref: 'Physiotherapist'},
        patientUser: {type: mongoose.Schema.Types.ObjectId, ref: 'Patient'},
        numbAppoint: Number,
        numbInitial: Number
    }
);

//This should work
userAccountSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
};

userAccountSchema.methods.hash = function(text) {
    const hash = crypto.createHash('sha256');
    hash.update(text);
    return hash.digest('binary');
};

userAccountSchema.methods.encrypt = function(plainText) {
    var cipher = crypto.createCipher('aes256', 'sammallabone'); 
    var crypted = cipher.update(plainText, 'ascii', 'binary');
    crypted += cipher.final('binary');
    return crypted;
};

userAccountSchema.methods.decrypt = function(cipherText) {
    var decipher = crypto.createDecipher('aes256', 'sammallabone');
    var dec = decipher.update(cipherText, 'binary', 'ascii');
    dec += decipher.final('ascii');
    return dec;
};

var UserAccount = mongoose.model('UserAccount', userAccountSchema);
module.exports = UserAccount;