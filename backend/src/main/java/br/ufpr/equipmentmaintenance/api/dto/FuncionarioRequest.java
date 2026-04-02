package br.ufpr.equipmentmaintenance.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record FuncionarioRequest(
    @NotBlank(message = "O e-mail é obrigatório.")
    @Email(message = "O formato do e-mail é inválido.")
    @Size(max = 255, message = "O e-mail deve ter no máximo 255 caracteres.")
    String email,

    @NotBlank(message = "O nome é obrigatório.")
    @Size(max = 200, message = "O nome deve ter no máximo 200 caracteres.")
    String nome,

    @NotNull(message = "A data de nascimento é obrigatória.")
    LocalDate dataNascimento,

    /** Obrigatória na criação; opcional na atualização (mantém a senha atual se omitida). */
    @Size(max = 500, message = "A senha deve ter no máximo 500 caracteres.")
    String senha
) {}