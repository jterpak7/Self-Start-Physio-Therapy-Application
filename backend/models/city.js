var mongoose = require('mongoose');
var citySchema = new mongoose.Schema(
    {
        name: String,
        province: {type: mongoose.Schema.Types.ObjectId, ref: 'Province'},
        patient: [{type: mongoose.Schema.Types.ObjectId, ref: 'Patient'}]
    }
);

var City = mongoose.model('City', citySchema);
module.exports = City;