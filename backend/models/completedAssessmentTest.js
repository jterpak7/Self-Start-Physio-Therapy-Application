var mongoose  = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var completedAssessmentTest = new mongoose.Schema( 
    {
        name: String,
        injuryNumber: String,
        description: String,
        completed: Boolean,
        treatmentClosed: Boolean,
        closedFinalThoughts: String,
        dateCreated: Date,
        dateCompleted: Date,
        dateClosed: Date,
        treatmentClosed: Boolean,
        closedFinalThoughts: String,
        questions: [],
        physioRate: Number,
        physioDescription: String,
      
        userID: {type: mongoose.Schema.Types.ObjectId, ref: 'UserAccount'}

    }
)

completedAssessmentTest.plugin(mongoosePaginate);
var CompletedAssessmentTest = mongoose.model('CompletedAssessmentTest', completedAssessmentTest);
module.exports = CompletedAssessmentTest;
