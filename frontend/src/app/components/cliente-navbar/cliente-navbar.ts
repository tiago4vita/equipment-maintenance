import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-cliente-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './cliente-navbar.html'
})
export class ClienteNavbarComponent {
  @Input() linkInicio: string = '/user/maintenance';
}