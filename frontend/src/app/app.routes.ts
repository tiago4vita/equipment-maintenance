import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page';
import { SignUpPageComponent } from './pages/sign-up-page/sign-up-page';
import { MaintenancePageComponent } from './pages/user-pages/maintenance-page/maintenance-page';

export const routes: Routes = [
  // Public routes (profile badge: use data.profileKind — 'funcionario' for staff views)
  { path: '', component: LoginPageComponent, data: { profileKind: 'cliente' } },
  { path: 'login', component: LoginPageComponent, data: { profileKind: 'cliente' } },
  { path: 'sign-up', component: SignUpPageComponent, data: { profileKind: 'cliente' } },

  { path: 'user/maintenance', component: MaintenancePageComponent, data: { profileKind: 'cliente' } },

  { path: '**', redirectTo: '' }
];
