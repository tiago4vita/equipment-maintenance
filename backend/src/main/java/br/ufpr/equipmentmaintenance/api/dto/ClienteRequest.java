package br.ufpr.equipmentmaintenance.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ClienteRequest {

    @NotBlank(message = "O CPF é obrigatório.")
    @Size(max = 14, message = "O CPF deve ter no máximo 14 caracteres.")
    private String cpf;

    @NotBlank(message = "O nome é obrigatório.")
    @Size(max = 200, message = "O nome deve ter no máximo 200 caracteres.")
    private String nome;

    @NotBlank(message = "O e-mail é obrigatório.")
    @Email(message = "E-mail inválido.")
    @Size(max = 255, message = "O e-mail deve ter no máximo 255 caracteres.")
    private String email;

    @Size(max = 25, message = "O telefone deve ter no máximo 25 caracteres.")
    private String telefone;

    @Size(max = 10, message = "O CEP deve ter no máximo 10 caracteres.")
    private String cep;

    @Size(max = 200, message = "A rua deve ter no máximo 200 caracteres.")
    private String rua;

    @Size(max = 20, message = "O número deve ter no máximo 20 caracteres.")
    private String numero;

    @Size(max = 100, message = "A cidade deve ter no máximo 100 caracteres.")
    private String cidade;

    @Size(max = 50, message = "O estado deve ter no máximo 50 caracteres.")
    private String estado;


    public String getCpf()    { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getNome()   { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail()  { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTelefone()  { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public String getCep()    { return cep; }
    public void setCep(String cep) { this.cep = cep; }

    public String getRua()    { return rua; }
    public void setRua(String rua) { this.rua = rua; }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public String getCidade() { return cidade; }
    public void setCidade(String cidade) { this.cidade = cidade; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

}