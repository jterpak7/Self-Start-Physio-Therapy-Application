//This table is for storing all the sessions that are currently active, it maps user ID to a nonce that is specific to the session

var mongoose = require('mongoose');
var ttl = require('mongoose-ttl');

var sessionSchema = new mongoose.Schema(
    {
        userID: String,
        nonce: String,
        userType: String,
        opened: Date
    }
);

sessionSchema.plugin(ttl, { ttl: 3600000 });
var Session = mongoose.model('Session', sessionSchema);

module.exports = Session;