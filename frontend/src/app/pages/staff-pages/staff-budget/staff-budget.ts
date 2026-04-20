import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StaffNavbarComponent } from '../../../components/staff-navbar/staff-navbar';
import { SolicitacaoResponse } from '../../../models/cliente-integracao.model';
import { SolicitacaoService } from '../../../services/solicitacao.service';

@Component({
  selector: 'app-staff-budget',
  standalone: true,
  imports: [CommonModule, FormsModule, StaffNavbarComponent],
  templateUrl: './staff-budget.html'
})
export class StaffBudgetComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly solicitacoes = inject(SolicitacaoService);

  protected solicitacaoId = 0;
  protected valorOrcamento: number | null = null;
  protected readonly solicitacao = signal<SolicitacaoResponse | null>(null);
  protected readonly loading = signal(false);
  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly successMessage = signal<string | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.solicitacaoId = Number(idParam);

    if (!Number.isFinite(this.solicitacaoId) || this.solicitacaoId <= 0) {
      this.errorMessage.set('Solicitação inválida.');
      return;
    }

    this.loading.set(true);
    this.solicitacoes.buscarPorId(this.solicitacaoId).subscribe({
      next: (res) => {
        this.solicitacao.set(res);
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

  protected voltar(): void {
    void this.router.navigate(['/staff/home']);
  }

  protected salvarOrcamento(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);

    if (this.valorOrcamento == null || this.valorOrcamento <= 0) {
      this.errorMessage.set('Informe um valor de orçamento válido.');
      return;
    }

    this.submitting.set(true);
    this.solicitacoes
      .alterarStatus(this.solicitacaoId, {
        novoStatus: 'ORCADA',
        valorOrcamento: this.valorOrcamento
      })
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.successMessage.set(
            `Orçamento registrado com sucesso (R$ ${this.valorOrcamento!.toFixed(2).replace('.', ',')}).`
          );
          setTimeout(() => this.voltar(), 1500);
        },
        error: (err: HttpErrorResponse) => {
          this.submitting.set(false);
          this.errorMessage.set(
            err.error?.message ?? 'Não foi possível registrar o orçamento.'
          );
        }
      });
  }
}
