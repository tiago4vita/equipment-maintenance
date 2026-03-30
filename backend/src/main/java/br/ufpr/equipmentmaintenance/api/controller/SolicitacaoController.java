package br.ufpr.equipmentmaintenance.api.controller;

import br.ufpr.equipmentmaintenance.api.dto.AlterarStatusRequest;
import br.ufpr.equipmentmaintenance.api.dto.SolicitacaoRequest;
import br.ufpr.equipmentmaintenance.api.dto.SolicitacaoResponse;
import br.ufpr.equipmentmaintenance.api.service.SolicitacaoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solicitacoes")
public class SolicitacaoController {

    private final SolicitacaoService service;

    public SolicitacaoController(SolicitacaoService service) {
        this.service = service;
    }

    /** Listar todas (uso do funcionário) */
    @GetMapping
    public ResponseEntity<List<SolicitacaoResponse>> listar() {
        return ResponseEntity.ok(service.listarTodas());
    }

    /** Listar por cliente (uso do cliente logado) */
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<SolicitacaoResponse>> listarPorCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(service.listarPorCliente(clienteId));
    }

    /** Buscar solicitação com histórico completo */
    @GetMapping("/{id}")
    public ResponseEntity<SolicitacaoResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    /** Abrir nova solicitação */
    @PostMapping
    public ResponseEntity<SolicitacaoResponse> criar(@Valid @RequestBody SolicitacaoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(request));
    }

    /** Alterar status — registra histórico automaticamente (RF008) */
    @PatchMapping("/{id}/status")
    public ResponseEntity<SolicitacaoResponse> alterarStatus(
            @PathVariable Long id,
            @RequestBody AlterarStatusRequest request) {
        return ResponseEntity.ok(service.alterarStatus(id, request));
    }
}