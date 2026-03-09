package br.ufpr.equipmentmaintenance.api.dto;

import br.ufpr.equipmentmaintenance.api.model.Funcionario;
import java.time.LocalDate;

public record FuncionarioResponse(
    Long id,
    String email,
    String nome,
    LocalDate dataNascimento
) {
    public static FuncionarioResponse fromEntity(Funcionario funcionario) {
        return new FuncionarioResponse(
            funcionario.getId(),
            funcionario.getEmail(),
            funcionario.getNome(),
            funcionario.getDataNascimento()
        );
    }
}