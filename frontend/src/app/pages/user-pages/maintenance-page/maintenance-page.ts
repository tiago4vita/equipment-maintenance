import { Component } from '@angular/core';
import { ClienteNavbarComponent } from '../../../components/cliente-navbar/cliente-navbar';
import { SolicitationFieldsHeaderComponent } from '../../../components/solicitation-fields-header/solicitation-fields-header';
import { SolicitationRowComponent } from '../../../components/solicitation-row/solicitation-row';
import { SolicitationVisualizationModalComponent } from '../../../components/solicitation-visualization-modal/solicitation-visualization-modal';

@Component({
  selector: 'app-maintenance-page',
  imports: [
    ClienteNavbarComponent,
    SolicitationFieldsHeaderComponent,
    SolicitationRowComponent,
    SolicitationVisualizationModalComponent
  ],
  templateUrl: './maintenance-page.html'
})
export class MaintenancePageComponent {
  protected isVisualizationModalOpen = false;

  protected openVisualizationModal(): void {
    this.isVisualizationModalOpen = true;
  }

  protected closeVisualizationModal(): void {
    this.isVisualizationModalOpen = false;
  }
}
