package br.ufpr.equipmentmaintenance.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public class SolicitacaoRequest {

    @NotBlank(message = "A descrição do problema é obrigatória.")
    private String descricaoProblema;

    @NotNull(message = "O equipamento é obrigatório.")
    private Long equipamentoId;

    private Long funcionarioId;
    private BigDecimal precoOrcamento;
    private LocalDate dataConclusao;

    public String getDescricaoProblema() { return descricaoProblema; }
    public void setDescricaoProblema(String descricaoProblema) { this.descricaoProblema = descricaoProblema; }

    public Long getEquipamentoId() { return equipamentoId; }
    public void setEquipamentoId(Long equipamentoId) { this.equipamentoId = equipamentoId; }

    public Long getFuncionarioId() { return funcionarioId; }
    public void setFuncionarioId(Long funcionarioId) { this.funcionarioId = funcionarioId; }

    public BigDecimal getPrecoOrcamento() { return precoOrcamento; }
    public void setPrecoOrcamento(BigDecimal precoOrcamento) { this.precoOrcamento = precoOrcamento; }

    public LocalDate getDataConclusao() { return dataConclusao; }
    public void setDataConclusao(LocalDate dataConclusao) { this.dataConclusao = dataConclusao; }
}