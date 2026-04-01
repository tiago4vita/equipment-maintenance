import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { SolicitationStatus } from '../solicitation-row/solicitation-row';

export type SolicitationModalMode = 'creation' | SolicitationStatus;

export interface SolicitationTimelineItem {
  label: string;
  bg: string;
  textColor: string;
  subTextColor: string;
  iconPath: string;
  date: string;
  author: string;
}

const DEFAULT_TIMELINE_ITEMS: SolicitationTimelineItem[] = [
  {
    label: 'Aberta',
    bg: '#e4e4e4',
    textColor: '#2c2c2c',
    subTextColor: '#2c2c2c99',
    iconPath: '/svg/Clock.svg',
    date: '19/02/2026 19h47',
    author: 'Feito por Rafael'
  },
  {
    label: 'Orçada',
    bg: '#f2d0b2',
    textColor: '#885000',
    subTextColor: '#885000b2',
    iconPath: '/svg/Clock.svg',
    date: '19/02/2026 19h47',
    author: 'Feito por Rafael'
  },
  {
    label: 'Rejeitada',
    bg: '#ffc3bc',
    textColor: '#9d3634',
    subTextColor: '#9d363499',
    iconPath: '/svg/Clock.svg',
    date: '19/02/2026 19h47',
    author: 'Feito por Rafael'
  },
  {
    label: 'Aprovada',
    bg: '#fcfbb0',
    textColor: '#676200',
    subTextColor: '#66600099',
    iconPath: '/svg/Clock.svg',
    date: '19/02/2026 19h47',
    author: 'Feito por Rafael'
  },
  {
    label: 'Finalizada',
    bg: '#c6e8c4',
    textColor: '#1f7122',
    subTextColor: '#1f712299',
    iconPath: '/svg/Clock.svg',
    date: '19/02/2026 19h47',
    author: 'Feito por Rafael'
  },
  {
    label: 'Paga',
    bg: '#ffcdb3',
    textColor: '#924e31',
    subTextColor: '#924e3199',
    iconPath: '/svg/Clock.svg',
    date: '19/02/2026 19h47',
    author: 'Feito por Rafael'
  },
  {
    label: 'Arrumada',
    bg: '#cce4ff',
    textColor: '#2e5bab',
    subTextColor: '#2e5bab99',
    iconPath: '/svg/Clock.svg',
    date: '19/02/2026 19h47',
    author: 'Feito por Rafael'
  },
  {
    label: 'Redirecionada',
    bg: '#e5d6ff',
    textColor: '#6849a1',
    subTextColor: '#6849a199',
    iconPath: '/svg/Clock.svg',
    date: '19/02/2026 19h47',
    author: 'Feito por Rafael'
  }
];

export interface CreateSolicitationPayload {
  device: string;
  category: string;
  description: string;
}

@Component({
  selector: 'app-solicitation-visualization-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitation-visualization-modal.html'
})
export class SolicitationVisualizationModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() mode: SolicitationModalMode = 'aberta';
  @Input() startWithRejectFlow = false;
  @Input() device = 'Macbook M1 Pro';
  @Input() dateTime = '19 de Fevereiro 19h47';
  @Input() category = 'Notebook';
  @Input() description = 'Descrição...';
  @Input() price = 'R$1250,00';
  @Input() timelineItems: SolicitationTimelineItem[] = DEFAULT_TIMELINE_ITEMS;

  @Output() readonly closed = new EventEmitter<void>();
  @Output() readonly statusChangeRequested = new EventEmitter<{
    nextStatus: SolicitationStatus;
    reason?: string;
  }>();
  @Output() readonly createRequested = new EventEmitter<CreateSolicitationPayload>();

  protected creationDevice = '';
  protected creationCategory = '';
  protected creationDescription = '';
  protected rejectionReason = '';
  protected isWritingRejectionReason = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mode'] || changes['startWithRejectFlow']) {
      this.isWritingRejectionReason = false;
      this.rejectionReason = '';
      if (this.mode === 'orcada' && this.startWithRejectFlow) {
        this.isWritingRejectionReason = true;
      }
    }

    if (changes['isOpen'] && this.isOpen && this.isCreationMode) {
      this.creationDevice = '';
      this.creationCategory = '';
      this.creationDescription = '';
    }
  }

  protected get isCreationMode(): boolean {
    return this.mode === 'creation';
  }

  protected get showsHistory(): boolean {
    return this.mode !== 'creation';
  }

  protected get statusLabel(): string {
    if (this.mode === 'creation') return '';
    if (this.mode === 'orcada') return 'Orçada';
    if (this.mode === 'aprovada') return 'Aprovada';
    if (this.mode === 'rejeitada') return 'Rejeitada';
    if (this.mode === 'arrumada') return 'Arrumada';
    if (this.mode === 'paga') return 'Paga';
    if (this.mode === 'finalizada') return 'Finalizada';
    if (this.mode === 'redirecionada') return 'Redirecionada';
    if (this.mode === 'resgatada') return 'Resgatada';
    return 'Aberta';
  }

  protected get canShowStatusActions(): boolean {
    return this.mode !== 'creation';
  }

  protected requestApprove(): void {
    this.statusChangeRequested.emit({ nextStatus: 'aprovada' });
  }

  protected beginRejectFlow(): void {
    this.isWritingRejectionReason = true;
  }

  protected cancelRejectFlow(): void {
    this.isWritingRejectionReason = false;
    this.rejectionReason = '';
  }

  protected confirmRejectFlow(): void {
    this.statusChangeRequested.emit({
      nextStatus: 'rejeitada',
      reason: this.rejectionReason.trim() || undefined
    });
  }

  protected requestRescue(): void {
    this.statusChangeRequested.emit({ nextStatus: 'resgatada' });
  }

  protected requestPay(): void {
    this.statusChangeRequested.emit({ nextStatus: 'paga' });
  }

  protected confirmCreation(): void {
    if (!this.creationDevice.trim() || !this.creationCategory.trim() || !this.creationDescription.trim()) {
      return;
    }

    this.createRequested.emit({
      device: this.creationDevice.trim(),
      category: this.creationCategory.trim(),
      description: this.creationDescription.trim()
    });
  }

  protected closeModal(): void {
    this.closed.emit();
  }
}
