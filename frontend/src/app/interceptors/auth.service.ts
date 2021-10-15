import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service'
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import {Observable} from "rxjs";

@Injectable()
export class AuthService implements HttpInterceptor{

  constructor(private cookieService: CookieService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      setHeaders: {
        Authorization: this.cookieService.get('session')
      }
    });

    return next.handle(req);
  }

}
