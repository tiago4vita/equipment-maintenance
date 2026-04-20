import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface ClienteRequest {
  cpf: string;
  nome: string;
  email: string;
  telefone?: string;
  cep?: string;
  rua?: string;
  numero?: string;
  cidade?: string;
  estado?: string;
}

export interface ClienteResponse {
  id: number;
  cpf: string;
  nome: string;
  email: string;
  telefone: string | null;
  cep: string | null;
  rua: string | null;
  numero: string | null;
  cidade: string | null;
  estado: string | null;
  ativo: boolean;
}

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/clientes';

  /** RF001 — Autocadastro. Endpoint público no SecurityConfig. */
  criar(request: ClienteRequest): Observable<ClienteResponse> {
    return this.http.post<ClienteResponse>(this.baseUrl, request);
  }

  listar(): Observable<ClienteResponse[]> {
    return this.http.get<ClienteResponse[]>(this.baseUrl);
  }

  buscarPorId(id: number): Observable<ClienteResponse> {
    return this.http.get<ClienteResponse>(`${this.baseUrl}/${id}`);
  }
}
