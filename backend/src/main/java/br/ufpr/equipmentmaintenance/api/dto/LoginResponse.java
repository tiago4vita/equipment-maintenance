package br.ufpr.equipmentmaintenance.api.dto;

public record LoginResponse(
    Long id,
    String nome,
    String email,
    String perfil,
    String token
) {}