import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  templateUrl: './not-found-page.html'
})
export class NotFoundPageComponent {
  private readonly auth = inject(AuthService);

  protected get authenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  protected get homePath(): string {
    if (!this.authenticated) {
      return '/login';
    }
    return this.auth.getPerfil() === 'FUNCIONARIO' ? '/staff/home' : '/user/maintenance';
  }

  protected get homeLabel(): string {
    if (!this.authenticated) {
      return 'Ir para o login';
    }
    return this.auth.getPerfil() === 'FUNCIONARIO'
      ? 'Ir para a área do funcionário'
      : 'Ir para minhas solicitações';
  }
}
