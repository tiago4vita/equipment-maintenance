package br.ufpr.equipmentmaintenance.api.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AlterarStatusRequest(
    @NotBlank(message = "O novo status é obrigatório.")
    @Size(max = 32)
    String novoStatus,

    /** Obrigatório quando novoStatus = REDIRECIONADA (RF015): funcionário que receberá a solicitação */
    Long funcionarioDestinoId,

    @Size(max = 500, message = "A observação deve ter no máximo 500 caracteres.")
    String observacao,

    @DecimalMin(value = "0.01", message = "O valor do orçamento deve ser maior que zero.")
    @Digits(integer = 8, fraction = 2, message = "Valor do orçamento inválido (máx. 8 inteiros e 2 decimais).")
    java.math.BigDecimal valorOrcamento,

    // RF014 — Efetuar Manutenção: obrigatórios quando novoStatus = ARRUMADA
    @Size(max = 1000, message = "A descrição da manutenção deve ter no máximo 1000 caracteres.")
    String descricaoManutencao,

    @Size(max = 1000, message = "As orientações ao cliente devem ter no máximo 1000 caracteres.")
    String orientacoesCliente
) {}