package br.ufpr.equipmentmaintenance.api.controller;

import br.ufpr.equipmentmaintenance.api.dto.AlterarStatusRequest;
import br.ufpr.equipmentmaintenance.api.dto.SolicitacaoRequest;
import br.ufpr.equipmentmaintenance.api.dto.SolicitacaoResponse;
import br.ufpr.equipmentmaintenance.api.security.AuthorizationService;
import br.ufpr.equipmentmaintenance.api.service.SolicitacaoService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/solicitacoes")
public class SolicitacaoController {

    private final SolicitacaoService service;
    private final AuthorizationService authorizationService;

    public SolicitacaoController(SolicitacaoService service, AuthorizationService authorizationService) {
        this.service = service;
        this.authorizationService = authorizationService;
    }

    /**
     * RF011/RF013 — listagem para funcionário.
     * periodo: todas | hoje | intervalo (com dataInicio e dataFim).
     * status: omitido = ABERTA (RF011); “todos” = sem filtro de status (RF013).
     */
    @GetMapping
    public ResponseEntity<List<SolicitacaoResponse>> listar(
            @RequestParam(required = false) String status,
            @RequestParam(required = false, defaultValue = "todas") String periodo,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim) {
        authorizationService.assertFuncionario();
        return ResponseEntity.ok(service.listarParaFuncionario(
                status, periodo, dataInicio, dataFim,
                authorizationService.requireAuthenticated().userId()));
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<SolicitacaoResponse>> listarPorCliente(@PathVariable Long clienteId) {
        authorizationService.assertClienteSelfOrFuncionario(clienteId);
        return ResponseEntity.ok(service.listarPorCliente(clienteId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SolicitacaoResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id, authorizationService.requireAuthenticated()));
    }

    @PostMapping
    public ResponseEntity<SolicitacaoResponse> criar(@Valid @RequestBody SolicitacaoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.criar(request, authorizationService.requireAuthenticated()));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<SolicitacaoResponse> alterarStatus(
            @PathVariable Long id,
            @Valid @RequestBody AlterarStatusRequest request) {
        return ResponseEntity.ok(service.alterarStatus(id, request, authorizationService.requireAuthenticated()));
    }
}
