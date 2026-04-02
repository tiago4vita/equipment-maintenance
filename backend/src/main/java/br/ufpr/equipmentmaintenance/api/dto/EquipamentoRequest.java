package br.ufpr.equipmentmaintenance.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class EquipamentoRequest {

    @NotBlank(message = "O nome do equipamento é obrigatório.")
    @Size(max = 200, message = "O nome deve ter no máximo 200 caracteres.")
    private String nome;

    @Size(max = 120, message = "A marca deve ter no máximo 120 caracteres.")
    private String marca;

    @Size(max = 120, message = "O modelo deve ter no máximo 120 caracteres.")
    private String modelo;

    @Size(max = 120, message = "O número de série deve ter no máximo 120 caracteres.")
    private String numeroSerie;

    @NotNull(message = "O cliente é obrigatório.")
    private Long clienteId;

    @NotNull(message = "A categoria é obrigatória.")
    private Long categoriaId;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public String getNumeroSerie() {
        return numeroSerie;
    }

    public void setNumeroSerie(String numeroSerie) {
        this.numeroSerie = numeroSerie;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public Long getCategoriaId() {
        return categoriaId;
    }

    public void setCategoriaId(Long categoriaId) {
        this.categoriaId = categoriaId;
    }
}
