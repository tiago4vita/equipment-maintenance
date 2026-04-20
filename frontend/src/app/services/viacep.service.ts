import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface EnderecoViaCep {
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;
}

interface ViaCepResponse {
  cep?: string;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ViaCepService {
  private readonly http = inject(HttpClient);

  /**
   * Consulta CEP no ViaCEP. Retorna {@code null} quando o CEP é inválido ou a API falha.
   * O endereço nunca sobrescreve rua/numero que o usuário tenha digitado manualmente.
   */
  consultar(cep: string): Observable<EnderecoViaCep | null> {
    const normalizado = (cep ?? '').replace(/\D/g, '');
    if (normalizado.length !== 8) {
      return of(null);
    }

    return this.http.get<ViaCepResponse>(`https://viacep.com.br/ws/${normalizado}/json/`).pipe(
      map((res) => {
        if (!res || res.erro) {
          return null;
        }
        return {
          cep: res.cep ?? normalizado,
          logradouro: (res.logradouro ?? '').trim(),
          bairro: (res.bairro ?? '').trim(),
          cidade: (res.localidade ?? '').trim(),
          estado: (res.uf ?? '').trim()
        };
      }),
      catchError(() => of(null))
    );
  }
}
