package br.ufpr.equipmentmaintenance.api.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "historico_solicitacao")
public class HistoricoSolicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "solicitacao_id")
    private Solicitacao solicitacao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusSolicitacao statusAnterior;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusSolicitacao statusNovo;

    // Funcionário responsável pela mudança (null se foi o próprio sistema/cliente)
    @ManyToOne
    @JoinColumn(name = "funcionario_id")
    private Funcionario funcionarioResponsavel;

    @Column(length = 500)
    private String observacao;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dataAlteracao = LocalDateTime.now();

    // ── Getters e Setters ──────────────────────────────────────────────────────

    public Long getId() { return id; }

    public Solicitacao getSolicitacao() { return solicitacao; }
    public void setSolicitacao(Solicitacao solicitacao) { this.solicitacao = solicitacao; }

    public StatusSolicitacao getStatusAnterior() { return statusAnterior; }
    public void setStatusAnterior(StatusSolicitacao statusAnterior) { this.statusAnterior = statusAnterior; }

    public StatusSolicitacao getStatusNovo() { return statusNovo; }
    public void setStatusNovo(StatusSolicitacao statusNovo) { this.statusNovo = statusNovo; }

    public Funcionario getFuncionarioResponsavel() { return funcionarioResponsavel; }
    public void setFuncionarioResponsavel(Funcionario funcionarioResponsavel) {
        this.funcionarioResponsavel = funcionarioResponsavel;
    }

    public String getObservacao() { return observacao; }
    public void setObservacao(String observacao) { this.observacao = observacao; }

    public LocalDateTime getDataAlteracao() { return dataAlteracao; }
}