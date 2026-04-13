package br.ufpr.equipmentmaintenance.api.dto;

import java.time.Instant;
import java.util.List;

/**
 * Corpo JSON padronizado para erros da API (RFC 7807 simplificado).
 */
public record ApiErrorResponse(
        Instant timestamp,
        int status,
        String error,
        String message,
        String path,
        List<FieldViolation> violations
) {
    public record FieldViolation(String field, String message) {}

    public static ApiErrorResponse of(
            int status,
            String error,
            String message,
            String path,
            List<FieldViolation> violations) {
        return new ApiErrorResponse(Instant.now(), status, error, message, path,
                violations == null ? List.of() : violations);
    }
}
