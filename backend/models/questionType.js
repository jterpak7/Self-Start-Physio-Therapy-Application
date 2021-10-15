var mongoose = require("mongoose");

var questionTypeSchema = mongoose.Schema({
    name: String,
    question: [{type: mongoose.Schema.Types.ObjectId, ref: 'Question'}]
});

var QuestionType = mongoose.model('QuestionType', questionTypeSchema);
module.exports = QuestionType;