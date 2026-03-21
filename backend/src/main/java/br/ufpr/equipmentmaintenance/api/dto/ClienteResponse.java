package br.ufpr.equipmentmaintenance.api.dto;

import br.ufpr.equipmentmaintenance.api.model.Cliente;

public class ClienteResponse {

    private Long id;
    private String nome;
    private String cpf;
    private String email;
    private String telefone;
    private String cep;
    private String rua;
    private String numero;
    private String cidade;
    private String estado;
    private Boolean ativo;

    public static ClienteResponse fromEntity(Cliente c) {
        ClienteResponse r = new ClienteResponse();
        r.setId(c.getId());
        r.setNome(c.getNome());
        r.setCpf(c.getCpf());
        r.setEmail(c.getEmail());
        r.setTelefone(c.getTelefone());
        r.setCep(c.getCep());
        r.setRua(c.getRua());
        r.setNumero(c.getNumero());
        r.setCidade(c.getCidade());
        r.setEstado(c.getEstado());
        r.setAtivo(c.getAtivo());
        return r;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public String getCep() { return cep; }
    public void setCep(String cep) { this.cep = cep; }

    public String getRua() { return rua; }
    public void setRua(String rua) { this.rua = rua; }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public String getCidade() { return cidade; }
    public void setCidade(String cidade) { this.cidade = cidade; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
}