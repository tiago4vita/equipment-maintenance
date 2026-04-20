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

export interface ModalCategoriaOption {
  id: number;
  nome: string;
}

/** RF004 — payload emitido pelo modal. */
export interface CreateSolicitationPayload {
  categoriaId: number;
  descricaoEquipamento: string;
  descricaoProblema: string;
  /** Rótulo amigável da categoria, útil apenas para UI otimista. */
  categoriaNome: string;
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
  @Input() device = '';
  @Input() dateTime = '';
  @Input() category = '';
  @Input() description = '';
  @Input() price = '';
  @Input() timelineItems: SolicitationTimelineItem[] = [];
  @Input() categorias: ModalCategoriaOption[] = [];

  @Output() readonly closed = new EventEmitter<void>();
  @Output() readonly statusChangeRequested = new EventEmitter<{
    nextStatus: SolicitationStatus;
    reason?: string;
  }>();
  @Output() readonly createRequested = new EventEmitter<CreateSolicitationPayload>();

  protected creationDevice = '';
  protected creationCategoryId: number | null = null;
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
      this.creationCategoryId = null;
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
    const categoriaId = Number(this.creationCategoryId);
    if (
      !this.creationDevice.trim() ||
      !Number.isFinite(categoriaId) ||
      categoriaId <= 0 ||
      !this.creationDescription.trim()
    ) {
      return;
    }

    const categoria = this.categorias.find((c) => c.id === categoriaId);

    this.createRequested.emit({
      categoriaId,
      descricaoEquipamento: this.creationDevice.trim(),
      descricaoProblema: this.creationDescription.trim(),
      categoriaNome: categoria?.nome ?? ''
    });
  }

  protected closeModal(): void {
    this.closed.emit();
  }
}
