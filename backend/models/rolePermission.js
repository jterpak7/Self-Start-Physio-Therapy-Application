var mongoose = require('mongoose');

var rolePermissionSchema = new mongoose.Schema( 
    {
        permissionCode: String,
        permissionArea: String,
        permissionDescription: String
    })
    
var RolePermission = mongoose.model('RolePermission', rolePermissionSchema);
module.exports = RolePermission;