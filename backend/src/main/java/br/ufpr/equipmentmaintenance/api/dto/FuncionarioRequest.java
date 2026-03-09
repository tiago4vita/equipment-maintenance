package br.ufpr.equipmentmaintenance.api.dto;

import java.time.LocalDate;

public record FuncionarioRequest(
    String email,
    String nome,
    LocalDate dataNascimento,
    String senha
) {}