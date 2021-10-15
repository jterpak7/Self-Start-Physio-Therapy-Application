var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate');
var bcrypt = require('bcrypt');
var autoIncrement = require("mongodb-autoincrement");

var patientSchema = new mongoose.Schema(
    {
        ID: String,
        familyName: String,
        givenName: String,
        email: String,
        DOB: Date,
        postalCode: String,
        phone: String,
        others: String,
        verified: Boolean,
        physioId: String,
        address: String,
        account: {type: mongoose.Schema.Types.ObjectId, ref: 'UserAccount'},
        payment: [{type: mongoose.Schema.Types.ObjectId, ref: 'Payments'}],
        country: {type: mongoose.Schema.Types.ObjectId, ref: 'Country'},
        province: {type: mongoose.Schema.Types.ObjectId, ref: 'Province'},
        city: {type: mongoose.Schema.Types.ObjectId, ref: 'City'},
        gender: {type: mongoose.Schema.Types.ObjectId, ref: 'Gender'},
        appointment: [{type: mongoose.Schema.Types.ObjectId, ref: 'Appointment'}],
        rehabPlan: {type: mongoose.Schema.Types.ObjectId, ref: 'RehabilitationPlans'}
    }
);

patientSchema.plugin(autoIncrement.mongoosePlugin, {field: 'ID'});
patientSchema.plugin(mongoosePaginate);
var Patient =  mongoose.model('Patient', patientSchema);
module.exports = Patient;

//exports.Model = Patient;
