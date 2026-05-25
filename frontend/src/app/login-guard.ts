import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { Auth } from './auth';


export const loginGuard: CanActivateFn = (route, state) => 
{
  const router = inject(Router);
  const authService = inject(Auth);

  if (authService.isLoggedIn())
  {
    return true;
  }

  const loginPath = router.parseUrl("/login");
  return new RedirectCommand(loginPath, {
    skipLocationChange: true,
  });
};
