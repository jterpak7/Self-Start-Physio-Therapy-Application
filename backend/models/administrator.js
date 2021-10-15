var mongoose = require('mongoose');
var administratorSchema = new mongoose.Schema(
    {
        ID: String,
        familyName: String,
        givenName: String,
        email: String,
        dateHired: Date,
        dateFinished: Date,
        account: {type: mongoose.Schema.Types.ObjectId, ref: 'UserAccount'},
        forms: [{type: mongoose.Schema.Types.ObjectId, ref: 'Forms'}]
    }
);

var Administrator = mongoose.model('Administrator', administratorSchema);
module.exports = Administrator;