import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../auth/services/login.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  const toastrService = inject(ToastrService);

  let modifiedRequest = request.clone({
    setHeaders: {
      Authorization: `Bearer ${loginService.getToken()}`
    }
  });

  if (request.headers.has('skip')) {
    request = request.clone({
      headers: request.headers.delete('skip')
    });
    return next(request);
  }

  return next(modifiedRequest).pipe(
    catchError((error) => {
      if (error.status === 401) {
        router.navigate(['/auth/login']);
        toastrService.error('Error', error.error?.message || error.message);
        localStorage.removeItem('token');
      } else {
        toastrService.error('Error', error.error?.message || error.message);
      }
      return throwError(() => new Error(error));
    })
  );
};
