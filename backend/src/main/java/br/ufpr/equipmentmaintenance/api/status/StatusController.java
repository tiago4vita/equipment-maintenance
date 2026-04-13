package br.ufpr.equipmentmaintenance.api.status;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/status")
public class StatusController {

    private static final DateTimeFormatter FMT_BR =
            DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss").withZone(ZoneId.of("America/Sao_Paulo"));

    @GetMapping
    public ApiStatusResponse getStatus() {
        return new ApiStatusResponse(
                "equipment-maintenance-api",
                "UP",
                "API REST funcionando",
                FMT_BR.format(Instant.now())
        );
    }
}
