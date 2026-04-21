import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../auth.service';

export type UserProfileKind = 'cliente' | 'funcionario';

@Component({
  selector: 'app-user-profile-badge',
  standalone: true,
  imports: [NgIf],
  templateUrl: './user-profile-badge.html'
})
export class UserProfileBadgeComponent {

  @Input() displayName = '';
  @Input() userKind: UserProfileKind = 'cliente';

  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  get userTypeLabel(): string {
    return this.userKind === 'funcionario' ? 'Funcionário' : 'Cliente';
  }

  get isPublicPage(): boolean {
    const publicRoutes = ['', '/', '/login', '/sign-up'];
    const path = this.router.url.split('?')[0].split('#')[0];
    return publicRoutes.includes(path);
  }

  sair(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }
}
