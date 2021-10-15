var mongoose  = require('mongoose');

var initialIntakeSchema = new mongoose.Schema( 
    {
        injuryNumber: Number,
        injuryarea: String,
        painScale: String,
        started: String,
        dateStarted: Date,
        describe: String,
        ratePain: String,
        weeklyPain: String,
        aggravates: String,
        easePain: String,
        morningPain: String,
        eveningPain: String,
        treatment: String,
        moreThanOneSymptom: String,
        hasOtherMedicalCondition: String,
        describeOtherMedCondition: String,
        symptoms: String,
        medicalTraumas: String,
        explainTraumas: String,
        occupation: String,
        hobbies: String,
        goals: String,
        userID: {type: mongoose.Schema.Types.ObjectId, ref: 'UserAccount'}
    }
)

var InitialIntake = mongoose.model('InitialIntake', initialIntakeSchema);
module.exports = InitialIntake;