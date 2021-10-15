var mongoose = require('mongoose');

var provinceSchema = new mongoose.Schema(
    {
        name: String,
        country: {type: mongoose.Schema.Types.ObjectId, ref: 'Country'},
        city: [{type: mongoose.Schema.Types.ObjectId, ref: 'City'}],
        patient: [{type: mongoose.Schema.Types.ObjectId, ref: 'Patient'}]
    }
);

var Province = mongoose.model('Province', provinceSchema);
module.exports = Province;