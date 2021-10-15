var mongoose = require("mongoose");

var recommendationSchema = new mongoose.Schema({
    timeStamp: Date,
    decision: String,
    test: {type: mongoose.Schema.Types.ObjectId, ref: 'AssessmentTests'},
    response: {type: mongoose.Schema.Types.ObjectId, ref: 'Treatments'}

});

var Recommendation = mongoose.model('Recommendation', recommendationSchema);
module.exports = Recommendation;