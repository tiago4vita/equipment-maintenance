import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteNavbarComponent } from '../../../components/cliente-navbar/cliente-navbar';

@Component({
  selector: 'app-staff-home',
  standalone: true,
  imports: [CommonModule, ClienteNavbarComponent],
  // O ERRO NG2008 ERA AQUI: O nome do arquivo HTML deve ser igual ao que está na pasta
  templateUrl: './staff-home.html' 
})
// O ERRO TS2305 ERA AQUI: O nome da classe deve ser StaffHomeComponent
export class StaffHomeComponent {
  solicitacoesAbertas = [
    { data: '30/03/2026 10:00', cliente: 'Marcos Oliveira', produto: 'Geladeira Brastemp Frost Free Inverse' },
    { data: '30/03/2026 14:30', cliente: 'Roberto Carlos', produto: 'Lava e Seca Samsung 11kg' }
  ];

  truncate(text: string, limit: number): string {
    if (!text) return '';
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }

  efetuarOrcamento(item: any) {
    console.log('Iniciando orçamento para:', item.cliente);
  }
}