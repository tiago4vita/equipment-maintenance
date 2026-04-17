package br.ufpr.equipmentmaintenance.api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ReceitaDiariaResponse(LocalDate data, BigDecimal valorTotal) {}