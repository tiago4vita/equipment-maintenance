import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StaffNavbarComponent } from '../../../components/staff-navbar/staff-navbar';
import { compareBrDateTime } from '../../../date-util';
import {
  SolicitacaoResponse,
  STATUS_BG_CLASSES,
  STATUS_LABELS,
  StatusManutencao
} from '../../../models/cliente-integracao.model';
import { SolicitacaoService } from '../../../services/solicitacao.service';

type FiltroPeriodo = 'TODAS' | 'HOJE' | 'PERIODO';

@Component({
  selector: 'app-staff-all-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, StaffNavbarComponent],
  templateUrl: './staff-all-requests.html'
})
export class StaffAllRequestsComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly solicitacoes = inject(SolicitacaoService);

  protected filtroAtual: FiltroPeriodo = 'TODAS';
  protected dataInicio = '';
  protected dataFim = '';

  protected readonly items = signal<SolicitacaoResponse[]>([]);
  protected readonly loading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.carregar();
  }

  protected carregar(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    const periodo = this.mapPeriodo(this.filtroAtual);
    this.solicitacoes
      .listarStaff({
        status: 'todos',
        periodo,
        dataInicio: periodo === 'intervalo' ? this.dataInicio || undefined : undefined,
        dataFim: periodo === 'intervalo' ? this.dataFim || undefined : undefined
      })
      .subscribe({
        next: (lista) => {
          const ordenadas = [...lista].sort(
            (a, b) => compareBrDateTime(a.dataCriacao, b.dataCriacao)
          );
          this.items.set(ordenadas);
          this.loading.set(false);
        },
        error: (err: HttpErrorResponse) => {
          this.loading.set(false);
          this.errorMessage.set(
            err.error?.message ?? 'Não foi possível carregar as solicitações.'
          );
        }
      });
  }

  protected aplicarFiltro(): void {
    this.carregar();
  }

  protected bgClassPara(status: StatusManutencao): string {
    return STATUS_BG_CLASSES[status] ?? 'bg-gray-400';
  }

  protected rotulo(status: StatusManutencao): string {
    return STATUS_LABELS[status] ?? status;
  }

  protected descricaoCurta(s: SolicitacaoResponse): string {
    const texto = s.descricaoEquipamento ?? '';
    return texto.length > 30 ? `${texto.slice(0, 30)}...` : texto;
  }

  protected irParaOrcamento(id: number): void {
    void this.router.navigate(['/staff/budget', id]);
  }

  protected irParaManutencao(id: number): void {
    void this.router.navigate(['/staff/maintenance', id]);
  }

  protected finalizarSolicitacao(id: number): void {
    void this.router.navigate(['/staff/finish', id]);
  }

  private mapPeriodo(filtro: FiltroPeriodo): 'todas' | 'hoje' | 'intervalo' {
    if (filtro === 'HOJE') return 'hoje';
    if (filtro === 'PERIODO') return 'intervalo';
    return 'todas';
  }
}
