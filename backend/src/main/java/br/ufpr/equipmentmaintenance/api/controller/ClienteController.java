package br.ufpr.equipmentmaintenance.api.controller;

import br.ufpr.equipmentmaintenance.api.dto.ClienteRequest;
import br.ufpr.equipmentmaintenance.api.dto.ClienteResponse;
import br.ufpr.equipmentmaintenance.api.service.ClienteService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    private final ClienteService service;

    public ClienteController(ClienteService service) {
        this.service = service;
    }

    @PostMapping
    public ClienteResponse criar(@RequestBody ClienteRequest request){
        return service.criar(request);
    }
}