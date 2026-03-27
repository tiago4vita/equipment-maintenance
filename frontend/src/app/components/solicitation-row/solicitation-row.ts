import { Component, Input } from '@angular/core';

export type SolicitationStatus =
  | 'aberta'
  | 'aprovada'
  | 'arrumada'
  | 'finalizada'
  | 'orcada'
  | 'paga'
  | 'redirecionada'
  | 'rejeitada';

interface SolicitationVariant {
  rowBackground: string;
  statusTextColor: string;
  statusLabel: string;
  hasPrimaryAction: boolean;
  hasOrcadaActions: boolean;
}

const SOLICITATION_VARIANTS: Record<SolicitationStatus, SolicitationVariant> = {
  aberta: {
    rowBackground: 'var(--color-row-open-bg)',
    statusTextColor: 'var(--color-row-open-text)',
    statusLabel: 'Aberta',
    hasPrimaryAction: false,
    hasOrcadaActions: false
  },
  aprovada: {
    rowBackground: 'var(--color-row-approved-bg)',
    statusTextColor: 'var(--color-row-approved-text)',
    statusLabel: 'Aprovada',
    hasPrimaryAction: false,
    hasOrcadaActions: false
  },
  arrumada: {
    rowBackground: 'var(--color-row-fixed-bg)',
    statusTextColor: 'var(--color-row-fixed-text)',
    statusLabel: 'Arrumada',
    hasPrimaryAction: true,
    hasOrcadaActions: false
  },
  finalizada: {
    rowBackground: 'var(--color-row-finished-bg)',
    statusTextColor: 'var(--color-row-finished-text)',
    statusLabel: 'Finalizada',
    hasPrimaryAction: false,
    hasOrcadaActions: false
  },
  orcada: {
    rowBackground: 'var(--color-row-quoted-bg)',
    statusTextColor: 'var(--color-row-quoted-text)',
    statusLabel: 'Orçada',
    hasPrimaryAction: false,
    hasOrcadaActions: true
  },
  paga: {
    rowBackground: 'var(--color-row-paid-bg)',
    statusTextColor: 'var(--color-row-paid-text)',
    statusLabel: 'Paga',
    hasPrimaryAction: false,
    hasOrcadaActions: false
  },
  redirecionada: {
    rowBackground: 'var(--color-row-redirected-bg)',
    statusTextColor: 'var(--color-row-redirected-text)',
    statusLabel: 'Redirecionada',
    hasPrimaryAction: false,
    hasOrcadaActions: false
  },
  rejeitada: {
    rowBackground: 'var(--color-row-rejected-bg)',
    statusTextColor: 'var(--color-row-rejected-text)',
    statusLabel: 'Rejeitada',
    hasPrimaryAction: true,
    hasOrcadaActions: false
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

  protected get variant(): SolicitationVariant {
    return SOLICITATION_VARIANTS[this.status];
  }

  protected get primaryActionLabel(): string {
    if (this.status === 'arrumada') {
      return 'Pagar Serviço';
    }

    return 'Resgatar Serviço';
  }
}
