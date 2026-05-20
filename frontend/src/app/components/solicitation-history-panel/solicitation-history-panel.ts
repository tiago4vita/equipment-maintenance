import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { formatBrDateTime } from '../../date-util';
import {
  formatHistoricoAutor,
  HistoricoSolicitacaoDTO,
  STATUS_LABELS,
  StatusManutencao
} from '../../models/cliente-integracao.model';
import {
  getApiStatusTheme,
  type SolicitationStatusTheme
} from '../../solicitation-status-theme';

interface HistoricoItem {
  id: number;
  status: StatusManutencao;
  rotulo: string;
  theme: SolicitationStatusTheme;
  dataFormatada: string;
  autor: string;
  observacao: string | null;
}

@Component({
  selector: 'app-solicitation-history-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './solicitation-history-panel.html'
})
export class SolicitationHistoryPanelComponent {
  @Input() set historico(items: HistoricoSolicitacaoDTO[]) {
    this.itens = (items ?? []).map((h) => ({
      id: h.id,
      status: h.statusNovo,
      rotulo: STATUS_LABELS[h.statusNovo] ?? h.statusNovo,
      theme: getApiStatusTheme(h.statusNovo),
      dataFormatada: formatBrDateTime(h.dataAlteracao),
      autor: formatHistoricoAutor(h),
      observacao: h.observacao?.trim() || null
    }));
  }

  protected itens: HistoricoItem[] = [];
}
