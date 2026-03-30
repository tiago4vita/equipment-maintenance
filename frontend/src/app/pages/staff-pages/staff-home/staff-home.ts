import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // 1. Adicionamos o import do Router
import { ClienteNavbarComponent } from '../../../components/cliente-navbar/cliente-navbar';

@Component({
  selector: 'app-staff-home',
  standalone: true,
  imports: [CommonModule, ClienteNavbarComponent],
  templateUrl: './staff-home.html' 
})
export class StaffHomeComponent {
  // 2. Adicionamos um 'id' fictício para cada item poder ser acessado na rota
  solicitacoesAbertas = [
    { id: 1, data: '30/03/2026 10:00', cliente: 'Marcos Mello', produto: 'Monitor Samsung 24"' },
    { id: 2, data: '30/03/2026 14:30', cliente: 'Murilo Cardoso', produto: 'Desktop Positivo' },
    { id: 3, data: '31/03/2026 09:15', cliente: 'Tiago Vita', produto: 'Notebook Dell Inspiron' }
  ];

  // 3. O construtor é necessário para injetar o Router
  constructor(private router: Router) {}

  truncate(text: string, limit: number): string {
    if (!text) return '';
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }

  efetuarOrcamento(item: any) {
    console.log('Iniciando orçamento para:', item.cliente);
    // 4. Aqui fazemos a navegação real para o RF012 usando o ID do item
    this.router.navigate(['/staff/budget', item.id]);
  }
}