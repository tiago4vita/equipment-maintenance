package br.ufpr.equipmentmaintenance.api.dto;

import br.ufpr.equipmentmaintenance.api.model.SolicitacaoManutencao;
import br.ufpr.equipmentmaintenance.api.model.StatusSolicitacao;

import java.math.BigDecimal;
import java.time.LocalDate;

public class SolicitacaoResponse {

    private Long id;
    private String descricaoProblema;
    private StatusSolicitacao status;
    private BigDecimal precoOrcamento;
    private LocalDate dataAbertura;
    private LocalDate dataConclusao;
    private Long equipamentoId;
    private String equipamentoNome;
    private String clienteNome;
    private Long funcionarioId;
    private String funcionarioNome;

    public static SolicitacaoResponse fromEntity(SolicitacaoManutencao s) {
        SolicitacaoResponse r = new SolicitacaoResponse();
        r.setId(s.getId());
        r.setDescricaoProblema(s.getDescricaoProblema());
        r.setStatus(s.getStatus());
        r.setPrecoOrcamento(s.getPrecoOrcamento());
        r.setDataAbertura(s.getDataAbertura());
        r.setDataConclusao(s.getDataConclusao());
        if (s.getEquipamento() != null) {
            r.setEquipamentoId(s.getEquipamento().getId());
            r.setEquipamentoNome(s.getEquipamento().getNome());
            if (s.getEquipamento().getCliente() != null) {
                r.setClienteNome(s.getEquipamento().getCliente().getNome());
            }
        }
        if (s.getFuncionario() != null) {
            r.setFuncionarioId(s.getFuncionario().getId());
            r.setFuncionarioNome(s.getFuncionario().getNome());
        }
        return r;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDescricaoProblema() { return descricaoProblema; }
    public void setDescricaoProblema(String d) { this.descricaoProblema = d; }

    public StatusSolicitacao getStatus() { return status; }
    public void setStatus(StatusSolicitacao status) { this.status = status; }

    public BigDecimal getPrecoOrcamento() { return precoOrcamento; }
    public void setPrecoOrcamento(BigDecimal p) { this.precoOrcamento = p; }

    public LocalDate getDataAbertura() { return dataAbertura; }
    public void setDataAbertura(LocalDate d) { this.dataAbertura = d; }

    public LocalDate getDataConclusao() { return dataConclusao; }
    public void setDataConclusao(LocalDate d) { this.dataConclusao = d; }

    public Long getEquipamentoId() { return equipamentoId; }
    public void setEquipamentoId(Long e) { this.equipamentoId = e; }

    public String getEquipamentoNome() { return equipamentoNome; }
    public void setEquipamentoNome(String e) { this.equipamentoNome = e; }

    public String getClienteNome() { return clienteNome; }
    public void setClienteNome(String c) { this.clienteNome = c; }

    public Long getFuncionarioId() { return funcionarioId; }
    public void setFuncionarioId(Long f) { this.funcionarioId = f; }

    public String getFuncionarioNome() { return funcionarioNome; }
    public void setFuncionarioNome(String f) { this.funcionarioNome = f; }
}