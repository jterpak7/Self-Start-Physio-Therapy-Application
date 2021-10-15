var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var exerciseSchema = new mongoose.Schema(
    {
        name: String,
        description: String,
        objectives: String,
        authorName: String,
        actionSteps: String,
        location: String,
        frequency: String,
        duration: String,
        multimedia: [String],
        rehabilitationPlans: {type: mongoose.Schema.Types.ObjectId, ref: 'RehabilitationPlans'}
    }
);

exerciseSchema.plugin(mongoosePaginate);
var Exercise = mongoose.model('Exercise', exerciseSchema);
module.exports = Exercise;
