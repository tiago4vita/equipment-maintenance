package br.ufpr.equipmentmaintenance.api.model;

import jakarta.persistence.*;
import org.hibernate.annotations.BatchSize;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "solicitacao")
public class Solicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * RF004 — vínculo opcional com um Equipamento pré-cadastrado do cliente.
     * A entidade ganhou FK direta para {@link CategoriaEquipamento} e
     * {@code descricaoEquipamento} em texto livre, mas mantemos o campo para
     * compatibilidade com seeds/telas existentes.
     */
    @ManyToOne
    @JoinColumn(name = "equipamento_id")
    private Equipamento equipamento;

    @ManyToOne(optional = false)
    @JoinColumn(name = "categoria_id")
    private CategoriaEquipamento categoria;

    @Column(name = "descricao_equipamento", nullable = false, length = 200)
    private String descricaoEquipamento;

    @ManyToOne(optional = false)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @Column(nullable = false, length = 500)
    private String descricaoProblema;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusSolicitacao status = StatusSolicitacao.ABERTA;

    // Preenchido pelo funcionário ao orçar (RF012)
    @Column(precision = 10, scale = 2)
    private BigDecimal valorOrcamento;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dataCriacao = LocalDateTime.now();

    // Preenchido pelo funcionário ao efetuar manutenção (RF014)
    @Column(length = 1000)
    private String descricaoManutencao;

    @Column(length = 1000)
    private String orientacoesCliente;

    /** Preenchido quando status = REDIRECIONADA (RF013/RF015): destino atual da solicitação */
    @ManyToOne
    @JoinColumn(name = "funcionario_destino_atual_id")
    private Funcionario funcionarioDestinoAtual;

    private LocalDateTime dataHoraPagamento;
    private LocalDateTime dataHoraFinalizacao;

    @BatchSize(size = 32)
    @OneToMany(mappedBy = "solicitacao", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("dataAlteracao ASC")
    private List<HistoricoSolicitacao> historico = new ArrayList<>();

    // ── Getters e Setters ──────────────────────────────────────────────────────

    public Long getId() { return id; }

    public Equipamento getEquipamento() { return equipamento; }
    public void setEquipamento(Equipamento equipamento) { this.equipamento = equipamento; }

    public CategoriaEquipamento getCategoria() { return categoria; }
    public void setCategoria(CategoriaEquipamento categoria) { this.categoria = categoria; }

    public String getDescricaoEquipamento() { return descricaoEquipamento; }
    public void setDescricaoEquipamento(String descricaoEquipamento) { this.descricaoEquipamento = descricaoEquipamento; }

    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }

    public String getDescricaoProblema() { return descricaoProblema; }
    public void setDescricaoProblema(String descricaoProblema) { this.descricaoProblema = descricaoProblema; }

    public StatusSolicitacao getStatus() { return status; }
    public void setStatus(StatusSolicitacao status) { this.status = status; }

    public BigDecimal getValorOrcamento() { return valorOrcamento; }
    public void setValorOrcamento(BigDecimal valorOrcamento) { this.valorOrcamento = valorOrcamento; }

    public LocalDateTime getDataCriacao() { return dataCriacao; }

    /** Uso em carga de dados / testes; não exposto na API. */
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }

    public String getDescricaoManutencao() { return descricaoManutencao; }
    public void setDescricaoManutencao(String descricaoManutencao) { this.descricaoManutencao = descricaoManutencao; }

    public String getOrientacoesCliente() { return orientacoesCliente; }
    public void setOrientacoesCliente(String orientacoesCliente) { this.orientacoesCliente = orientacoesCliente; }

    public Funcionario getFuncionarioDestinoAtual() { return funcionarioDestinoAtual; }
    public void setFuncionarioDestinoAtual(Funcionario funcionarioDestinoAtual) {
        this.funcionarioDestinoAtual = funcionarioDestinoAtual;
    }

    public LocalDateTime getDataHoraPagamento() { return dataHoraPagamento; }
    public void setDataHoraPagamento(LocalDateTime dataHoraPagamento) { this.dataHoraPagamento = dataHoraPagamento; }

    public LocalDateTime getDataHoraFinalizacao() { return dataHoraFinalizacao; }
    public void setDataHoraFinalizacao(LocalDateTime dataHoraFinalizacao) { this.dataHoraFinalizacao = dataHoraFinalizacao; }

    public List<HistoricoSolicitacao> getHistorico() { return historico; }
}