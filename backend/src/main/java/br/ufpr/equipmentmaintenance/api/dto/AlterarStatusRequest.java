package br.ufpr.equipmentmaintenance.api.dto;

import jakarta.validation.constraints.NotBlank;

public record AlterarStatusRequest(
    @NotBlank(message = "O novo status é obrigatório.")
    String novoStatus,

    Long funcionarioId,

    String observacao,

    java.math.BigDecimal valorOrcamento,

    // RF014 — Efetuar Manutenção: obrigatórios quando novoStatus = ARRUMADA
    String descricaoManutencao,

    String orientacoesCliente
) {}