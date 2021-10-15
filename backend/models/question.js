var mongoose = require("mongoose");

var questionSchema = new mongoose.Schema({
    questionText: String,
    helpDescription: String,
    order: Number,
    form: {type: mongoose.Schema.Types.ObjectId, ref: 'Forms'},
    questionType: {type: mongoose.Schema.Types.ObjectId, ref: 'QuestionType'}
});

var Question = mongoose.model('Question', questionSchema);
module.exports = Question;
