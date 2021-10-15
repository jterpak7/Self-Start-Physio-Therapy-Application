import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { RolesService } from '../roles.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-manage-permissions',
  templateUrl: './manage-permissions.component.html',
  styleUrls: ['./manage-permissions.component.scss']
})

export class ManagePermissionsComponent implements OnInit {
  roles: any;
  permissions: any;
  currentRole: any;
  allPermissions: any;
  startAllPermissions: any;
  difPermissions: any;
  displayedColumns = ['code', 'area', 'actions'];
  dataSource: MatTableDataSource<Permission>;
  constructor(private rolesService: RolesService) { }

  ngOnInit() {
    this.difPermissions = [];
    this.rolesService.GetAllRoles().subscribe(data => {
      var retObj: any = data;
      this.roles = retObj.roles;

      this.rolesService.GetAllPermissions().subscribe(data => {
        var retObj1: any = data;
        this.allPermissions = retObj1.permissions; 

        this.setRolePermissions(this.roles[0]);
      });
    });
  }

  setRolePermissions(role) {
    this.currentRole = role;
    var toRemove = this.currentRole.permission;
    //get the difference in the lists, this is for the user to be able to add permissions that the role does not currently have
    this.difPermissions = this.allPermissions.slice();
    if(role.permission.length > 0) {
      for( var i=this.difPermissions.length - 1; i>=0; i--){
        for( var j=0; j<toRemove.length; j++){
            if(this.difPermissions[i] && (this.difPermissions[i]._id === toRemove[j]._id)){
             this.difPermissions.splice(i, 1);
           }
         }
     }
    }
    else{
      this.difPermissions = this.allPermissions.slice();
    }

    var tempList = [];
    this.difPermissions.forEach(element => {
      tempList.push(CreatePermission(element));
    });

    this.difPermissions = tempList;

    this.dataSource = new MatTableDataSource(this.difPermissions);
  }

  AssignPermission(permission) {
    var newPermission: any;
    for(var i = 0; i < this.allPermissions.length; i++) {
      if(this.allPermissions[i]._id == permission.id){
        newPermission = this.allPermissions[i];
        break;
      }
    }

    this.currentRole.permission.push(newPermission);
    this.setRolePermissions(this.currentRole);
    this.rolesService.UpdateRolePermissions(this.currentRole._id, this.currentRole.permission).subscribe(data => {
    })
  }

  RemovePermission(permission) {
    var newPermission: any;
    for(var i = 0; i < this.allPermissions.length; i++) {
      if(this.allPermissions[i]._id == permission.id){
        newPermission = this.allPermissions[i];
        break;
      }
    }
    this.currentRole.permission.splice(this.currentRole.permission.indexOf(newPermission), 1);
    this.setRolePermissions(this.currentRole);
    this.rolesService.UpdateRolePermissions(this.currentRole._id, this.currentRole.permission).subscribe(data => {
    })
  }
}

function comparer(otherArray){
  return function(current){
    return otherArray.filter(function(other){
      return other.value == current.value && other.display == current.display
    }).length == 0;
  }
}

function CreatePermission(permission: any): Permission{
  return {
    id: permission._id,
    code: permission.permissionCode,
    area: permission.permissionArea
  }
}

export interface Permission {
  id: string,
  code: string;
  area: string
}
