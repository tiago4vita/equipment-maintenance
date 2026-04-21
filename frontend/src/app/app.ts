import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './auth.service';
import {
  UserProfileBadgeComponent,
  UserProfileKind
} from './components/user-profile-badge/user-profile-badge';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UserProfileBadgeComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly router = inject(Router);

  protected readonly profileKind = signal<UserProfileKind>('cliente');
  protected readonly displayName = signal<string>('');

  constructor() {
    const syncSession = (): void => {
      const perfil = localStorage.getItem(AuthService.KEY_PERFIL);
      if (perfil === 'FUNCIONARIO') {
        this.profileKind.set('funcionario');
      } else if (perfil === 'CLIENTE') {
        this.profileKind.set('cliente');
      } else {
        let route = this.router.routerState.snapshot.root;
        while (route.firstChild) {
          route = route.firstChild;
        }
        const raw = route.data['profileKind'] as UserProfileKind | undefined;
        this.profileKind.set(raw === 'funcionario' || raw === 'cliente' ? raw : 'cliente');
      }

      this.displayName.set(localStorage.getItem(AuthService.KEY_USER_NOME) ?? '');
    };

    syncSession();
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(syncSession);
  }
}
