import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StaffNavbarComponent } from '../../../components/staff-navbar/staff-navbar';
import {
  STATUS_LABELS,
  SolicitacaoResponse
} from '../../../models/cliente-integracao.model';
import { SolicitacaoService } from '../../../services/solicitacao.service';

@Component({
  selector: 'app-staff-maintenance',
  standalone: true,
  imports: [CommonModule, FormsModule, StaffNavbarComponent],
  templateUrl: './staff-maintenance.html'
})
export class StaffMaintenanceComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly solicitacoes = inject(SolicitacaoService);

  protected readonly statusLabels = STATUS_LABELS;

  protected solicitacaoId = 0;
  protected readonly solicitacao = signal<SolicitacaoResponse | null>(null);
  protected readonly loading = signal(false);
  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected descricaoManutencao = '';
  protected orientacoesCliente = '';

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.solicitacaoId = Number(idParam);

    if (!this.solicitacaoId) {
      this.errorMessage.set('Solicitação inválida.');
      return;
    }

    this.carregar();
  }

  private carregar(): void {
    this.loading.set(true);
    this.solicitacoes.buscarPorId(this.solicitacaoId).subscribe({
      next: (s) => {
        this.solicitacao.set(s);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.errorMessage.set(
          err.error?.message ?? 'Não foi possível carregar a solicitação.'
        );
      }
    });
  }

  protected salvarManutencao(): void {
    if (!this.descricaoManutencao.trim() || !this.orientacoesCliente.trim()) {
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    this.solicitacoes
      .alterarStatus(this.solicitacaoId, {
        novoStatus: 'ARRUMADA',
        descricaoManutencao: this.descricaoManutencao.trim(),
        orientacoesCliente: this.orientacoesCliente.trim()
      })
      .subscribe({
        next: () => {
          this.submitting.set(false);
          alert('Manutenção registrada. Solicitação marcada como ARRUMADA.');
          void this.router.navigate(['/staff/all-requests']);
        },
        error: (err: HttpErrorResponse) => {
          this.submitting.set(false);
          this.errorMessage.set(
            err.error?.message ?? 'Não foi possível registrar a manutenção.'
          );
        }
      });
  }

  protected irParaRedirecionamento(): void {
    void this.router.navigate(['/staff/redirect', this.solicitacaoId]);
  }

  protected voltar(): void {
    void this.router.navigate(['/staff/all-requests']);
  }
}
