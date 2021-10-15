var mongoose = require('mongoose');

var tempSchema = mongoose.Schema(
    {
        userID: String,
        dateCreated: Date,
        accessCode: String
    });
    
var Temp = mongoose.model('Temp', tempSchema);
module.exports = Temp;