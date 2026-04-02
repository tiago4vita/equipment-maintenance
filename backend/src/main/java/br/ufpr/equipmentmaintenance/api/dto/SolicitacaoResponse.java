package br.ufpr.equipmentmaintenance.api.dto;

import br.ufpr.equipmentmaintenance.api.model.Solicitacao;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record SolicitacaoResponse(
    Long id,
    Long clienteId,
    Long equipamentoId,
    String equipamentoNome,
    String clienteNome,
    String descricaoProblema,
    String status,
    BigDecimal valorOrcamento,
    LocalDateTime dataCriacao,
    String descricaoManutencao,
    String orientacoesCliente,
    LocalDateTime dataHoraPagamento,
    LocalDateTime dataHoraFinalizacao,
    String funcionarioDestinoAtualNome,
    List<HistoricoSolicitacaoResponse> historico
) {
    public static SolicitacaoResponse fromEntity(Solicitacao s) {
        var historico = s.getHistorico().stream()
            .map(HistoricoSolicitacaoResponse::fromEntity)
            .toList();

        String destinoNome = s.getFuncionarioDestinoAtual() != null
            ? s.getFuncionarioDestinoAtual().getNome()
            : null;

        return new SolicitacaoResponse(
            s.getId(),
            s.getCliente().getId(),
            s.getEquipamento().getId(),
            s.getEquipamento().getNome(),
            s.getCliente().getNome(),
            s.getDescricaoProblema(),
            s.getStatus().name(),
            s.getValorOrcamento(),
            s.getDataCriacao(),
            s.getDescricaoManutencao(),
            s.getOrientacoesCliente(),
            s.getDataHoraPagamento(),
            s.getDataHoraFinalizacao(),
            destinoNome,
            historico
        );
    }
}