package br.ufpr.equipmentmaintenance.api.controller;

import br.ufpr.equipmentmaintenance.api.dto.FuncionarioRequest;
import br.ufpr.equipmentmaintenance.api.dto.FuncionarioResponse;
import br.ufpr.equipmentmaintenance.api.security.AuthorizationService;
import br.ufpr.equipmentmaintenance.api.service.FuncionarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/funcionarios")
public class FuncionarioController {

    private final FuncionarioService service;
    private final AuthorizationService authorizationService;

    public FuncionarioController(FuncionarioService service, AuthorizationService authorizationService) {
        this.service = service;
        this.authorizationService = authorizationService;
    }

    @GetMapping
    public ResponseEntity<List<FuncionarioResponse>> listar() {
        authorizationService.assertFuncionario();
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FuncionarioResponse> buscar(@PathVariable Long id) {
        authorizationService.assertFuncionario();
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<FuncionarioResponse> criar(@Valid @RequestBody FuncionarioRequest request) {
        authorizationService.assertFuncionario();
        return ResponseEntity.status(HttpStatus.CREATED).body(service.salvar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FuncionarioResponse> atualizar(@PathVariable Long id,
                                                         @Valid @RequestBody FuncionarioRequest request) {
        authorizationService.assertFuncionario();
        return ResponseEntity.ok(service.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        authorizationService.assertFuncionario();
        service.deletar(id, authorizationService.requireAuthenticated().userId());
        return ResponseEntity.noContent().build();
    }
}
