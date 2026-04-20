import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { StaffNavbarComponent } from '../../../components/staff-navbar/staff-navbar';
import { AuthService } from '../../../auth.service';
import {
  STATUS_LABELS,
  SolicitacaoResponse
} from '../../../models/cliente-integracao.model';
import { FuncionarioResponse, FuncionarioService } from '../../../services/funcionario.service';
import { SolicitacaoService } from '../../../services/solicitacao.service';

@Component({
  selector: 'app-staff-redirect',
  standalone: true,
  imports: [CommonModule, FormsModule, StaffNavbarComponent],
  templateUrl: './staff-redirect.html'
})
export class StaffRedirectComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly solicitacoes = inject(SolicitacaoService);
  private readonly funcionariosApi = inject(FuncionarioService);
  private readonly auth = inject(AuthService);

  protected readonly statusLabels = STATUS_LABELS;

  protected readonly solicitacao = signal<SolicitacaoResponse | null>(null);
  protected readonly funcionariosDisponiveis = signal<FuncionarioResponse[]>([]);
  protected readonly loading = signal(false);
  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected solicitacaoId = 0;
  protected funcionarioDestinoId: number | '' = '';
  protected motivo = '';

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
    const userId = this.auth.getUserId();

    forkJoin({
      solicitacao: this.solicitacoes.buscarPorId(this.solicitacaoId),
      funcionarios: this.funcionariosApi.listar()
    }).subscribe({
      next: ({ solicitacao, funcionarios }) => {
        this.solicitacao.set(solicitacao);
        this.funcionariosDisponiveis.set(
          funcionarios.filter((f) => f.id !== userId)
        );
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.errorMessage.set(
          err.error?.message ?? 'Não foi possível carregar os dados.'
        );
      }
    });
  }

  protected redirecionar(): void {
    if (!this.funcionarioDestinoId) {
      this.errorMessage.set('Selecione um funcionário de destino.');
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    this.solicitacoes
      .alterarStatus(this.solicitacaoId, {
        novoStatus: 'REDIRECIONADA',
        funcionarioDestinoId: Number(this.funcionarioDestinoId),
        observacao: this.motivo.trim() || undefined
      })
      .subscribe({
        next: () => {
          this.submitting.set(false);
          alert('Solicitação redirecionada com sucesso.');
          void this.router.navigate(['/staff/all-requests']);
        },
        error: (err: HttpErrorResponse) => {
          this.submitting.set(false);
          this.errorMessage.set(
            err.error?.message ?? 'Não foi possível redirecionar a solicitação.'
          );
        }
      });
  }

  protected voltar(): void {
    void this.router.navigate(['/staff/all-requests']);
  }
}
