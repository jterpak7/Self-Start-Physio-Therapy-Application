var mongoose = require("mongoose");

var assessmentQuestionSchema = new mongoose.Schema({
    questionText: String,
    questionCode: String,
    questionContent: [],
    answer: String
    
});

var AssessmentQuestion = mongoose.model('Question', assessmentQuestionSchema);
module.exports = AssessmentQuestion;
