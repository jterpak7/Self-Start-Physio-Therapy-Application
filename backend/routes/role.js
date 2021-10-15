var express = require('express');
var router = express.Router();
var Role = require('../models/role');
var Permission = require('../models/rolePermission');

router.route('/')
    .get(function(request, response) {
        Role.find(function(err, roles) {
            if(err) {
                response.send(err);
                return;
            }
            
            response.send({roles: roles});
        });
    })
    .post(function(request, response) {
        var role = new Role();
        role.name = request.body.name;
        role.code = request.body.code;
        role.permission = [];
        role.save(function(err) {
            if(err) {
                response.send(err);
                return;
            }
            
            response.send({newrole: role});
        });
    });
    
    
router.route('/manage/:id')
    .get(function(request, response) {
        Role.findById(request.params.id, function(err, role) {
            if(err) {
                response.send(err);
                return;
            }
            
            response.send({role: role});
        });
    })
    .put(function(request, response) {
        //This route is for adding permissions to a role
        Role.findById(request.params.id, function(err, role) {
            if(err) {
                response.send(err);
                return;
            }
            
            var newRolePermission = new Permission();
            newRolePermission.permissionCode = request.body.permissioncode;
            newRolePermission.permissionArea = request.body.permissionarea;
            newRolePermission.permissionDescription = request.body.permissiondescription;
            newRolePermission.save(function(err) {
                if(err) {
                    response.send(err);
                }
            });
            
            role.permission.push(newRolePermission);
            role.save(function(err) {
                if(err) {
                    response.send(err);
                    return;
                }
                
                response.send({code: role.code, updatedpermission: role.permission});
            });
        });
    })
    .delete(function(request, response) {
        Role.findByIdAndRemove(request.params.id, function(err, deleted) {
            if(err) {
                response.send(err);
                return;
            }
            
            response.send({deleted: deleted});
        });
    });
    
router.route('/permission')
    .get(function(request, response) {
        Permission.find(function(err, permissions) {
            if(err) {
                response.send(err);
                return;
            }
            
            response.send({permissions: permissions});
        });
    })
    .post(function(request, response) {
        //create a permission without tying it to a given role
        var permission = new Permission();
        permission.permissionCode = request.body.permissioncode;
        permission.permissionArea = request.body.permissionarea;
        permission.permissionDescription = request.body.permissiondescription;
        
        permission.save(function(err) {
            if(err) {
                response.send(err);
                return;
            }
            
            response.send({newpermission: permission});
        });
    });
    
router.route('/permission/:permission_id')
    .get(function(request, response) {
        Permission.findById(request.params.permission_id, function(err, permission) {
            if(err) {
                response.send(err);
                return;
            }
            
            response.send({permission: permission});
        });
    })
    .put(function(request, response) {
        Permission.findById(request.params.permission_id, function(err, permission) {
            if(err) {
                response.send(err);
                return;
            }
            
            if(permission == null) {
                response.send({success: false, message: "cannot find permission"});
                return;
            }
            
            permission.permissionCode = request.body.permissioncode;
            permission.permissionArea = request.body.permissionarea;
            permission.permissionDescription = request.body.permissiondescription;
            
            permission.save(function(err) {
                if(err) {
                    response.send(err);
                    return;
                }
                
                response.send({updatedpermission: permission});
            });
        });
    })
    .delete(function(request, response) {
        Permission.findByIdAndRemove(request.params.permission_id, function(err, deleted) {
            if(err) {
                response.send(err);
                return;
            }
            
            response.send({deleted: deleted});
        });
    });
    
router.route('/updateperm/:role_id')
    .put(function(request, response) {
        Role.findById(request.params.role_id, function(err, role) {
            if(err) {
                response.send(err);
                return;
            }
            
            if(role == null) {
                response.send({success: false, message: 'there was a problem retrieving the role'});
                return;
            }
            
            //this route takes a full list of permissions and updates the given role's permissions to be it
            role.permission = request.body.permissions;
            role.save(function(err) {
                if(err) {
                    response.send(err);
                    return;
                }
                
                response.send({success: true, message: 'role has been successfully updated'});
            });
        });
    });

module.exports = router;