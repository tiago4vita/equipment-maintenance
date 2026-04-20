package br.ufpr.equipmentmaintenance.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * RF004 — Solicitação de Manutenção.
 * Texto livre para {@code descricaoEquipamento} + FK direta para {@code categoriaId};
 * {@code equipamentoId} é opcional (quando o cliente escolhe um equipamento previamente cadastrado).
 */
public record SolicitacaoRequest(
    Long equipamentoId,

    @NotNull(message = "A categoria do equipamento é obrigatória.")
    Long categoriaId,

    @NotBlank(message = "A descrição do equipamento é obrigatória.")
    @Size(max = 200, message = "A descrição do equipamento deve ter no máximo 200 caracteres.")
    String descricaoEquipamento,

    @NotNull(message = "O cliente é obrigatório.")
    Long clienteId,

    @NotBlank(message = "A descrição do problema é obrigatória.")
    @Size(max = 500, message = "A descrição do problema deve ter no máximo 500 caracteres.")
    String descricaoProblema
) {}
