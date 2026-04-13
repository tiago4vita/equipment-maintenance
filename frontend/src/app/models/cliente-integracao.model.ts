export type StatusManutencao = 
  | 'ABERTA' 
  | 'APROVADA' 
  | 'ORCADA' 
  | 'PAGA' 
  | 'ARRUMADA' 
  | 'FINALIZADA' 
  | 'REJEITADA';

export interface NovaSolicitacaoRequest {
  clienteId: number;
  equipamentoId: number;
  descricaoProblema: string;
}

export interface EquipamentoClienteDTO {
  id: number;
  nome: string;
  categoriaNome: string;
}

/** Alinhado a HistoricoSolicitacaoResponse da API (RF008). */
export interface HistoricoSolicitacaoDTO {
  id: number;
  statusAnterior: string;
  statusNovo: string;
  funcionarioResponsavel: string | null;
  funcionarioDestino: string | null;
  observacao: string | null;
  dataAlteracao: string;
  clienteId: number | null;
  clienteNome: string | null;
}

export function formatHistoricoAutor(h: Pick<HistoricoSolicitacaoDTO, 'clienteNome' | 'funcionarioResponsavel' | 'funcionarioDestino'>): string {
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

export interface SolicitacaoClienteResponse {
  id: number;
  status: StatusManutencao;
  descricaoProblema: string;
  equipamento: EquipamentoClienteDTO;
  dataCriacao: string;
  valorOrcamento?: number;
  justificativaRejeicao?: string;
  /** Quando a API incluir histórico completo (RF008). */
  historico?: HistoricoSolicitacaoDTO[];
}