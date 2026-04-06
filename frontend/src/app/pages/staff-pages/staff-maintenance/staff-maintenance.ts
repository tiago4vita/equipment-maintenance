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
  

  descricaoManutencao: string = '';
  orientacoesCliente: string = '';
  

  funcionarioLogadoId: number = 1; 


  dadosSolicitacao = {
    cliente: { nome: 'João Silva', cpf: '111.222.333-44' },
    produto: 'Notebook Dell Inspiron',
    estado: 'aprovada', 
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

    
    console.log('--- MANUTENÇÃO EFETUADA ---');
    console.log(`Solicitação: #${this.solicitacaoId}`);
    console.log(`Estado Alterado Para: ARRUMADA`);
    console.log(`Funcionário (ID): ${this.funcionarioLogadoId}`);
    console.log(`Data/Hora: ${new Date().toLocaleString()}`);
    console.log(`Descrição: ${this.descricaoManutencao}`);
    console.log(`Orientações: ${this.orientacoesCliente}`);

   
    this.router.navigate(['/staff/all-requests']);
  }

  irParaRedirecionamento() {
  
    this.router.navigate(['/staff/redirect', this.solicitacaoId]);
  }

  voltar() {
    this.router.navigate(['/staff/all-requests']);
  }
}