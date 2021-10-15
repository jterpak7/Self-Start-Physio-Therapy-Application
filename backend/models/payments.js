var mongoose = require('mongoose');
var paymentsSchema = new mongoose.Schema(
    {
        dayTimeStamp: Date,
        amount: Number,
        note: String,
        patient: {type: mongoose.Schema.Types.ObjectId, ref: ('UserAccount')}
    }
);

var Payments = mongoose.model('Payments', paymentsSchema);
module.exports = Payments;