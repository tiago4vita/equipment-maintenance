/**
 * Status possíveis de uma solicitação, alinhados ao enum {@code StatusSolicitacao} do backend.
 * Os valores no wire seguem a API (sem cedilha em ORCADA); a UI exibe os rótulos em português.
 */
export type StatusManutencao =
  | 'ABERTA'
  | 'ORCADA'
  | 'APROVADA'
  | 'REJEITADA'
  | 'REDIRECIONADA'
  | 'ARRUMADA'
  | 'PAGA'
  | 'FINALIZADA';

/**
 * Payload enviado para POST /api/solicitacoes (RF004).
 * {@code equipamentoId} é opcional — só usado quando o cliente escolhe um equipamento pré-cadastrado.
 */
export interface NovaSolicitacaoRequest {
  clienteId: number;
  categoriaId: number;
  descricaoEquipamento: string;
  descricaoProblema: string;
  equipamentoId?: number | null;
}

/** Corpo do PATCH /api/solicitacoes/{id}/status — alinhado a {@code AlterarStatusRequest}. */
export interface AlterarStatusRequest {
  novoStatus: StatusManutencao;
  observacao?: string;
  valorOrcamento?: number;
  funcionarioDestinoId?: number;
  descricaoManutencao?: string;
  orientacoesCliente?: string;
}

/** Alinhado a HistoricoSolicitacaoResponse da API (RF008). */
export interface HistoricoSolicitacaoDTO {
  id: number;
  statusAnterior: StatusManutencao;
  statusNovo: StatusManutencao;
  funcionarioResponsavel: string | null;
  funcionarioDestino: string | null;
  observacao: string | null;
  dataAlteracao: string;
  clienteId: number | null;
  clienteNome: string | null;
}

export function formatHistoricoAutor(
  h: Pick<HistoricoSolicitacaoDTO, 'clienteNome' | 'funcionarioResponsavel' | 'funcionarioDestino'>
): string {
  if (h.clienteNome) {
    return `Cliente: ${h.clienteNome}`;
  }
  if (h.funcionarioResponsavel) {
    if (h.funcionarioDestino) {
      return `Funcionário: ${h.funcionarioResponsavel} → ${h.funcionarioDestino}`;
    }
    return `Funcionário: ${h.funcionarioResponsavel}`;
  }
  if (h.funcionarioDestino) {
    return `Destino: ${h.funcionarioDestino}`;
  }
  return '—';
}

/**
 * Resposta plana do backend ({@code SolicitacaoResponse}).
 * Atenção: não há objeto {@code equipamento} aninhado — os campos vêm todos no nível raiz.
 */
export interface SolicitacaoResponse {
  id: number;
  clienteId: number;
  clienteNome: string;
  equipamentoId: number | null;
  equipamentoNome: string | null;
  categoriaId: number | null;
  categoriaNome: string | null;
  descricaoEquipamento: string;
  descricaoProblema: string;
  status: StatusManutencao;
  valorOrcamento: number | null;
  dataCriacao: string;
  descricaoManutencao: string | null;
  orientacoesCliente: string | null;
  dataHoraPagamento: string | null;
  dataHoraFinalizacao: string | null;
  funcionarioDestinoAtualId: number | null;
  funcionarioDestinoAtualNome: string | null;
  historico: HistoricoSolicitacaoDTO[];
}

/** Rótulos de exibição para cada status. UI mostra "Orçada" embora o wire use ORCADA. */
export const STATUS_LABELS: Record<StatusManutencao, string> = {
  ABERTA: 'Aberta',
  ORCADA: 'Orçada',
  APROVADA: 'Aprovada',
  REJEITADA: 'Rejeitada',
  REDIRECIONADA: 'Redirecionada',
  ARRUMADA: 'Arrumada',
  PAGA: 'Paga',
  FINALIZADA: 'Finalizada'
};

/**
 * Classe Tailwind de fundo para cada status — segue solicitation-states.mdc (RF013).
 */
export const STATUS_BG_CLASSES: Record<StatusManutencao, string> = {
  ABERTA: 'bg-gray-400',
  ORCADA: 'bg-yellow-800',
  REJEITADA: 'bg-red-500',
  APROVADA: 'bg-yellow-400',
  REDIRECIONADA: 'bg-purple-500',
  ARRUMADA: 'bg-blue-500',
  PAGA: 'bg-orange-500',
  FINALIZADA: 'bg-green-500'
};
