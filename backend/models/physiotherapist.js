var mongoose = require('mongoose');
var autoIncrement = require("mongodb-autoincrement");
var mongoosePaginate = require('mongoose-paginate');

var physiotherapistSchema = new mongoose.Schema(
    {
        ID: String,
        familyName: String,
        givenName: String,
        email: String,
        dateHired: Date,
        dateFinished: Date,
        account: {type: mongoose.Schema.Types.ObjectId, ref: 'UserAccount'},
        treatments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Treatments'}]
    }
);

physiotherapistSchema.plugin(autoIncrement.mongoosePlugin, {field: 'ID'});
physiotherapistSchema.plugin(mongoosePaginate);
var Physiotherapist =  mongoose.model('Physiotherapist', physiotherapistSchema);
module.exports = Physiotherapist;