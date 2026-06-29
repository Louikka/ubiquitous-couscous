import { HttpInterceptorFn } from '@angular/common/http';


export const authInterceptor: HttpInterceptorFn = (req, next) =>
{
    const token = localStorage.getItem('jwttoken');
    if (token === null)
    {
        return next(req);
    }
    else
    {
        return next(
            req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) })
        );
    }
};
