package br.ufpr.equipmentmaintenance.api.controller;

import br.ufpr.equipmentmaintenance.api.dto.ReceitaCategoriaResponse;
import br.ufpr.equipmentmaintenance.api.dto.ReceitaDiariaResponse;
import br.ufpr.equipmentmaintenance.api.security.AuthorizationService;
import br.ufpr.equipmentmaintenance.api.service.RelatorioService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/relatorios")
public class RelatorioController {

    private final RelatorioService relatorioService;
    private final AuthorizationService authorizationService;

    public RelatorioController(RelatorioService relatorioService, AuthorizationService authorizationService) {
        this.relatorioService = relatorioService;
        this.authorizationService = authorizationService;
    }

    @GetMapping(value = "/receitas-periodo", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> receitasPorPeriodoPdf(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim) {
        
        authorizationService.assertFuncionario();
        byte[] pdf = relatorioService.gerarPdfReceitasPorPeriodo(dataInicio, dataFim);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=receitas_periodo.pdf")
                .body(pdf);
    }

    @GetMapping(value = "/receitas-categoria", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> receitasPorCategoriaPdf() {
        
        authorizationService.assertFuncionario();
        byte[] pdf = relatorioService.gerarPdfReceitasPorCategoria();
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=receitas_categoria.pdf")
                .body(pdf);
    }

    @GetMapping(value = "/receitas-periodo/dados", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ReceitaDiariaResponse>> obterDadosReceitasPorPeriodo(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim) {
        
        authorizationService.assertFuncionario();
        return ResponseEntity.ok(relatorioService.obterDadosReceitasPorPeriodo(dataInicio, dataFim));
    }

    @GetMapping(value = "/receitas-categoria/dados", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ReceitaCategoriaResponse>> obterDadosReceitasPorCategoria() {
        
        authorizationService.assertFuncionario();
        return ResponseEntity.ok(relatorioService.obterDadosReceitasPorCategoria());
    }
}