package br.ufpr.equipmentmaintenance.api.controller;

import br.ufpr.equipmentmaintenance.api.dto.EquipamentoRequest;
import br.ufpr.equipmentmaintenance.api.dto.EquipamentoResponse;
import br.ufpr.equipmentmaintenance.api.security.AuthorizationService;
import br.ufpr.equipmentmaintenance.api.service.EquipamentoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipamentos")
public class EquipamentoController {

    private final EquipamentoService service;
    private final AuthorizationService authorizationService;

    public EquipamentoController(EquipamentoService service, AuthorizationService authorizationService) {
        this.service = service;
        this.authorizationService = authorizationService;
    }

    @GetMapping
    public ResponseEntity<List<EquipamentoResponse>> listar() {
        authorizationService.assertFuncionario();
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<EquipamentoResponse>> listarPorCliente(@PathVariable Long clienteId) {
        authorizationService.assertClienteSelfOrFuncionario(clienteId);
        return ResponseEntity.ok(service.listarPorCliente(clienteId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EquipamentoResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id, authorizationService.requireAuthenticated()));
    }

    @PostMapping
    public ResponseEntity<EquipamentoResponse> criar(@Valid @RequestBody EquipamentoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.criar(request, authorizationService.requireAuthenticated()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EquipamentoResponse> atualizar(@PathVariable Long id,
                                                         @Valid @RequestBody EquipamentoRequest request) {
        return ResponseEntity.ok(service.atualizar(id, request, authorizationService.requireAuthenticated()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id, authorizationService.requireAuthenticated());
        return ResponseEntity.noContent().build();
    }
}
