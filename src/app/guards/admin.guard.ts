import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isloggedIn) {
    return router.createUrlTree(['/login']);
  }

  return authService.isAdmin()
    ? true
    : router.createUrlTree(['/forbidden']);
};
