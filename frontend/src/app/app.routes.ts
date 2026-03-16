import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page';
import { SignUpPageComponent } from './pages/sign-up-page/sign-up-page';
import { MaintenancePageComponent } from './pages/user-pages/maintenance-page/maintenance-page';

export const routes: Routes = [
  // Public routes
  { path: '', component: LoginPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'sign-up', component: SignUpPageComponent },

  // User maintenance routes
  { path: 'user/maintenance', component: MaintenancePageComponent },

  // Fallback route
  { path: '**', redirectTo: '' }
];
