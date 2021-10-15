var mongoose = require('mongoose');

var roleSchema = new mongoose.Schema(
    {
        name: String,
        code: String,
        permission: []
    });
    
var Role = mongoose.model('Role', roleSchema);
module.exports = Role;