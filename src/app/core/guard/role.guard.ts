// src/app/core/guard/role.guard.ts
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, UrlTree } from '@angular/router';
import {AuthService} from '../service/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  const roles = (route.data['roles'] as string[] | undefined) ?? [];
  if (roles.length === 0 || authService.hasAnyRole(roles)) {
    return true;
  }

  return router.createUrlTree(['/']);
};
