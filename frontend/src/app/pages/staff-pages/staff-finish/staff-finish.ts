import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { StaffNavbarComponent } from '../../../components/staff-navbar/staff-navbar';

@Component({
  selector: 'app-staff-finish',
  standalone: true,
  imports: [CommonModule, StaffNavbarComponent],
  templateUrl: './staff-finish.html'
})
export class StaffFinishComponent implements OnInit {
  solicitacaoId: number = 0;
  dataAtual: Date = new Date();
  
  // MOCK: Funcionário logado (ex: Mário)
  funcionarioLogado = { id: 10, nome: 'Mário' };

  // MOCK: Dados consolidados para o fechamento
  dadosSolicitacao = {
    cliente: { nome: 'Joaquina Oliveira', cpf: '444.555.666-77' },
    produto: 'Impressora HP LaserJet',
    estado: 'PAGA',
    tecnicoManutencao: 'Maria',
    valor: 250.00,
    descricaoManutencao: 'Limpeza dos roletes e troca do fusor. Testes de impressão realizados com sucesso.'
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.solicitacaoId = Number(this.route.snapshot.paramMap.get('id')) || 2024;
  }

  finalizar() {
    // Implementação do RF016
    console.log('--- FINALIZAÇÃO DE SOLICITAÇÃO ---');
    console.log(`ID: ${this.solicitacaoId}`);
    console.log(`Status Final: FINALIZADA`);
    console.log(`Responsável pelo Fechamento: ${this.funcionarioLogado.nome}`);
    console.log(`Data/Hora: ${new Date().toLocaleString()}`);

    // Navega de volta para a listagem (RF013)
    this.router.navigate(['/staff/all-requests']);
  }

  voltar() {
    this.router.navigate(['/staff/all-requests']);
  }
}