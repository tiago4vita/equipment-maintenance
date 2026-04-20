package br.ufpr.equipmentmaintenance.api.dto;

import br.ufpr.equipmentmaintenance.api.model.Solicitacao;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record SolicitacaoResponse(
    Long id,
    Long clienteId,
    String clienteNome,
    Long equipamentoId,
    String equipamentoNome,
    Long categoriaId,
    String categoriaNome,
    String descricaoEquipamento,
    String descricaoProblema,
    String status,
    BigDecimal valorOrcamento,
    LocalDateTime dataCriacao,
    String descricaoManutencao,
    String orientacoesCliente,
    LocalDateTime dataHoraPagamento,
    LocalDateTime dataHoraFinalizacao,
    Long funcionarioDestinoAtualId,
    String funcionarioDestinoAtualNome,
    List<HistoricoSolicitacaoResponse> historico
) {
    public static SolicitacaoResponse fromEntity(Solicitacao s) {
        var historico = s.getHistorico().stream()
            .map(HistoricoSolicitacaoResponse::fromEntity)
            .toList();

        Long equipamentoId = s.getEquipamento() != null ? s.getEquipamento().getId() : null;
        String equipamentoNome = s.getEquipamento() != null ? s.getEquipamento().getNome() : null;

        Long categoriaId = s.getCategoria() != null ? s.getCategoria().getId() : null;
        String categoriaNome = s.getCategoria() != null ? s.getCategoria().getNome() : null;

        Long destinoId = s.getFuncionarioDestinoAtual() != null
            ? s.getFuncionarioDestinoAtual().getId()
            : null;
        String destinoNome = s.getFuncionarioDestinoAtual() != null
            ? s.getFuncionarioDestinoAtual().getNome()
            : null;

        return new SolicitacaoResponse(
            s.getId(),
            s.getCliente().getId(),
            s.getCliente().getNome(),
            equipamentoId,
            equipamentoNome,
            categoriaId,
            categoriaNome,
            s.getDescricaoEquipamento(),
            s.getDescricaoProblema(),
            s.getStatus().name(),
            s.getValorOrcamento(),
            s.getDataCriacao(),
            s.getDescricaoManutencao(),
            s.getOrientacoesCliente(),
            s.getDataHoraPagamento(),
            s.getDataHoraFinalizacao(),
            destinoId,
            destinoNome,
            historico
        );
    }
}
