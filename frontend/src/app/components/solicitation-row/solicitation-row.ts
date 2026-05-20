import { Component, EventEmitter, Input, Output } from '@angular/core';
import { getUiStatusTheme } from '../../solicitation-status-theme';
import { truncarTexto } from '../../text-util';

export type SolicitationStatus =
  | 'aberta'
  | 'aprovada'
  | 'arrumada'
  | 'finalizada'
  | 'orcada'
  | 'paga'
  | 'redirecionada'
  | 'resgatada'
  | 'rejeitada';

export type SolicitationRowActionType = 'default' | 'approve' | 'reject';

interface SolicitationVariant {
  rowBackground: string;
  statusTextColor: string;
  statusLabel: string;
  actionLabel: string | null;
  hasQuotedActions: boolean;
}

const STATUS_META: Record<
  SolicitationStatus,
  Pick<SolicitationVariant, 'statusLabel' | 'actionLabel' | 'hasQuotedActions'>
> = {
  aberta: { statusLabel: 'Aberta', actionLabel: null, hasQuotedActions: false },
  aprovada: { statusLabel: 'Aprovada', actionLabel: null, hasQuotedActions: false },
  arrumada: { statusLabel: 'Arrumada', actionLabel: 'Pagar Serviço', hasQuotedActions: false },
  finalizada: { statusLabel: 'Finalizada', actionLabel: null, hasQuotedActions: false },
  orcada: { statusLabel: 'Orçada', actionLabel: null, hasQuotedActions: true },
  paga: { statusLabel: 'Paga', actionLabel: null, hasQuotedActions: false },
  redirecionada: { statusLabel: 'Redirecionada', actionLabel: null, hasQuotedActions: false },
  resgatada: { statusLabel: 'Resgatada', actionLabel: null, hasQuotedActions: false },
  rejeitada: { statusLabel: 'Rejeitada', actionLabel: 'Resgatar Serviço', hasQuotedActions: false }
};

@Component({
  selector: 'app-solicitation-row',
  templateUrl: './solicitation-row.html'
})
export class SolicitationRowComponent {
  @Input({ required: true }) status: SolicitationStatus = 'aberta';
  @Input() device = 'Macbook M1 Pro';
  @Input() dateTime = '19 de Fevereiro 19h47';
  @Input() category = 'Notebook';
  @Input() quotedPrice = 'R$1250,00';
  @Output() readonly visualize = new EventEmitter<SolicitationStatus>();
  @Output() readonly action = new EventEmitter<{
    status: SolicitationStatus;
    type: SolicitationRowActionType;
  }>();

  protected get variant(): SolicitationVariant {
    const theme = getUiStatusTheme(this.status);
    const meta = STATUS_META[this.status];
    return {
      rowBackground: theme.bg,
      statusTextColor: theme.text,
      ...meta
    };
  }

  protected get truncatedDevice(): string {
    return truncarTexto(this.device);
  }

  protected get shouldShowActionButton(): boolean {
    return this.variant.actionLabel !== null;
  }

  protected onVisualizeClick(): void {
    this.visualize.emit(this.status);
  }

  protected onActionClick(): void {
    this.action.emit({ status: this.status, type: 'default' });
  }

  protected onApproveClick(): void {
    this.action.emit({ status: this.status, type: 'approve' });
  }

  protected onRejectClick(): void {
    this.action.emit({ status: this.status, type: 'reject' });
  }
}
