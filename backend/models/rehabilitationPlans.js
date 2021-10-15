var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var rehabilitationPlansSchema = new mongoose.Schema(
    {
        name: String,
        description: String,
        authorName: String,
        goal: String,
        timeFrameToComplete: Date,
        assessmentTests: [{type: mongoose.Schema.Types.ObjectId, ref: ('AssessmentTest')}],
        exercises: [{type: mongoose.Schema.Types.ObjectId, ref: ('Exercises')}],
        treatments: [{type: mongoose.Schema.Types.ObjectId, ref: ('Treatments')}],
        exerciseObjects: []
    }
);

rehabilitationPlansSchema.plugin(mongoosePaginate);
var RehabilitationPlans = mongoose.model('RehabilitationPlans', rehabilitationPlansSchema);
module.exports = RehabilitationPlans;