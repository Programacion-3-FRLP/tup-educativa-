import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const loginGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const user = await authService.waitForAuthState();

  if (user) {
    return router.createUrlTree(['/items']);
  }

  return true;
};