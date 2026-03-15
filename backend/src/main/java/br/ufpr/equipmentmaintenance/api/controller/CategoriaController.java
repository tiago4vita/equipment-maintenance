package br.ufpr.equipmentmaintenance.api.controller;

import br.ufpr.equipmentmaintenance.api.dto.CategoriaRequest;
import br.ufpr.equipmentmaintenance.api.dto.CategoriaResponse;
import br.ufpr.equipmentmaintenance.api.service.CategoriaService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    private final CategoriaService service;

    public CategoriaController(CategoriaService service) {
        this.service = service;
    }

    @PostMapping
    public CategoriaResponse criar(@RequestBody CategoriaRequest request) {
        return service.criar(request);
    }
}