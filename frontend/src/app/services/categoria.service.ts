import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface CategoriaResponse {
  id: number;
  nome: string;
  descricao?: string | null;
}

export interface CategoriaRequest {
  nome: string;
  descricao?: string | null;
}

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/categorias';

  listar(): Observable<CategoriaResponse[]> {
    return this.http.get<CategoriaResponse[]>(this.baseUrl);
  }

  buscarPorId(id: number): Observable<CategoriaResponse> {
    return this.http.get<CategoriaResponse>(`${this.baseUrl}/${id}`);
  }

  criar(request: CategoriaRequest): Observable<CategoriaResponse> {
    return this.http.post<CategoriaResponse>(this.baseUrl, request);
  }

  atualizar(id: number, request: CategoriaRequest): Observable<CategoriaResponse> {
    return this.http.put<CategoriaResponse>(`${this.baseUrl}/${id}`, request);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
