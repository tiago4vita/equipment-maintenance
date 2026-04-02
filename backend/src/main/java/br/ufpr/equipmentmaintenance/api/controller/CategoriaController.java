package br.ufpr.equipmentmaintenance.api.controller;

import br.ufpr.equipmentmaintenance.api.dto.CategoriaRequest;
import br.ufpr.equipmentmaintenance.api.dto.CategoriaResponse;
import br.ufpr.equipmentmaintenance.api.security.AuthorizationService;
import br.ufpr.equipmentmaintenance.api.service.CategoriaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    private final CategoriaService service;
    private final AuthorizationService authorizationService;

    public CategoriaController(CategoriaService service, AuthorizationService authorizationService) {
        this.service = service;
        this.authorizationService = authorizationService;
    }

    @GetMapping
    public ResponseEntity<List<CategoriaResponse>> listar() {
        authorizationService.requireAuthenticated();
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaResponse> buscar(@PathVariable Long id) {
        authorizationService.requireAuthenticated();
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<CategoriaResponse> criar(@Valid @RequestBody CategoriaRequest request) {
        authorizationService.assertFuncionario();
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaResponse> atualizar(@PathVariable Long id,
                                                      @Valid @RequestBody CategoriaRequest request) {
        authorizationService.assertFuncionario();
        return ResponseEntity.ok(service.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        authorizationService.assertFuncionario();
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
