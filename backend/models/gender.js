var mongoose = require('mongoose');
var genderSchema = new mongoose.Schema(
    {
        name: String,
        patient: [{type: mongoose.Schema.Types.ObjectId, ref: 'Patient'}]
    }
);

var Gender = mongoose.model('Gender', genderSchema);
module.exports = Gender;