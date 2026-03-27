import { Component } from '@angular/core';
import { SolicitationFieldsHeaderComponent } from '../../../components/solicitation-fields-header/solicitation-fields-header';
import { SolicitationRowComponent } from '../../../components/solicitation-row/solicitation-row';

@Component({
  selector: 'app-maintenance-page',
  imports: [SolicitationFieldsHeaderComponent, SolicitationRowComponent],
  templateUrl: './maintenance-page.html',
  styleUrl: './maintenance-page.scss'
})
export class MaintenancePageComponent {}
