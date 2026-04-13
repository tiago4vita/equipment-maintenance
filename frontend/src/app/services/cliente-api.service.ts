import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError, retry } from 'rxjs';
import { 
  NovaSolicitacaoRequest, 
  SolicitacaoClienteResponse 
} from '../models/cliente-integracao.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteApiService {

  private readonly API_URL = '/api/solicitacoes';

  constructor(private http: HttpClient) { }

  public listarHistoricoDoCliente(idCliente: number): Observable<SolicitacaoClienteResponse[]> {
    const url = `${this.API_URL}/cliente/${idCliente}`;
    return this.http.get<SolicitacaoClienteResponse[]>(url).pipe(
      retry(2),
      catchError(this.tratarErroServidor)
    );
  }

  public abrirNovaSolicitacao(dados: NovaSolicitacaoRequest): Observable<SolicitacaoClienteResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<SolicitacaoClienteResponse>(this.API_URL, dados, { headers }).pipe(
      catchError(this.tratarErroServidor)
    );
  }


  public aprovarOrcamento(solicitacaoId: number): Observable<SolicitacaoClienteResponse> {
    const url = `${this.API_URL}/${solicitacaoId}/status`;
    const body = { novoStatus: 'APROVADA' };
    
    return this.http.put<SolicitacaoClienteResponse>(url, body).pipe(
      catchError(this.tratarErroServidor)
    );
  }


  public rejeitarOrcamento(solicitacaoId: number, justificativa: string): Observable<SolicitacaoClienteResponse> {
    const url = `${this.API_URL}/${solicitacaoId}/status`;
    const body = { 
      novoStatus: 'REJEITADA',
      justificativa: justificativa 
    };
    
    return this.http.put<SolicitacaoClienteResponse>(url, body).pipe(
      catchError(this.tratarErroServidor)
    );
  }


  private tratarErroServidor(erro: any) {
    console.error('[ClienteApiService] Erro de comunicação com o Backend:', erro);
    
    let mensagemAmigavel = 'Ocorreu um erro inesperado.';
    if (erro.status === 0) {
      mensagemAmigavel = 'Servidor offline. Verifique se o backend está rodando.';
    } else if (erro.status === 400) {
      mensagemAmigavel = 'Dados inválidos enviados na requisição.';
    }

    return throwError(() => new Error(mensagemAmigavel));
  }
}