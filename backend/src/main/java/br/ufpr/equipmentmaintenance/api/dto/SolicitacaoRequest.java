package br.ufpr.equipmentmaintenance.api.dto;
 
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record SolicitacaoRequest(
    @NotNull(message = "O equipamento é obrigatório.")
    Long equipamentoId,

    @NotNull(message = "O cliente é obrigatório.")
    Long clienteId,

    @NotBlank(message = "A descrição do problema é obrigatória.")
    @Size(max = 500, message = "A descrição do problema deve ter no máximo 500 caracteres.")
    String descricaoProblema
) {}
 