import { Component, EventEmitter, Input, Output } from '@angular/core';

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

const SOLICITATION_VARIANTS: Record<SolicitationStatus, SolicitationVariant> = {
  aberta: {
    rowBackground: 'var(--color-row-open-bg)',
    statusTextColor: 'var(--color-row-open-text)',
    statusLabel: 'Aberta',
    actionLabel: null,
    hasQuotedActions: false
  },
  aprovada: {
    rowBackground: 'var(--color-row-approved-bg)',
    statusTextColor: 'var(--color-row-approved-text)',
    statusLabel: 'Aprovada',
    actionLabel: null,
    hasQuotedActions: false
  },
  arrumada: {
    rowBackground: 'var(--color-row-fixed-bg)',
    statusTextColor: 'var(--color-row-fixed-text)',
    statusLabel: 'Arrumada',
    actionLabel: 'Pagar Serviço',
    hasQuotedActions: false
  },
  finalizada: {
    rowBackground: 'var(--color-row-finished-bg)',
    statusTextColor: 'var(--color-row-finished-text)',
    statusLabel: 'Finalizada',
    actionLabel: null,
    hasQuotedActions: false
  },
  orcada: {
    rowBackground: 'var(--color-row-quoted-bg)',
    statusTextColor: 'var(--color-row-quoted-text)',
    statusLabel: 'Orçada',
    actionLabel: null,
    hasQuotedActions: true
  },
  paga: {
    rowBackground: 'var(--color-row-paid-bg)',
    statusTextColor: 'var(--color-row-paid-text)',
    statusLabel: 'Paga',
    actionLabel: null,
    hasQuotedActions: false
  },
  redirecionada: {
    rowBackground: 'var(--color-row-redirected-bg)',
    statusTextColor: 'var(--color-row-redirected-text)',
    statusLabel: 'Redirecionada',
    actionLabel: null,
    hasQuotedActions: false
  },
  resgatada: {
    rowBackground: 'var(--color-row-rescued-bg)',
    statusTextColor: 'var(--color-row-rescued-text)',
    statusLabel: 'Resgatada',
    actionLabel: null,
    hasQuotedActions: false
  },
  rejeitada: {
    rowBackground: 'var(--color-row-rejected-bg)',
    statusTextColor: 'var(--color-row-rejected-text)',
    statusLabel: 'Rejeitada',
    actionLabel: 'Resgatar Serviço',
    hasQuotedActions: false
  }
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
    return SOLICITATION_VARIANTS[this.status];
  }

  protected get truncatedDevice(): string {
    if (this.device.length <= 30) {
      return this.device;
    }
    return `${this.device.slice(0, 30)}...`;
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
