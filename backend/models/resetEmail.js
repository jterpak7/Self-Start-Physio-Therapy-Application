//Reset email schema is for when a user wants to reset their password, they are given a hash and their username is saved

var mongoose = require('mongoose');
var resetEmailSchema = new mongoose.Schema(
    {
       username: String,
       myHash: String,
       myDate: Date
    }
);

var ResetEmail = mongoose.model('ResetEmail', resetEmailSchema);
module.exports = ResetEmail;