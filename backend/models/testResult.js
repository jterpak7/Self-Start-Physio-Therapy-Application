var mongoose = require('mongoose');

var testResultSchema = mongoose.Schema(
    {   
        question: String,
        answer: String,
        assessmentTests: {type: mongoose.Schema.Types.ObjectId, ref: 'AssessmentTests'}
    }
);

var TestResult = mongoose.model('TestResult', testResultSchema);
module.exports = TestResult;