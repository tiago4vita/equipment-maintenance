import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StaffNavbarComponent } from '../../../components/staff-navbar/staff-navbar';
import { SOLICITACOES, CLIENTES } from '../../../database.mock';

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

  getNomeCliente(id: number): string {
    const cliente = CLIENTES.find(c => c.id === id);
    return cliente ? cliente.nome : 'Desconhecido';
  }

  solicitacoes = SOLICITACOES;

  get solicitacoesFiltradas() {
    return this.solicitacoes.filter(s => {

      if (this.filtroAtual === 'TODAS') {
        return true;
      }
      const dataSolicitacao = new Date(s.dataAbertura);

      if (this.filtroAtual === 'HOJE') {
        const hoje = new Date();
        return dataSolicitacao.toDateString() === hoje.toDateString();
      }

      if (this.filtroAtual === 'PERIODO') {
        if (!this.dataInicio && !this.dataFim) return true;

        const tempoSol = dataSolicitacao.getTime();
        const inicio = this.dataInicio ? new Date(this.dataInicio + 'T00:00:00').getTime() : 0;
        const fim = this.dataFim ? new Date(this.dataFim + 'T23:59:59').getTime() : Infinity;

        return tempoSol >= inicio && tempoSol <= fim;
      }

      return true;
    });
  }

  getVariant(status: string) {
    const variants: any = {
      aberta: { bg: 'var(--color-row-open-bg)', text: 'var(--color-row-open-text)', label: 'Aberta' },
      aprovada: { bg: 'var(--color-row-approved-bg)', text: 'var(--color-row-approved-text)', label: 'Aprovada' },
      arrumada: { bg: 'var(--color-row-fixed-bg)', text: 'var(--color-row-fixed-text)', label: 'Arrumada' },
      finalizada: { bg: 'var(--color-row-finished-bg)', text: 'var(--color-row-finished-text)', label: 'Finalizada' },
      orçada: { bg: 'var(--color-row-quoted-bg)', text: 'var(--color-row-quoted-text)', label: 'Orçada' },
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
    console.log('Navegando para finalizar a solicitação:', id);
    this.router.navigate(['/staff/finish', id]); 
  }
}