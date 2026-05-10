import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export type ConfirmDialogVariant = 'danger' | 'primary';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.html'
})
export class ConfirmDialogComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirmar';
  @Input() message = '';
  @Input() confirmLabel = 'Confirmar';
  @Input() cancelLabel = 'Cancelar';
  @Input() variant: ConfirmDialogVariant = 'danger';

  @Output() readonly confirmed = new EventEmitter<void>();
  @Output() readonly cancelled = new EventEmitter<void>();

  protected onConfirm(): void {
    this.confirmed.emit();
  }

  protected onCancel(): void {
    this.cancelled.emit();
  }
}
