import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../auth.service';
import { ClienteNavbarComponent } from '../../../components/cliente-navbar/cliente-navbar';
import { SolicitationFieldsHeaderComponent } from '../../../components/solicitation-fields-header/solicitation-fields-header';
import { compareBrDateTime, formatBrDateTime } from '../../../date-util';
import { truncarTexto } from '../../../text-util';
import {
  SolicitationRowComponent,
  type SolicitationRowActionType,
  type SolicitationStatus
} from '../../../components/solicitation-row/solicitation-row';
import {
  type CreateSolicitationPayload,
  type ModalCategoriaOption,
  type SolicitationTimelineItem,
  SolicitationVisualizationModalComponent,
  type SolicitationModalMode
} from '../../../components/solicitation-visualization-modal/solicitation-visualization-modal';
import {
  formatHistoricoAutor,
  type AlterarStatusRequest,
  type HistoricoSolicitacaoDTO,
  type SolicitacaoResponse,
  type StatusManutencao
} from '../../../models/cliente-integracao.model';
import { CategoriaService, type CategoriaResponse } from '../../../services/categoria.service';
import { SolicitacaoService } from '../../../services/solicitacao.service';
import { getUiStatusTheme } from '../../../solicitation-status-theme';

interface SolicitationItem {
  id: number;
  device: string;
  category: string;
  description: string;
  dateTime: string;
  status: SolicitationStatus;
  quotedPrice: string;
  history: SolicitationTimelineItem[];
  apiStatus: StatusManutencao;
}

@Component({
  selector: 'app-maintenance-page',
  standalone: true,
  imports: [
    CommonModule,
    ClienteNavbarComponent,
    SolicitationFieldsHeaderComponent,
    SolicitationRowComponent,
    SolicitationVisualizationModalComponent
  ],
  templateUrl: './maintenance-page.html'
})
export class MaintenancePageComponent implements OnInit {
  private readonly solicitacoes = inject(SolicitacaoService);
  private readonly categorias = inject(CategoriaService);
  private readonly auth = inject(AuthService);

  protected readonly solicitations = signal<SolicitationItem[]>([]);
  protected readonly categoriasOptions = signal<ModalCategoriaOption[]>([]);
  protected readonly loading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected isVisualizationModalOpen = false;
  protected currentModalMode: SolicitationModalMode = 'aberta';
  protected selectedSolicitation: SolicitationItem | null = null;
  protected startWithRejectFlow = false;

  ngOnInit(): void {
    const userId = this.auth.getUserId();
    if (userId == null) {
      this.errorMessage.set('Sessão expirada. Faça login novamente.');
      return;
    }

    this.loading.set(true);
    forkJoin({
      categorias: this.categorias.listar(),
      solicitacoes: this.solicitacoes.listarDoCliente(userId)
    }).subscribe({
      next: ({ categorias, solicitacoes }) => {
        this.categoriasOptions.set(
          categorias.map((c: CategoriaResponse) => ({ id: c.id, nome: c.nome }))
        );
        this.solicitations.set(solicitacoes.map((s) => this.mapResponseToItem(s)));
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.errorMessage.set(
          err.error?.message ?? 'Não foi possível carregar suas solicitações.'
        );
      }
    });
  }

  protected openModalFor(solicitation: SolicitationItem): void {
    this.selectedSolicitation = solicitation;
    this.currentModalMode = this.mapStatusToMode(solicitation.status);
    this.startWithRejectFlow = false;
    this.isVisualizationModalOpen = true;
  }

  protected openCreationModal(): void {
    this.selectedSolicitation = null;
    this.currentModalMode = 'creation';
    this.startWithRejectFlow = false;
    this.categorias.listar().subscribe({
      next: (lista) => {
        this.categoriasOptions.set(lista.map((c: CategoriaResponse) => ({ id: c.id, nome: c.nome })));
        this.isVisualizationModalOpen = true;
      },
      error: () => {
        this.isVisualizationModalOpen = true;
      }
    });
  }

  protected closeVisualizationModal(): void {
    this.isVisualizationModalOpen = false;
    this.selectedSolicitation = null;
    this.startWithRejectFlow = false;
  }

  protected get sortedSolicitations(): SolicitationItem[] {
    return [...this.solicitations()].sort((a, b) =>
      compareBrDateTime(a.dateTime, b.dateTime)
    );
  }

  protected descricaoTruncada(texto: string): string {
    return truncarTexto(texto);
  }

  protected handleRowAction(
    solicitation: SolicitationItem,
    event: { status: SolicitationStatus; type: SolicitationRowActionType }
  ): void {
    // RF003 + RF005: ambos botões (Aprovar/Rejeitar) da linha devem abrir a tela
    // de Mostrar Orçamento (RF005), sem pular etapas do fluxo.
    if (solicitation.status === 'orcada' && (event.type === 'approve' || event.type === 'reject')) {
      this.selectedSolicitation = solicitation;
      this.currentModalMode = 'orcada';
      this.startWithRejectFlow = false;
      this.isVisualizationModalOpen = true;
      return;
    }

    this.openModalFor(solicitation);
  }

