import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page';
import { SignUpPageComponent } from './pages/sign-up-page/sign-up-page';
import { MaintenancePageComponent } from './pages/user-pages/maintenance-page/maintenance-page';
import { StaffHomeComponent } from './pages/staff-pages/staff-home/staff-home';
import { StaffBudgetComponent } from './pages/staff-pages/staff-budget/staff-budget';
import { StaffAllRequestsComponent } from './pages/staff-pages/staff-all-requests/staff-all-requests';
import { StaffMaintenanceComponent } from './pages/staff-pages/staff-maintenance/staff-maintenance';
import { StaffRedirectComponent } from './pages/staff-pages/staff-redirect/staff-redirect';
import { StaffFinishComponent } from './pages/staff-pages/staff-finish/staff-finish';
import { StaffCategoriesComponent } from './pages/staff-pages/staff-categories/staff-categories';
import { StaffEmployeesComponent } from './pages/staff-pages/staff-employees/staff-employees';
import { StaffReportsComponent } from './pages/staff-pages/staff-reports/staff-reports';

export const routes: Routes = [

  // ROTAS PÚBLICAS E DE CLIENTE

  { path: '', component: LoginPageComponent, data: { profileKind: 'cliente' } },
  { path: 'login', component: LoginPageComponent, data: { profileKind: 'cliente' } },
  { path: 'sign-up', component: SignUpPageComponent, data: { profileKind: 'cliente' } },
  { path: 'user/maintenance', component: MaintenancePageComponent, data: { profileKind: 'cliente' } },

  // ROTAS DE FUNCIONÁRIO (STAFF)
  { 
    path: 'staff/home', 
    component: StaffHomeComponent, 
    data: { profileKind: 'funcionario' } 
  },
  { 
    path: 'staff/all-requests', 
    component: StaffAllRequestsComponent, 
    data: { profileKind: 'funcionario' } 
  },
  {
    path: 'staff/categories', 
    component: StaffCategoriesComponent,
    data: { profileKind: 'funcionario' }
  },
  {
    path: 'staff/employees', 
    component: StaffEmployeesComponent,
    data: { profileKind: 'funcionario' }
  },

  { 
    path: 'staff/budget/:id', 
    component: StaffBudgetComponent, 
    data: { profileKind: 'funcionario' } 
  },
  { 
    path: 'staff/maintenance/:id', 
    component: StaffMaintenanceComponent, 
    data: { profileKind: 'funcionario' } 
  },
  {
    path: 'staff/redirect/:id',
    component: StaffRedirectComponent,
    data: { profileKind: 'funcionario' }
  },
  {
    path: 'staff/finish/:id',
    component: StaffFinishComponent,
    data: { profileKind: 'funcionario' }
  },

  {
    path: 'staff/reports',
    component: StaffReportsComponent,
    data: { profileKind: 'funcionario' }
  },
  {
    path: 'staff/revenue-report',
    redirectTo: '/staff/reports',
    pathMatch: 'full'
  },
  {
    path: 'staff/category-report',
    redirectTo: '/staff/reports',
    pathMatch: 'full'
  },

  { path: '**', redirectTo: '' }
];