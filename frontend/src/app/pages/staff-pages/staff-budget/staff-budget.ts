import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; 
import { StaffNavbarComponent } from '../../../components/staff-navbar/staff-navbar';
import { SOLICITACOES, CLIENTES } from '../../../database.mock';

@Component({
  selector: 'app-staff-budget',
  standalone: true,
  imports: [CommonModule, FormsModule, StaffNavbarComponent],
  templateUrl: './staff-budget.html'
})
export class StaffBudgetComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  solicitacaoId: number = 0;
  valorOrcamento: number | null = null;
  
  // 2. VARIÁVEIS PARA RECEBER OS DADOS REAIS
  solicitacaoAtual: any;
  nomeCliente: string = '';
  cpfCliente: string = '';

  ngOnInit() {
    // 3. BUSCAR DADOS PELO ID DA URL
    const idParam = this.route.snapshot.paramMap.get('id');
    this.solicitacaoId = Number(idParam);

    if (this.solicitacaoId) {
      this.solicitacaoAtual = SOLICITACOES.find(s => s.id === this.solicitacaoId);

      if (this.solicitacaoAtual) {
        const cliente = CLIENTES.find(c => c.id === this.solicitacaoAtual.clienteId);
        this.nomeCliente = cliente?.nome || 'Desconhecido';
        this.cpfCliente = cliente?.cpf || '000.000.000-00';
      }
    }
  }

  voltar() {
    this.router.navigate(['/staff/all-requests']);
  }

  salvarOrcamento() {
    if (!this.valorOrcamento || this.valorOrcamento <= 0) {
      alert('Por favor, insira um valor válido para o orçamento.');
      return;
    }

    console.log('Orçamento Salvo no Mock:', {
      id: this.solicitacaoId,
      valor: this.valorOrcamento,
      status: 'ORÇADA'
    });

    this.voltar(); 
  }
}