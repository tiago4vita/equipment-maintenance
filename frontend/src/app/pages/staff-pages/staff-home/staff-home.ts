import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // 1. Adicionamos o import do Router
import { StaffNavbarComponent } from '../../../components/staff-navbar/staff-navbar';
import { SOLICITACOES, CLIENTES } from '../../../database.mock';

@Component({
  selector: 'app-staff-home',
  standalone: true,
  imports: [CommonModule, StaffNavbarComponent],
  templateUrl: './staff-home.html', 
  styleUrl: './staff-home.css'
})
export class StaffHomeComponent {
  
  constructor(private router: Router) {}

  get solicitacoesAbertas() {
    return SOLICITACOES
      .filter(s => s.estado === 'ABERTA')
      .sort((a, b) => new Date(a.dataAbertura).getTime() - new Date(b.dataAbertura).getTime());
  }

  getNomeCliente(id: number): string {
    const cliente = CLIENTES.find(c => c.id === id);
    return cliente ? cliente.nome : 'Desconhecido';
  }

  irParaOrcamento(id: number) {
    this.router.navigate(['/staff/budget', id]);
  }
}
