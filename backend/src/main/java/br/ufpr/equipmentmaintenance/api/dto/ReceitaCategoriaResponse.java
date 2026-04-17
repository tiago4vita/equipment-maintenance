package br.ufpr.equipmentmaintenance.api.dto;

import java.math.BigDecimal;

public record ReceitaCategoriaResponse(String categoria, BigDecimal valorTotal) {}