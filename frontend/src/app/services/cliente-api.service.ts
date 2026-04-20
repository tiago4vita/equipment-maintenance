import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import {
  AlterarStatusRequest,
  NovaSolicitacaoRequest,
  SolicitacaoResponse
} from '../models/cliente-integracao.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteApiService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = '/api/solicitacoes';

  public listarHistoricoDoCliente(idCliente: number): Observable<SolicitacaoResponse[]> {
    const url = `${this.API_URL}/cliente/${idCliente}`;
    return this.http.get<SolicitacaoResponse[]>(url).pipe(
      retry(2),
      catchError((err) => this.tratarErroServidor(err))
    );
  }

  public abrirNovaSolicitacao(dados: NovaSolicitacaoRequest): Observable<SolicitacaoResponse> {
    return this.http.post<SolicitacaoResponse>(this.API_URL, dados).pipe(
      catchError((err) => this.tratarErroServidor(err))
    );
  }

  public aprovarOrcamento(solicitacaoId: number): Observable<SolicitacaoResponse> {
    const body: AlterarStatusRequest = { novoStatus: 'APROVADA' };
    return this.http
      .patch<SolicitacaoResponse>(`${this.API_URL}/${solicitacaoId}/status`, body)
      .pipe(catchError((err) => this.tratarErroServidor(err)));
  }

  public rejeitarOrcamento(
    solicitacaoId: number,
    justificativa: string
  ): Observable<SolicitacaoResponse> {
    const body: AlterarStatusRequest = {
      novoStatus: 'REJEITADA',
      observacao: justificativa
    };
    return this.http
      .patch<SolicitacaoResponse>(`${this.API_URL}/${solicitacaoId}/status`, body)
      .pipe(catchError((err) => this.tratarErroServidor(err)));
  }

  private tratarErroServidor(erro: unknown): Observable<never> {
    console.error('[ClienteApiService] Erro de comunicação com o Backend:', erro);

    let mensagemAmigavel = 'Ocorreu um erro inesperado.';
    if (erro instanceof HttpErrorResponse) {
      if (erro.status === 0) {
        mensagemAmigavel = 'Servidor offline. Verifique se o backend está rodando.';
      } else if (erro.status === 400) {
        mensagemAmigavel = 'Dados inválidos enviados na requisição.';
      }
    }

    return throwError(() => new Error(mensagemAmigavel));
  }
}
