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
    // Preenchidos pelo funcionário ao efetuar manutenção (RF014)
    String descricaoManutencao,
    String orientacoesCliente,
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
            s.getDescricaoManutencao(),
            s.getOrientacoesCliente(),
            historico
        );
    }
}