import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necessário para o ngModel
import { Router, ActivatedRoute } from '@angular/router';
import { StaffNavbarComponent } from '../../../components/staff-navbar/staff-navbar';
import { FUNCIONARIOS, SOLICITACOES, CLIENTES } from '../../../database.mock';

@Component({
  selector: 'app-staff-redirect',
  standalone: true,
  imports: [CommonModule, FormsModule, StaffNavbarComponent],
  templateUrl: './staff-redirect.html',
})
export class StaffRedirectComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  solicitacaoAtual: any;
  nomeCliente: string = '';
  funcionariosDisponiveis: any[] = [];
  
  funcionarioDestinoId: number | '' = '';
  motivo: string = '';

  idFuncionarioLogado = 1;

  ngOnInit() {

    this.funcionariosDisponiveis = FUNCIONARIOS.filter(f => f.id !== this.idFuncionarioLogado);

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.solicitacaoAtual = SOLICITACOES.find(s => s.id === Number(idParam));
      if (this.solicitacaoAtual) {
        const cliente = CLIENTES.find(c => c.id === this.solicitacaoAtual.clienteId);
        this.nomeCliente = cliente?.nome || 'Desconhecido';
      }
    }
  }

redirecionar() {
    if (!this.funcionarioDestinoId) {
      alert('Por favor, selecione um técnico de destino.');
      return;
    }

    // Lógica simulada de salvamento
    console.log(`Solicitação redirecionada para o Técnico ID: ${this.funcionarioDestinoId}`);
    console.log(`Motivo anotado: ${this.motivo}`);

    // Volta para a gestão de solicitações
    this.router.navigate(['/staff/all-requests']);
  }

  voltar() {
    this.router.navigate(['/staff/all-requests']);
  }
}