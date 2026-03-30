import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; 
import { ClienteNavbarComponent } from '../../../components/cliente-navbar/cliente-navbar';

@Component({
  selector: 'app-staff-budget',
  standalone: true,
  imports: [CommonModule, FormsModule, ClienteNavbarComponent],
  templateUrl: './staff-budget.html'
})
export class StaffBudgetComponent implements OnInit {
  solicitacaoId: string | null = '';
  valorOrcamento: number | null = null;
  
  // Adicionado campos que o HTML solicita para evitar erros de 'undefined'
  dadosSolicitacao = {
    dataAbertura: '30/03/2026 14:00',
    cliente: { 
      nome: 'Marcos Mello',
      cpf: '123.456.789-00' 
    },
    produto: 'Monitor Samsung 24"',
    descricaoDefeito: 'Tela piscando após 10 minutos de uso.'
  };

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.solicitacaoId = this.route.snapshot.paramMap.get('id');
  }

  voltar() {
    this.router.navigate(['/staff/home']);
  }

  salvarOrcamento() {
    if (!this.valorOrcamento || this.valorOrcamento <= 0) {
      alert('Por favor, insira um valor válido para o orçamento.');
      return;
    }

    // Lógica RF012
    console.log('Orçamento Salvo:', {
      id: this.solicitacaoId,
      valor: this.valorOrcamento,
      data: new Date().toLocaleString('pt-BR'),
      status: 'ORÇADA'
    });

    alert('Orçamento registrado com sucesso!');
    this.voltar(); 
  }
}