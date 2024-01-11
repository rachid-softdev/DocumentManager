import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { Router } from '@angular/router';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable({
  providedIn: 'root',
})
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private _authenticationService: AuthenticationService, private _router: Router) {}

  // https://angular.io/guide/http-interceptor-use-cases
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err) => {
        if (err.status === 401 || err.status === 403) {
          this._authenticationService.logout();
          this._router.navigate(['/home']);
        }
        const error = err?.error?.message || err.statusText;
        return throwError(error);
      }),
    );
  }
}

export const ErrorInterceptorProviders = [{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }];
