import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

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
  { label: 'Aberta', bg: '#e4e4e4', textColor: '#2c2c2c', subTextColor: '#2c2c2c99', iconPath: '/svg/Clock.svg', date: '19/02/2026 19h47', author: 'Feito por Rafael' },
  { label: 'Orçada', bg: '#f2d0b2', textColor: '#885000', subTextColor: '#885000b2', iconPath: '/svg/Clock.svg', date: '19/02/2026 19h47', author: 'Feito por Rafael' },
  { label: 'Rejeitada', bg: '#ffc3bc', textColor: '#9d3634', subTextColor: '#9d363499', iconPath: '/svg/Clock.svg', date: '19/02/2026 19h47', author: 'Feito por Rafael' },
  { label: 'Aprovada', bg: '#fcfbb0', textColor: '#676200', subTextColor: '#66600099', iconPath: '/svg/Clock.svg', date: '19/02/2026 19h47', author: 'Feito por Rafael' },
  { label: 'Finalizada', bg: '#c6e8c4', textColor: '#1f7122', subTextColor: '#1f712299', iconPath: '/svg/Clock.svg', date: '19/02/2026 19h47', author: 'Feito por Rafael' },
  { label: 'Paga', bg: '#ffcdb3', textColor: '#924e31', subTextColor: '#924e3199', iconPath: '/svg/Clock.svg', date: '19/02/2026 19h47', author: 'Feito por Rafael' },
  { label: 'Arrumada', bg: '#cce4ff', textColor: '#2e5bab', subTextColor: '#2e5bab99', iconPath: '/svg/Clock.svg', date: '19/02/2026 19h47', author: 'Feito por Rafael' },
  { label: 'Redirecionada', bg: '#e5d6ff', textColor: '#6849a1', subTextColor: '#6849a199', iconPath: '/svg/Clock.svg', date: '19/02/2026 19h47', author: 'Feito por Rafael' }
];

@Component({
  selector: 'app-solicitation-visualization-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './solicitation-visualization-modal.html'
})
export class SolicitationVisualizationModalComponent {
  @Input() isOpen = false;
  @Input() device = 'Macbook M1 Pro';
  @Input() dateTime = '19 de Fevereiro 19h47';
  @Input() statusLabel = 'Aberta';
  @Input() description = 'Descrição...';
  @Input() timelineItems: SolicitationTimelineItem[] = DEFAULT_TIMELINE_ITEMS;

  @Output() readonly closed = new EventEmitter<void>();

  protected closeModal(): void {
    this.closed.emit();
  }
}
