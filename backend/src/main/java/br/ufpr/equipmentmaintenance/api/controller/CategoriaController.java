package br.ufpr.equipmentmaintenance.api.controller;

import br.ufpr.equipmentmaintenance.api.model.CategoriaEquipamento;
import br.ufpr.equipmentmaintenance.api.service.CategoriaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categorias")
@CrossOrigin
public class CategoriaController {

    private final CategoriaService service;

    public CategoriaController(CategoriaService service) {
        this.service = service;
    }

    @GetMapping
    public List<CategoriaEquipamento> listar() {
        return service.listar();
    }

    @PostMapping
    public CategoriaEquipamento criar(@RequestBody CategoriaEquipamento categoria) {
        return service.salvar(categoria);
    }

    @PutMapping("/{id}")
    public CategoriaEquipamento atualizar(@PathVariable Long id,
                                           @RequestBody CategoriaEquipamento categoria) {
        return service.atualizar(id, categoria);
    }

    @DeleteMapping("/{id}")
    public void remover(@PathVariable Long id) {
        service.remover(id);
    }
}