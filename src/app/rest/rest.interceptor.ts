import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { UserService } from '../user/user-service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { SystemError, ValidationError } from '../error-handling/error-models';

export const restInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UserService);

  const { token } = userService.getCurrentUser() ?? {};

  // If the user is logged in, pass the token in the Authorization header
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return next(req).pipe(
    catchError((err: any) => {
      if (err instanceof HttpErrorResponse) {
        const message = err.error.message ? err.error.message : err.message;
        // Handle HTTP errors
        if (err.status >= 400 && err.status < 500) {
          // Specific handling for unauthorized errors
          return throwError(
            () => new ValidationError(String(err.status), message)
          );
          // You might trigger a re-authentication flow or redirect the user here
        } else {
          return throwError(
            () => new SystemError(String(err.status), message, err)
          );
        }
      } else {
        // Re-throw the error to propagate it further
        return throwError(() => err);
      }
    })
  );
};
