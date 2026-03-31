import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-cliente-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './cliente-navbar.html'
})
export class ClienteNavbarComponent {
  // Rota dinâmica para o Início (padrão: cliente)
  @Input() linkInicio: string = '/user/maintenance'; 
  
  // Rota dinâmica para Solicitações (padrão: cliente)
  @Input() linkSolicitacoes: string = '/user/maintenance'; 
}