import { Component, Input } from '@angular/core';

export type UserProfileKind = 'cliente' | 'funcionario';

@Component({
  selector: 'app-user-profile-badge',
  templateUrl: './user-profile-badge.html'
})
export class UserProfileBadgeComponent {
  /** Static for now — replace when user/session data exists */
  @Input() displayName = 'Fulano';

  @Input() userKind: UserProfileKind = 'cliente';

  get userTypeLabel(): string {
    return this.userKind === 'funcionario' ? 'Funcionário' : 'Cliente';
  }
}
