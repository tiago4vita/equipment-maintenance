package br.ufpr.equipmentmaintenance.api.controller;

import br.ufpr.equipmentmaintenance.api.dto.ClienteRequest;
import br.ufpr.equipmentmaintenance.api.dto.ClienteResponse;
import br.ufpr.equipmentmaintenance.api.security.AuthorizationService;
import br.ufpr.equipmentmaintenance.api.service.ClienteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteService service;
    private final AuthorizationService authorizationService;

    public ClienteController(ClienteService service, AuthorizationService authorizationService) {
        this.service = service;
        this.authorizationService = authorizationService;
    }

    @GetMapping
    public ResponseEntity<List<ClienteResponse>> listar() {
        authorizationService.assertFuncionario();
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponse> buscar(@PathVariable Long id) {
        authorizationService.assertClienteSelfOrFuncionario(id);
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<ClienteResponse> criar(@Valid @RequestBody ClienteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClienteResponse> atualizar(@PathVariable Long id,
                                                     @Valid @RequestBody ClienteRequest request) {
        authorizationService.assertClienteSelfOrFuncionario(id);
        return ResponseEntity.ok(service.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        authorizationService.assertFuncionario();
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
