var mongoose = require('mongoose');
var countrySchema = new mongoose.Schema(
    {
        name: String,
        province: [{type: mongoose.Schema.Types.ObjectId, ref: 'Province'}],
        patient: [{type: mongoose.Schema.Types.ObjectId, ref: 'Patient'}]
    }
);

var Country = mongoose.model('Country', countrySchema);
module.exports = Country;