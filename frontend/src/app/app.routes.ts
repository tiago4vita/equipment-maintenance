import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page';
import { SignUpPageComponent } from './pages/sign-up-page/sign-up-page';
import { MaintenancePageComponent } from './pages/user-pages/maintenance-page/maintenance-page';
import { StaffHomeComponent } from './pages/staff-pages/staff-home/staff-home';
import { StaffBudgetComponent } from './pages/staff-pages/staff-budget/staff-budget';

export const routes: Routes = [
  // Public routes (profile badge: use data.profileKind — 'funcionario' for staff views)
  { path: '', component: LoginPageComponent, data: { profileKind: 'cliente' } },
  { path: 'login', component: LoginPageComponent, data: { profileKind: 'cliente' } },
  { path: 'sign-up', component: SignUpPageComponent, data: { profileKind: 'cliente' } },

  { path: 'user/maintenance', component: MaintenancePageComponent, data: { profileKind: 'cliente' } },

  { 
    path: 'staff/home', 
    component: StaffHomeComponent, 
    data: { profileKind: 'funcionario' } 
  },

  { path: 'staff/budget/:id', component: StaffBudgetComponent, data: { profileKind: 'funcionario' } },

  { path: '**', redirectTo: '' }
];
