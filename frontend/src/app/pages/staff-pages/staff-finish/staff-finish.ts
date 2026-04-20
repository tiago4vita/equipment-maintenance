import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StaffNavbarComponent } from '../../../components/staff-navbar/staff-navbar';
import {
  STATUS_LABELS,
  SolicitacaoResponse
} from '../../../models/cliente-integracao.model';
import { SolicitacaoService } from '../../../services/solicitacao.service';

@Component({
  selector: 'app-staff-finish',
  standalone: true,
  imports: [CommonModule, StaffNavbarComponent],
  templateUrl: './staff-finish.html'
})
export class StaffFinishComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly solicitacoes = inject(SolicitacaoService);

  protected readonly statusLabels = STATUS_LABELS;
  protected readonly dataAtual = new Date();

  protected readonly solicitacao = signal<SolicitacaoResponse | null>(null);
  protected readonly loading = signal(false);
  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected solicitacaoId = 0;

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

  protected finalizar(): void {
    if (!confirm('Confirmar finalização desta solicitação?')) {
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    this.solicitacoes
      .alterarStatus(this.solicitacaoId, { novoStatus: 'FINALIZADA' })
      .subscribe({
        next: () => {
          this.submitting.set(false);
          alert('Solicitação finalizada com sucesso.');
          void this.router.navigate(['/staff/all-requests']);
        },
        error: (err: HttpErrorResponse) => {
          this.submitting.set(false);
          this.errorMessage.set(
            err.error?.message ?? 'Não foi possível finalizar a solicitação.'
          );
        }
      });
  }

  protected voltar(): void {
    void this.router.navigate(['/staff/all-requests']);
  }
}
