import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserAccountsService } from './user-accounts.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class PhysioAuthGuard implements CanActivate {
  constructor(private userAccountService: UserAccountsService, 
              private router: Router,
              private cookieService: CookieService) {}

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot){
      if(this.userAccountService.LoggedIn()) {
        var isauth = await this.userAccountService.GetAuthorization();
        
        this.userAccountService.RefreshSession().subscribe(data => {
          var retObj: any = data;
          if(retObj.success) {
            var id = this.cookieService.get('ID');
            var session = this.cookieService.get('session');
            var role = this.cookieService.get('role');
  
            //refresh all of the cookies
            this.cookieService.set('ID', id, 1/24);
            this.cookieService.set('session', session, 1/24);
            this.cookieService.set('role', role, 1/24);
            
          }
        })
        //render the component if the session token is valid and the session is given to a physiotherapist
        if(isauth.authorized && isauth.role == 'PH'){
          return true;
        }
        else if(isauth.authorized && isauth.role == "AD") {
          this.router.navigate(['../admin/wrongaccount']);
        }
        else{
          this.router.navigate(['../unauthorized']);
        }
      }
      else{
        this.router.navigate(['../unauthorized']);        
      }
  }
}
