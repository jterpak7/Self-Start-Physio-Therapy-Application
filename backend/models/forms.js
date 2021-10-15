var mongoose = require("mongoose");
var formsSchema = new mongoose.Schema({
    name: String,
    description: String,
    assessmentTool: {type: mongoose.Schema.Types.ObjectId, ref: 'AssessmentTests'},
    questions: [],

});
var Forms = mongoose.model('Forms', formsSchema);
module.exports = Forms;
