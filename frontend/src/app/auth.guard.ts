import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Exige JWT e perfil igual a `data['role']` (`CLIENTE` ou `FUNCIONARIO`).
 */
export const authGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const required = route.data['role'] as string | undefined;
  if (!required) {
    return true;
  }

  const token = localStorage.getItem(AuthService.KEY_TOKEN);
  const perfil = localStorage.getItem(AuthService.KEY_PERFIL);
  if (!token || !perfil) {
    void router.navigate(['/login']);
    return false;
  }
  if (perfil !== required) {
    if (perfil === 'FUNCIONARIO') {
      void router.navigate(['/staff/home']);
    } else {
      void router.navigate(['/user/maintenance']);
    }
    return false;
  }
  return true;
};
