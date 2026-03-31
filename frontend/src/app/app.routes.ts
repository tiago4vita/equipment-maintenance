import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page';
import { SignUpPageComponent } from './pages/sign-up-page/sign-up-page';
import { MaintenancePageComponent } from './pages/user-pages/maintenance-page/maintenance-page';
import { StaffHomeComponent } from './pages/staff-pages/staff-home/staff-home';
import { StaffBudgetComponent } from './pages/staff-pages/staff-budget/staff-budget';
import { StaffAllRequestsComponent } from './pages/staff-pages/staff-all-requests/staff-all-requests';
import { StaffMaintenanceComponent } from './pages/staff-pages/staff-maintenance/staff-maintenance';

export const routes: Routes = [
  // Public routes
  { path: '', component: LoginPageComponent, data: { profileKind: 'cliente' } },
  { path: 'login', component: LoginPageComponent, data: { profileKind: 'cliente' } },
  { path: 'sign-up', component: SignUpPageComponent, data: { profileKind: 'cliente' } },

  { path: 'user/maintenance', component: MaintenancePageComponent, data: { profileKind: 'cliente' } },

  { 
    path: 'staff/home', 
    component: StaffHomeComponent, 
    data: { profileKind: 'funcionario' } 
  },

  // CORREÇÃO: Adicionado o /:id para aceitar o ID da solicitação
  { 
    path: 'staff/budget/:id', 
    component: StaffBudgetComponent, 
    data: { profileKind: 'funcionario' } 
  },

  { 
    path: 'staff/all-requests', 
    component: StaffAllRequestsComponent, 
    data: { profileKind: 'funcionario' } 
  },

  // CORREÇÃO: Provavelmente a manutenção também precisará do ID para saber qual item consertar
  { 
    path: 'staff/maintenance/:id', 
    component: StaffMaintenanceComponent, 
    data: { profileKind: 'funcionario' } 
  },

  { path: '**', redirectTo: '' }
];