  protected handleStatusChange(event: { nextStatus: SolicitationStatus; reason?: string }): void {
    if (!this.selectedSolicitation) {
      return;
    }

    const s = this.selectedSolicitation;

    if (event.nextStatus === 'aprovada') {
      this.alterarStatus(s, 'APROVADA', 'aprovada');
      return;
    }
    if (event.nextStatus === 'rejeitada') {
      this.alterarStatus(s, 'REJEITADA', 'rejeitada', { observacao: event.reason });
      return;
    }
    if (event.nextStatus === 'resgatada') {
      // RF009 — resgate: volta para APROVADA. UI exibe como "Aprovada".
      this.alterarStatus(s, 'APROVADA', 'aprovada', { observacao: 'Resgate do serviço' });
      return;
    }
    if (event.nextStatus === 'paga') {
      this.alterarStatus(s, 'PAGA', 'paga');
      return;
    }
  }

  protected handleCreation(payload: CreateSolicitationPayload): void {
    const clienteId = this.auth.getUserId();
    if (clienteId == null) {
      this.errorMessage.set('Sessão expirada. Faça login novamente.');
      return;
    }

    this.errorMessage.set(null);
    this.solicitacoes
      .criar({
        clienteId,
        categoriaId: payload.categoriaId,
        descricaoEquipamento: payload.descricaoEquipamento,
        descricaoProblema: payload.descricaoProblema
      })
      .subscribe({
        next: (res) => {
          this.solicitations.update((list) => [...list, this.mapResponseToItem(res)]);
          this.closeVisualizationModal();
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage.set(
            err.error?.message ?? 'Não foi possível criar a solicitação.'
          );
        }
      });
  }

  private alterarStatus(
    solicitation: SolicitationItem,
    novoStatus: StatusManutencao,
    uiStatus: SolicitationStatus,
    extra: Partial<AlterarStatusRequest> = {}
  ): void {
    this.errorMessage.set(null);
    this.solicitacoes
      .alterarStatus(solicitation.id, { novoStatus, ...extra })
      .subscribe({
        next: (res) => {
          const atualizado = this.mapResponseToItem(res);
          this.solicitations.update((list) =>
            list.map((it) => (it.id === atualizado.id ? atualizado : it))
          );
          this.selectedSolicitation = atualizado;
          this.currentModalMode = this.mapStatusToMode(uiStatus);
          this.startWithRejectFlow = false;
          if (novoStatus === 'APROVADA' || novoStatus === 'REJEITADA' || novoStatus === 'PAGA') {
            this.isVisualizationModalOpen = true;
          }
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage.set(
            err.error?.message ?? 'Não foi possível atualizar a solicitação.'
          );
        }
      });
  }

  private mapStatusToMode(status: SolicitationStatus): SolicitationModalMode {
    return status;
  }

  private mapResponseToItem(s: SolicitacaoResponse): SolicitationItem {
    const uiStatus = this.mapApiStatus(s.status);
    return {
      id: s.id,
      device: s.descricaoEquipamento || s.equipamentoNome || '(sem descrição)',
      category: s.categoriaNome ?? '—',
      description: s.descricaoProblema,
      dateTime: formatBrDateTime(s.dataCriacao),
      status: uiStatus,
      apiStatus: s.status,
      quotedPrice: this.formatPrice(s.valorOrcamento),
      history: s.historico.map((h) => this.mapHistoricoToTimeline(h))
    };
  }

  private mapApiStatus(status: StatusManutencao): SolicitationStatus {
    switch (status) {
      case 'ABERTA':
        return 'aberta';
      case 'ORCADA':
        return 'orcada';
      case 'APROVADA':
        return 'aprovada';
      case 'REJEITADA':
        return 'rejeitada';
      case 'REDIRECIONADA':
        return 'redirecionada';
      case 'ARRUMADA':
        return 'arrumada';
      case 'PAGA':
        return 'paga';
      case 'FINALIZADA':
        return 'finalizada';
    }
  }

  private mapHistoricoToTimeline(h: HistoricoSolicitacaoDTO): SolicitationTimelineItem {
    const uiStatus = this.mapApiStatus(h.statusNovo);
    const date = formatBrDateTime(h.dataAlteracao);
    const author = formatHistoricoAutor(h);
    return this.timelineItemFor(uiStatus, date, author);
  }

  private timelineItemFor(
    status: SolicitationStatus,
    date: string,
    author: string
  ): SolicitationTimelineItem {
    const theme = getUiStatusTheme(status);
    const labels: Record<SolicitationStatus, string> = {
      aberta: 'Aberta',
      orcada: 'Orçada',
      aprovada: 'Aprovada',
      rejeitada: 'Rejeitada',
      arrumada: 'Arrumada',
      paga: 'Paga',
      finalizada: 'Finalizada',
      redirecionada: 'Redirecionada',
      resgatada: 'Resgatada'
    };

    return {
      iconPath: '/svg/Clock.svg',
      date,
      author,
      label: labels[status],
      bg: theme.bg,
      textColor: theme.text,
      subTextColor: theme.subText
    };
  }

  private formatPrice(valor: number | null): string {
    if (valor == null) return '—';
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    });
  }
}
