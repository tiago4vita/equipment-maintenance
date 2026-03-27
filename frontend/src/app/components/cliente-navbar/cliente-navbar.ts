import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-cliente-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './cliente-navbar.html'
})
export class ClienteNavbarComponent {}
