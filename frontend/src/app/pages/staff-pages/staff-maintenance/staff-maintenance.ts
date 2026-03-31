import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StaffNavbarComponent } from '../../../components/staff-navbar/staff-navbar';

@Component({
  selector: 'app-staff-maintenance',
  standalone: true,
  imports: [CommonModule, FormsModule, StaffNavbarComponent],
  templateUrl: './staff-maintenance.html'
})
export class StaffMaintenanceComponent implements OnInit {
  idSolicitacao!: string;
  exibirCamposManutencao = false;

  // Dados simulados (No futuro virão do Back-end)
  solicitacao = {
    cliente: 'Marcos Mello',
    equipamento: 'Monitor Samsung 24"',
    dataAbertura: '30/03/2026 10:00',
    descricaoProblema: 'Tela piscando após 10 minutos de uso.',
    status: 'Aberta'
  };

  // Campos que o funcionário preencherá
  dadosManutencao = {
    descricao: '',
    orientacoes: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.idSolicitacao = this.route.snapshot.paramMap.get('id') || '';
  }

  prepararManutencao() {
    this.exibirCamposManutencao = true;
  }

  redirecionar() {
    // Aqui você navegará para o RF015
    this.router.navigate(['/staff/redirect', this.idSolicitacao]);
  }

  finalizarManutencao() {
    const dataHora = new Date().toLocaleString();
    const funcionario = 'Fulano de Tal'; // Simulação de usuário logado

    console.log('Manutenção Finalizada:', {
      id: this.idSolicitacao,
      ...this.dadosManutencao,
      dataHora,
      funcionario,
      novoStatus: 'ARRUMADA'
    });

    // Após salvar, volta para a home
    alert('Manutenção registrada com sucesso! Estado: ARRUMADA');
    this.router.navigate(['/staff/home']);
  }
}