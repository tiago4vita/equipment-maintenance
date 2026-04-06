import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StaffNavbarComponent } from '../../../components/staff-navbar/staff-navbar';
import { SOLICITACOES, CLIENTES } from '../../../database.mock';

@Component({
  selector: 'app-staff-maintenance',
  standalone: true,
  imports: [CommonModule, FormsModule, StaffNavbarComponent],
  templateUrl: './staff-maintenance.html'
})
export class StaffMaintenanceComponent implements OnInit {
 private router = inject(Router);
private route = inject(ActivatedRoute);

  solicitacaoId: number = 0;
  solicitacaoAtual: any;
  nomeCliente: string = '';

  descricaoManutencao: string = '';
  orientacoesCliente: string = '';
  funcionarioLogadoId: number = 1; 

  ngOnInit() {
    // 2. Pega o ID da rota
    const idParam = this.route.snapshot.paramMap.get('id');
    this.solicitacaoId = Number(idParam);

    if (this.solicitacaoId) {
      // 3. Busca a solicitação real no mock
      this.solicitacaoAtual = SOLICITACOES.find(s => s.id === this.solicitacaoId);

      if (this.solicitacaoAtual) {
        // 4. Busca o nome do cliente vinculado
        const cliente = CLIENTES.find(c => c.id === this.solicitacaoAtual.clienteId);
        this.nomeCliente = cliente ? cliente.nome : 'Desconhecido';
      }
    }
  }

  salvarManutencao() {
    if (!this.descricaoManutencao || !this.orientacoesCliente) return;

    // Simulação de salvamento (Log no console)
    console.log('--- MANUTENÇÃO EFETUADA ---');
    console.log(`Solicitação: #${this.solicitacaoId}`);
    console.log(`Estado Alterado Para: ARRUMADA`);
    this.router.navigate(['/staff/all-requests']);
  }

  irParaRedirecionamento() {
    this.router.navigate(['/staff/redirect', this.solicitacaoId]);
  }

  voltar() {
    this.router.navigate(['/staff/all-requests']);
  }
}