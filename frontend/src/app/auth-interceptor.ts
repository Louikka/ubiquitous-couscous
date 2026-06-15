import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from './auth';


export const authInterceptor: HttpInterceptorFn = (req, next) =>
{
    const authService = inject(Auth);

    const nextReq = authService.jwtToken === null
        ? req
        : req.clone({ headers: req.headers.set('Authorization', `Bearer ${authService.jwtToken}`) });

    return next(nextReq);
};
