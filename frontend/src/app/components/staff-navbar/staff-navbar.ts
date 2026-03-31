import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-staff-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  // O ERRO ESTAVA AQUI: Ele estava apontando para cliente-navbar.html
  templateUrl: './staff-navbar.html' 
})
// O ERRO TS2305 ACONTECE SE NÃO TIVER O 'export'
export class StaffNavbarComponent {}