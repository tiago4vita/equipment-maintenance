import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { formatBrDateTime } from '../../date-util';
import {
  formatHistoricoAutor,
  HistoricoSolicitacaoDTO,
  STATUS_BG_CLASSES,
  STATUS_LABELS,
  StatusManutencao
} from '../../models/cliente-integracao.model';

interface HistoricoItem {
  id: number;
  status: StatusManutencao;
  rotulo: string;
  bgClass: string;
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
      bgClass: STATUS_BG_CLASSES[h.statusNovo] ?? 'bg-gray-400',
      dataFormatada: formatBrDateTime(h.dataAlteracao),
      autor: formatHistoricoAutor(h),
      observacao: h.observacao?.trim() || null
    }));
  }

  protected itens: HistoricoItem[] = [];
}
