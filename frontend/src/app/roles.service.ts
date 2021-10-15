import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class RolesService {

  constructor(private http: HttpClient) { }

  GetAllRoles() {
    var url = "/api/role";

    return this.http.get(url);
  }

  GetAllPermissions() {
    var url = "/api/role/permission";

    return this.http.get(url);
  }

  UpdateRolePermissions(id: string, newRoles: any) {
    var url = "/api/role/updateperm/" + id;
    var body = {
      permissions: newRoles
    }

    return this.http.put(url, body);
  }
}
