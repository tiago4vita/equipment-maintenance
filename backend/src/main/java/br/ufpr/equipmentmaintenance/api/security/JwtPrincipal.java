package br.ufpr.equipmentmaintenance.api.security;

public record JwtPrincipal(String email, Long userId, String perfil) {}
