package br.ufpr.equipmentmaintenance.api.status;

public record ApiStatusResponse(
        String service,
        String status,
        String message,
        String timestamp
) {
}
