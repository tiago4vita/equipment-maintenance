import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StaffNavbarComponent } from '../../../components/staff-navbar/staff-navbar';

@Component({
  selector: 'app-staff-maintenance',
  standalone: true,
  imports: [CommonModule, FormsModule, StaffNavbarComponent],
  templateUrl: './staff-maintenance.html'
})
export class StaffMaintenanceComponent implements OnInit {
  solicitacaoId: number = 0;
  
  // Campos do formulário (RF014)
  descricaoManutencao: string = '';
  orientacoesCliente: string = '';
  
  // MOCK: ID do funcionário logado
  funcionarioLogadoId: number = 1; 

  // MOCK: Dados da solicitação vindos do banco
  dadosSolicitacao = {
    cliente: { nome: 'João Silva', cpf: '111.222.333-44' },
    produto: 'Notebook Dell Inspiron',
    estado: 'aprovada', // ou 'redirecionada'
    descricaoDefeito: 'Computador superaquecendo e desligando sozinho após abrir programas pesados.'
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Pega o ID da rota (ex: /staff/maintenance/123)
    this.solicitacaoId = Number(this.route.snapshot.paramMap.get('id')) || 123;
  }

  salvarManutencao() {
    if (!this.descricaoManutencao || !this.orientacoesCliente) return;

    // Simulação do envio para o Backend (RF014)
    console.log('--- MANUTENÇÃO EFETUADA ---');
    console.log(`Solicitação: #${this.solicitacaoId}`);
    console.log(`Estado Alterado Para: ARRUMADA`);
    console.log(`Funcionário (ID): ${this.funcionarioLogadoId}`);
    console.log(`Data/Hora: ${new Date().toLocaleString()}`);
    console.log(`Descrição: ${this.descricaoManutencao}`);
    console.log(`Orientações: ${this.orientacoesCliente}`);

    // Retorna para a tela inicial ou listagem
    this.router.navigate(['/staff/home']);
  }

  irParaRedirecionamento() {
    // RF015: Direciona para a tela de redirecionamento passando o ID
    this.router.navigate(['/staff/redirect', this.solicitacaoId]);
  }

  voltar() {
    this.router.navigate(['/staff/home']);
  }
}