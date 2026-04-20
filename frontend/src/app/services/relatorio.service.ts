import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface ReceitaDiaria {
  data: string;
  valorTotal: number;
}

export interface ReceitaCategoria {
  categoria: string;
  valorTotal: number;
}

export interface FiltroReceitasPeriodo {
  dataInicio?: string;
  dataFim?: string;
}

@Injectable({ providedIn: 'root' })
export class RelatorioService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/relatorios';

  /** RF019 — PDF do relatório de receitas por período. */
  baixarReceitasPeriodo(filtro: FiltroReceitasPeriodo = {}): Observable<Blob> {
    const params = this.construirParams(filtro);
    return this.http.get(`${this.baseUrl}/receitas-periodo`, {
      params,
      responseType: 'blob'
    });
  }

  /** RF020 — PDF do relatório de receitas por categoria. */
  baixarReceitasCategoria(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/receitas-categoria`, {
      responseType: 'blob'
    });
  }

  dadosReceitasPeriodo(filtro: FiltroReceitasPeriodo = {}): Observable<ReceitaDiaria[]> {
    const params = this.construirParams(filtro);
    return this.http.get<ReceitaDiaria[]>(`${this.baseUrl}/receitas-periodo/dados`, { params });
  }

  dadosReceitasCategoria(): Observable<ReceitaCategoria[]> {
    return this.http.get<ReceitaCategoria[]>(`${this.baseUrl}/receitas-categoria/dados`);
  }

  private construirParams(filtro: FiltroReceitasPeriodo): HttpParams {
    let params = new HttpParams();
    if (filtro.dataInicio) {
      params = params.set('dataInicio', filtro.dataInicio);
    }
    if (filtro.dataFim) {
      params = params.set('dataFim', filtro.dataFim);
    }
    return params;
  }
}
