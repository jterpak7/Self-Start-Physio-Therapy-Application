var mongoose = require('mongoose');
var appointmentSchema = new mongoose.Schema(
    {
        date: Date,
        endDate: Date,
        reason: String,
        other: String,
        type: String,
        images: [{type: mongoose.Schema.Types.ObjectId, ref: 'Image'}],
        userID: {type: mongoose.Schema.Types.ObjectId, ref: 'UserAccount'}
    }
);

var Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;