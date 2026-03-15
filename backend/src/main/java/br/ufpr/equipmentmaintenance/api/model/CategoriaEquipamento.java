package br.ufpr.equipmentmaintenance.api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "categoria_equipamento")
public class CategoriaEquipamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nome;

    @Column(nullable = false)
    private Boolean ativo = true;

    public CategoriaEquipamento() {
    }

    public CategoriaEquipamento(String nome) {
        this.nome = nome;
        this.ativo = true;
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }
}