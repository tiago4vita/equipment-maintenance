package br.ufpr.equipmentmaintenance.api.dto;

import br.ufpr.equipmentmaintenance.api.model.Solicitacao;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record SolicitacaoResponse(
    Long id,
    String equipamentoNome,
    String clienteNome,
    String descricaoProblema,
    String status,
    BigDecimal valorOrcamento,
    LocalDateTime dataCriacao,
    List<HistoricoSolicitacaoResponse> historico
) {
    public static SolicitacaoResponse fromEntity(Solicitacao s) {
        var historico = s.getHistorico().stream()
            .map(HistoricoSolicitacaoResponse::fromEntity)
            .toList();

        return new SolicitacaoResponse(
            s.getId(),
            s.getEquipamento().getNome(),
            s.getCliente().getNome(),
            s.getDescricaoProblema(),
            s.getStatus().name(),
            s.getValorOrcamento(),
            s.getDataCriacao(),
            historico
        );
    }
}