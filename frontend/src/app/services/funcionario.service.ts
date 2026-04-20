import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface FuncionarioResponse {
  id: number;
  email: string;
  nome: string;
  dataNascimento: string;
}

export interface FuncionarioRequest {
  email: string;
  nome: string;
  dataNascimento: string;
  senha?: string;
}

@Injectable({ providedIn: 'root' })
export class FuncionarioService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/funcionarios';

  listar(): Observable<FuncionarioResponse[]> {
    return this.http.get<FuncionarioResponse[]>(this.baseUrl);
  }

  buscarPorId(id: number): Observable<FuncionarioResponse> {
    return this.http.get<FuncionarioResponse>(`${this.baseUrl}/${id}`);
  }

  criar(request: FuncionarioRequest): Observable<FuncionarioResponse> {
    return this.http.post<FuncionarioResponse>(this.baseUrl, request);
  }

  atualizar(id: number, request: FuncionarioRequest): Observable<FuncionarioResponse> {
    return this.http.put<FuncionarioResponse>(`${this.baseUrl}/${id}`, request);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
