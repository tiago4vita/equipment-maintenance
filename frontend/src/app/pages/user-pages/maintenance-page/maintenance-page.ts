import { Component } from '@angular/core';
import { ClienteNavbarComponent } from '../../../components/cliente-navbar/cliente-navbar';
import { SolicitationFieldsHeaderComponent } from '../../../components/solicitation-fields-header/solicitation-fields-header';
import {
  SolicitationRowComponent,
  type SolicitationRowActionType,
  type SolicitationStatus
} from '../../../components/solicitation-row/solicitation-row';
import {
  type CreateSolicitationPayload,
  type SolicitationTimelineItem,
  SolicitationVisualizationModalComponent,
  type SolicitationModalMode
} from '../../../components/solicitation-visualization-modal/solicitation-visualization-modal';
import {
  formatHistoricoAutor,
  type HistoricoSolicitacaoDTO
} from '../../../models/cliente-integracao.model';

type HistoricoAtorPick = Pick<HistoricoSolicitacaoDTO, 'clienteNome' | 'funcionarioResponsavel' | 'funcionarioDestino'>;

interface SolicitationItem {
  id: number;
  device: string;
  category: string;
  description: string;
  dateTime: string;
  status: SolicitationStatus;
  quotedPrice: string;
  history: SolicitationTimelineItem[];
}

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
  protected currentModalMode: SolicitationModalMode = 'aberta';
  protected selectedSolicitation: SolicitationItem | null = null;
  protected startWithRejectFlow = false;

  protected solicitations: SolicitationItem[] = [
    this.createSolicitation(1, 'Macbook M1 Pro', 'Notebook', 'Descrição do defeito no equipamento.', '19/02/2026 08h20', 'aberta'),
    this.createSolicitation(2, 'Dell Inspiron 15 3000', 'Notebook', 'Tela com problemas de brilho.', '19/02/2026 10h40', 'orcada'),
    this.createSolicitation(3, 'iPhone 14 Pro Max', 'Celular', 'Troca de bateria e inspeção geral.', '19/02/2026 12h00', 'aprovada'),
    this.createSolicitation(4, 'Impressora HP LaserJet 1020', 'Impressora', 'Não está puxando papel corretamente.', '19/02/2026 13h15', 'rejeitada'),
    this.createSolicitation(5, 'Lenovo ThinkPad X1 Carbon', 'Notebook', 'Troca de dobradiça da tela.', '19/02/2026 14h05', 'arrumada'),
    this.createSolicitation(6, 'Acer Nitro 5 AN515', 'Notebook', 'Limpeza interna e troca de pasta térmica.', '19/02/2026 14h40', 'paga'),
    this.createSolicitation(7, 'Samsung Odyssey G5', 'Monitor', 'Análise de falha intermitente no painel.', '19/02/2026 16h20', 'finalizada'),
    this.createSolicitation(8, 'Macbook Air M2', 'Notebook', 'Direcionada para assistência especializada.', '19/02/2026 18h10', 'redirecionada'),
    this.createSolicitation(9, 'Asus Zenbook UX425', 'Notebook', 'Solicitação resgatada pelo cliente.', '19/02/2026 19h47', 'resgatada')
  ];

  protected openModalFor(solicitation: SolicitationItem): void {
    this.selectedSolicitation = solicitation;
    this.currentModalMode = this.mapStatusToMode(solicitation.status);
    this.startWithRejectFlow = false;
    this.isVisualizationModalOpen = true;
  }

  protected openCreationModal(): void {
    this.selectedSolicitation = null;
    this.currentModalMode = 'creation';
    this.startWithRejectFlow = false;
    this.isVisualizationModalOpen = true;
  }

  protected closeVisualizationModal(): void {
    this.isVisualizationModalOpen = false;
    this.selectedSolicitation = null;
    this.startWithRejectFlow = false;
  }

  protected get sortedSolicitations(): SolicitationItem[] {
    return [...this.solicitations].sort((a, b) => this.parseDateTime(a.dateTime) - this.parseDateTime(b.dateTime));
  }

  protected handleRowAction(
    solicitation: SolicitationItem,
    event: { status: SolicitationStatus; type: SolicitationRowActionType }
  ): void {
    if (solicitation.status === 'orcada' && event.type === 'approve') {
      this.applyStatusChange(solicitation, 'aprovada');
      this.selectedSolicitation = solicitation;
      this.currentModalMode = 'aprovada';
      this.startWithRejectFlow = false;
      this.isVisualizationModalOpen = true;
      return;
    }

    if (solicitation.status === 'orcada' && event.type === 'reject') {
      this.selectedSolicitation = solicitation;
      this.currentModalMode = 'orcada';
      this.startWithRejectFlow = true;
      this.isVisualizationModalOpen = true;
      return;
    }

    this.openModalFor(solicitation);
  }

  protected handleStatusChange(event: { nextStatus: SolicitationStatus; reason?: string }): void {
    if (!this.selectedSolicitation) {
      return;
    }

    this.applyStatusChange(this.selectedSolicitation, event.nextStatus, event.reason);
    this.startWithRejectFlow = false;
    this.currentModalMode = this.mapStatusToMode(event.nextStatus);
  }

  protected handleCreation(payload: CreateSolicitationPayload): void {
    const newId = this.solicitations.reduce((max, item) => Math.max(max, item.id), 0) + 1;
    const now = this.getNowDateTime();
    const created = this.createSolicitation(
      newId,
      payload.device,
      payload.category,
      payload.description,
      now,
      'aberta'
    );
    this.solicitations = [...this.solicitations, created];
    this.closeVisualizationModal();
  }

  private mapStatusToMode(status: SolicitationStatus): SolicitationModalMode {
    return status;
  }

  private applyStatusChange(
    solicitation: SolicitationItem,
    nextStatus: SolicitationStatus,
    reason?: string
  ): void {
    solicitation.status = nextStatus;
    solicitation.history = [
      ...solicitation.history,
      this.createHistoryItem(nextStatus, this.getNowDateTime(), {
        clienteNome: 'Cliente (demo)',
        funcionarioResponsavel: null,
        funcionarioDestino: null
      })
    ];

    if (reason) {
      solicitation.description = `${solicitation.description} Motivo: ${reason}`;
    }
  }

  private createSolicitation(
    id: number,
    device: string,
    category: string,
    description: string,
    dateTime: string,
    status: SolicitationStatus
  ): SolicitationItem {
    return {
      id,
      device,
      category,
      description,
      dateTime,
      status,
      quotedPrice: 'R$1250,00',
      history: this.buildHistoryForStatus(status, dateTime)
    };
  }

  private buildHistoryForStatus(status: SolicitationStatus, dateTime: string): SolicitationTimelineItem[] {
    const orderedStatuses: SolicitationStatus[] = [
      'aberta',
      'orcada',
      'rejeitada',
      'resgatada',
      'aprovada',
      'arrumada',
      'paga',
      'finalizada',
      'redirecionada'
    ];

    const currentIndex = orderedStatuses.indexOf(status);
    const until = currentIndex >= 0 ? currentIndex : 0;
    return orderedStatuses.slice(0, until + 1).map((current) =>
      this.createHistoryItem(current, dateTime, this.mockHistoricoAtor(current))
    );
  }

  private mockHistoricoAtor(status: SolicitationStatus): HistoricoAtorPick {
    const cliente: HistoricoAtorPick = {
      clienteNome: 'Cliente (demo)',
      funcionarioResponsavel: null,
      funcionarioDestino: null
    };
    const tecnico: HistoricoAtorPick = {
      clienteNome: null,
      funcionarioResponsavel: 'Rafael (demo)',
      funcionarioDestino: null
    };
    const redir: HistoricoAtorPick = {
      clienteNome: null,
      funcionarioResponsavel: 'Maria (demo)',
      funcionarioDestino: 'Mário (demo)'
    };
    switch (status) {
      case 'aberta':
      case 'aprovada':
      case 'rejeitada':
      case 'resgatada':
      case 'paga':
        return cliente;
      case 'redirecionada':
        return redir;
      default:
        return tecnico;
    }
  }

  private createHistoryItem(status: SolicitationStatus, date: string, ator: HistoricoAtorPick): SolicitationTimelineItem {
    const author = formatHistoricoAutor(ator);
    if (status === 'orcada') {
      return { label: 'Orçada', bg: '#f2d0b2', textColor: '#885000', subTextColor: '#885000b2', iconPath: '/svg/Clock.svg', date, author };
    }
    if (status === 'rejeitada') {
      return { label: 'Rejeitada', bg: '#ffc3bc', textColor: '#9d3634', subTextColor: '#9d363499', iconPath: '/svg/Clock.svg', date, author };
    }
    if (status === 'resgatada') {
      return { label: 'Resgatada', bg: '#ef89c6', textColor: '#bc237f', subTextColor: 'rgba(188,35,127,0.6)', iconPath: '/svg/Clock.svg', date, author };
    }
    if (status === 'aprovada') {
      return { label: 'Aprovada', bg: '#fcfbb0', textColor: '#676200', subTextColor: '#66600099', iconPath: '/svg/Clock.svg', date, author };
    }
    if (status === 'arrumada') {
      return { label: 'Arrumada', bg: '#cce4ff', textColor: '#2e5bab', subTextColor: '#2e5bab99', iconPath: '/svg/Clock.svg', date, author };
    }
    if (status === 'paga') {
      return { label: 'Paga', bg: '#ffcdb3', textColor: '#924e31', subTextColor: '#924e3199', iconPath: '/svg/Clock.svg', date, author };
    }
    if (status === 'finalizada') {
      return { label: 'Finalizada', bg: '#c6e8c4', textColor: '#1f7122', subTextColor: '#1f712299', iconPath: '/svg/Clock.svg', date, author };
    }
    if (status === 'redirecionada') {
      return { label: 'Redirecionada', bg: '#e5d6ff', textColor: '#6849a1', subTextColor: '#6849a199', iconPath: '/svg/Clock.svg', date, author };
    }
    return { label: 'Aberta', bg: '#e4e4e4', textColor: '#2c2c2c', subTextColor: '#2c2c2c99', iconPath: '/svg/Clock.svg', date, author };
  }

  private parseDateTime(value: string): number {
    const [datePart, timePart] = value.split(' ');
    const [day, month, year] = datePart.split('/').map(Number);
    const [hour, minute] = timePart.replace('h', ':').split(':').map(Number);
    return new Date(year, month - 1, day, hour, minute).getTime();
  }

  private getNowDateTime(): string {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hour}h${minute}`;
  }
}
