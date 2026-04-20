import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AlterarStatusRequest,
  NovaSolicitacaoRequest,
  SolicitacaoResponse,
  StatusManutencao
} from '../models/cliente-integracao.model';

export type PeriodoFiltro = 'todas' | 'hoje' | 'intervalo';

export interface ListagemStaffParams {
  status?: StatusManutencao | 'todos';
  periodo?: PeriodoFiltro;
  dataInicio?: string;
  dataFim?: string;
}

@Injectable({ providedIn: 'root' })
export class SolicitacaoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/solicitacoes';

  listarDoCliente(clienteId: number): Observable<SolicitacaoResponse[]> {
    return this.http.get<SolicitacaoResponse[]>(`${this.baseUrl}/cliente/${clienteId}`);
  }

  /**
   * RF011 (status omitido ⇒ ABERTA) / RF013 (status=todos).
   */
  listarStaff(params: ListagemStaffParams = {}): Observable<SolicitacaoResponse[]> {
    let httpParams = new HttpParams().set('periodo', params.periodo ?? 'todas');
    if (params.status) {
      httpParams = httpParams.set('status', params.status);
    }
    if (params.dataInicio) {
      httpParams = httpParams.set('dataInicio', params.dataInicio);
    }
    if (params.dataFim) {
      httpParams = httpParams.set('dataFim', params.dataFim);
    }
    return this.http.get<SolicitacaoResponse[]>(this.baseUrl, { params: httpParams });
  }

  buscarPorId(id: number): Observable<SolicitacaoResponse> {
    return this.http.get<SolicitacaoResponse>(`${this.baseUrl}/${id}`);
  }

  criar(request: NovaSolicitacaoRequest): Observable<SolicitacaoResponse> {
    return this.http.post<SolicitacaoResponse>(this.baseUrl, request);
  }

  alterarStatus(id: number, request: AlterarStatusRequest): Observable<SolicitacaoResponse> {
    return this.http.patch<SolicitacaoResponse>(`${this.baseUrl}/${id}/status`, request);
  }
}
