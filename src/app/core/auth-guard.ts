import { CanActivateFn, Router } from '@angular/router';
import {inject, PLATFORM_ID } from "@angular/core"
import { isPlatformBrowser } from "@angular/common";

export const authGuard: CanActivateFn = () => {

  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {

    const isLogged = sessionStorage.getItem('auth');

    if (isLogged) {
      return true;
    } else {
      router.navigate(['/login']);
      return false;
    }

  }
  return true;
};
