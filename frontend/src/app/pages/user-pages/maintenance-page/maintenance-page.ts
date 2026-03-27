import { Component } from '@angular/core';
import { ClienteNavbarComponent } from '../../../components/cliente-navbar/cliente-navbar';
import { SolicitationFieldsHeaderComponent } from '../../../components/solicitation-fields-header/solicitation-fields-header';
import { SolicitationRowComponent } from '../../../components/solicitation-row/solicitation-row';

@Component({
  selector: 'app-maintenance-page',
  imports: [ClienteNavbarComponent, SolicitationFieldsHeaderComponent, SolicitationRowComponent],
  templateUrl: './maintenance-page.html'
})
export class MaintenancePageComponent {}
