package br.ufpr.equipmentmaintenance.api.model;

import jakarta.persistence.*;
import org.hibernate.annotations.SQLDelete;

/**
 * Soft-delete via {@code @SQLDelete} (atualiza {@code ativo = false}).
 * NÃO usamos {@code @SQLRestriction} porque ele aplica {@code WHERE ativo=true}
 * em todo JOIN para esta tabela — incluindo o JOIN obrigatório de
 * {@link Solicitacao#getCategoria()}, o que sumiria com solicitações antigas
 * cuja categoria foi desativada. O filtro de listagem ativa fica explícito
 * no repositório/service.
 */
@Entity
@Table(name = "categoria_equipamento")
@SQLDelete(sql = "UPDATE categoria_equipamento SET ativo = false WHERE id = ?")
public class CategoriaEquipamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private String descricao;

    @Column(nullable = false)
    private Boolean ativo = true;

    public Long getId() { return id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
}