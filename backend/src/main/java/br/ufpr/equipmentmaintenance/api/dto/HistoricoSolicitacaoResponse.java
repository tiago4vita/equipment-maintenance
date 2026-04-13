package br.ufpr.equipmentmaintenance.api.dto;

import br.ufpr.equipmentmaintenance.api.model.HistoricoSolicitacao;

import java.time.LocalDateTime;

public record HistoricoSolicitacaoResponse(
    Long id,
    String statusAnterior,
    String statusNovo,
    String funcionarioResponsavel,
    String funcionarioDestino,
    String observacao,
    LocalDateTime dataAlteracao,
    Long clienteId,
    String clienteNome
) {
    public static HistoricoSolicitacaoResponse fromEntity(HistoricoSolicitacao h) {
        String funcionario = h.getFuncionarioResponsavel() != null
            ? h.getFuncionarioResponsavel().getNome()
            : null;
        String destino = h.getFuncionarioDestino() != null
            ? h.getFuncionarioDestino().getNome()
            : null;
        Long cid = h.getCliente() != null ? h.getCliente().getId() : null;
        String cnome = h.getCliente() != null ? h.getCliente().getNome() : null;

        return new HistoricoSolicitacaoResponse(
            h.getId(),
            h.getStatusAnterior().name(),
            h.getStatusNovo().name(),
            funcionario,
            destino,
            h.getObservacao(),
            h.getDataAlteracao(),
            cid,
            cnome
        );
    }
}