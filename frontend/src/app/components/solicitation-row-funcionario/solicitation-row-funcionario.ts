import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-solicitation-row-funcionario',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-4 items-center p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <div class="text-[16px]">{{ date }}</div>
      <div class="font-medium">{{ customer }}</div>
      <div class="text-[16px] text-[var(--color-text-muted)]">
        {{ truncate(product, 30) }}
      </div>
      <div class="flex justify-center">
        <button
          (click)="handleBudget()"
          class="rounded-full bg-[var(--color-button-primary)] px-6 py-2 text-sm text-white transition-all hover:bg-[var(--color-button-primary-hover)] active:scale-95"
        >
          Efetuar Orçamento
        </button>
      </div>
    </div>
  `
})
export class SolicitationRowFuncionarioComponent {
  @Input() date: string = '';
  @Input() customer: string = '';
  @Input() product: string = '';

  truncate(text: string, limit: number): string {
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }

  handleBudget() {

    console.log('Redirecionando para Efetuar Orçamento...');
  }
}