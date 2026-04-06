import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

export type UserProfileKind = 'cliente' | 'funcionario';

@Component({
  selector: 'app-user-profile-badge',
  standalone: true,
  imports: [NgIf],
  templateUrl: './user-profile-badge.html'
})
export class UserProfileBadgeComponent {

  @Input() displayName = 'Fulano';
  @Input() userKind: UserProfileKind = 'cliente';

  private readonly router = inject(Router);

  get userTypeLabel(): string {
    return this.userKind === 'funcionario' ? 'Funcionário' : 'Cliente';
  
  }

  get isPublicPage(): boolean {
  const publicRoutes = ['', '/', '/login', '/sign-up'];
  const path = this.router.url.split('?')[0].split('#')[0];
  return publicRoutes.includes(path);
}

sair() {
    console.log('Encerrando sessão...');
    this.router.navigate(['/login']);
  }
}
