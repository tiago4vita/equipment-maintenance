import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

export interface LoginResponse {
  id: number;
  nome: string;
  email: string;
  perfil: 'CLIENTE' | 'FUNCIONARIO';
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  static readonly KEY_TOKEN = 'token';
  static readonly KEY_PERFIL = 'perfil';
  static readonly KEY_USER_ID = 'userId';
  static readonly KEY_USER_NOME = 'userNome';
  static readonly KEY_USER_EMAIL = 'userEmail';

  login(email: string, senha: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>('/api/auth/login', { email, senha })
      .pipe(tap((res) => this.persistSession(res)));
  }

  logout(): void {
    localStorage.removeItem(AuthService.KEY_TOKEN);
    localStorage.removeItem(AuthService.KEY_PERFIL);
    localStorage.removeItem(AuthService.KEY_USER_ID);
    localStorage.removeItem(AuthService.KEY_USER_NOME);
    localStorage.removeItem(AuthService.KEY_USER_EMAIL);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(AuthService.KEY_TOKEN);
  }

  getPerfil(): string | null {
    return localStorage.getItem(AuthService.KEY_PERFIL);
  }

  getUserId(): number | null {
    const v = localStorage.getItem(AuthService.KEY_USER_ID);
    return v ? parseInt(v, 10) : null;
  }

  private persistSession(res: LoginResponse): void {
    localStorage.setItem(AuthService.KEY_TOKEN, res.token);
    localStorage.setItem(AuthService.KEY_PERFIL, res.perfil);
    localStorage.setItem(AuthService.KEY_USER_ID, String(res.id));
    localStorage.setItem(AuthService.KEY_USER_NOME, res.nome);
    localStorage.setItem(AuthService.KEY_USER_EMAIL, res.email);
  }
}
