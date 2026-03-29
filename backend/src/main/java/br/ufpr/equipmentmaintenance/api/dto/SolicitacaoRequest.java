package br.ufpr.equipmentmaintenance.api.dto;
 
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
 
public record SolicitacaoRequest(
    @NotNull(message = "O equipamento é obrigatório.")
    Long equipamentoId,
 
    @NotNull(message = "O cliente é obrigatório.")
    Long clienteId,
 
    @NotBlank(message = "A descrição do problema é obrigatória.")
    String descricaoProblema
) {}
 