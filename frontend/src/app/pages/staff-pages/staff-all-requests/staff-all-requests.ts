import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StaffNavbarComponent } from '../../../components/staff-navbar/staff-navbar';

@Component({
  selector: 'app-staff-all-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, StaffNavbarComponent],
  templateUrl: './staff-all-requests.html'
})
export class StaffAllRequestsComponent {
  filtroAtual: 'HOJE' | 'PERIODO' | 'TODAS' = 'TODAS';
  dataInicio: string = '';
  dataFim: string = '';

  constructor(private router: Router) {}

  solicitacoes = [
    { id: 1, data: '2026-03-31T10:00', cliente: 'Marcos Mello', produto: 'Macbook M1 Pro', estado: 'aberta' },
    { id: 2, data: '2026-03-31T11:30', cliente: 'Tiago Vita', produto: 'Dell Inspiron', estado: 'aprovada' },
    { id: 3, data: '2026-03-30T14:00', cliente: 'Ana Silva', produto: 'Monitor LG 29"', estado: 'paga' },
    { id: 4, data: '2026-03-29T09:15', cliente: 'Carla Dias', produto: 'Teclado Mecânico', estado: 'redirecionada' },
    { id: 5, data: '2026-03-28T16:20', cliente: 'João Pedro', produto: 'Playstation 5', estado: 'orcada' },
    { id: 6, data: '2026-03-27T10:00', cliente: 'Lucas Lima', produto: 'Geladeira Brastemp', estado: 'arrumada' },
    { id: 7, data: '2026-03-26T11:00', cliente: 'Beatriz Rezende', produto: 'iPhone 15', estado: 'rejeitada' }
  ];

  getVariant(status: string) {
    const variants: any = {
      aberta: { bg: 'var(--color-row-open-bg)', text: 'var(--color-row-open-text)', label: 'Aberta' },
      aprovada: { bg: 'var(--color-row-approved-bg)', text: 'var(--color-row-approved-text)', label: 'Aprovada' },
      arrumada: { bg: 'var(--color-row-fixed-bg)', text: 'var(--color-row-fixed-text)', label: 'Arrumada' },
      finalizada: { bg: 'var(--color-row-finished-bg)', text: 'var(--color-row-finished-text)', label: 'Finalizada' },
      orcada: { bg: 'var(--color-row-quoted-bg)', text: 'var(--color-row-quoted-text)', label: 'Orçada' },
      paga: { bg: 'var(--color-row-paid-bg)', text: 'var(--color-row-paid-text)', label: 'Paga' },
      redirecionada: { bg: 'var(--color-row-redirected-bg)', text: 'var(--color-row-redirected-text)', label: 'Redirecionada' },
      rejeitada: { bg: 'var(--color-row-rejected-bg)', text: 'var(--color-row-rejected-text)', label: 'Rejeitada' }
    };
    return variants[status.toLowerCase()] || variants['aberta'];
  }

  irParaOrcamento(id: number) { 
    this.router.navigate(['/staff/budget', id]); 
  }

  irParaManutencao(id: number) { 
    this.router.navigate(['/staff/maintenance', id]); 
  }

  finalizarSolicitacao(id: number) { 
    console.log('Finalizar:', id);
    // Adicione a rota de finalização aqui quando criar a tela
  }
}