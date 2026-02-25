package br.ufpr.equipmentmaintenance.api.status;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
@RequestMapping("/api/status")
public class StatusController {

    @GetMapping
    public ApiStatusResponse getStatus() {
        return new ApiStatusResponse(
                "equipment-maintenance-api",
                "UP",
                "API REST funcionando",
                Instant.now().toString()
        );
    }
}
