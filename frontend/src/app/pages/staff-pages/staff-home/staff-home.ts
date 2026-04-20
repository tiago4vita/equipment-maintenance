import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { StaffNavbarComponent } from '../../../components/staff-navbar/staff-navbar';
import { compareBrDateTime } from '../../../date-util';
import { SolicitacaoResponse } from '../../../models/cliente-integracao.model';
import { SolicitacaoService } from '../../../services/solicitacao.service';

@Component({
  selector: 'app-staff-home',
  standalone: true,
  imports: [CommonModule, StaffNavbarComponent],
  templateUrl: './staff-home.html',
  styleUrl: './staff-home.css'
})
export class StaffHomeComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly solicitacoes = inject(SolicitacaoService);

  protected readonly items = signal<SolicitacaoResponse[]>([]);
  protected readonly loading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.carregar();
  }

  protected carregar(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    // RF011 — status omitido faz o backend filtrar apenas ABERTA.
    this.solicitacoes.listarStaff({ periodo: 'todas' }).subscribe({
      next: (lista) => {
        const ordenadas = [...lista].sort(
          (a, b) => compareBrDateTime(a.dataCriacao, b.dataCriacao)
        );
        this.items.set(ordenadas);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(
          err.error?.message ?? 'Não foi possível carregar as solicitações abertas.'
        );
        this.loading.set(false);
      }
    });
  }

  protected descricaoTruncada(s: SolicitacaoResponse): string {
    const texto = s.descricaoEquipamento ?? '';
    return texto.length > 30 ? `${texto.slice(0, 30)}...` : texto;
  }

  protected irParaOrcamento(id: number): void {
    void this.router.navigate(['/staff/budget', id]);
  }
}
