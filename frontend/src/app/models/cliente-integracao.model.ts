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

export interface SolicitacaoClienteResponse {
  id: number;
  status: StatusManutencao;
  descricaoProblema: string;
  equipamento: EquipamentoClienteDTO;
  dataCriacao: string;
  valorOrcamento?: number;
  justificativaRejeicao?: string;
}