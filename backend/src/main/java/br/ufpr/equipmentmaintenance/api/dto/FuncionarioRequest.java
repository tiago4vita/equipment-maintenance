package br.ufpr.equipmentmaintenance.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record FuncionarioRequest(
    @NotBlank(message = "O e-mail é obrigatório.")
    @Email(message = "O formato do e-mail é inválido.")
    String email,

    @NotBlank(message = "O nome é obrigatório.")
    String nome,

    @NotNull(message = "A data de nascimento é obrigatória.")
    LocalDate dataNascimento,

    /** Obrigatória na criação; opcional na atualização (mantém a senha atual se omitida). */
    String senha
) {}