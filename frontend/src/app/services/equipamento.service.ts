import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface EquipamentoResponse {
  id: number;
  nome: string;
  marca: string | null;
  modelo: string | null;
  numeroSerie: string | null;
  clienteNome: string | null;
  categoriaNome: string | null;
}

@Injectable({ providedIn: 'root' })
export class EquipamentoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/equipamentos';

  listarPorCliente(clienteId: number): Observable<EquipamentoResponse[]> {
    return this.http.get<EquipamentoResponse[]>(`${this.baseUrl}/cliente/${clienteId}`);
  }
}
