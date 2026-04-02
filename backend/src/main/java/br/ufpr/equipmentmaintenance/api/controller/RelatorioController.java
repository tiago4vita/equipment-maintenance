package br.ufpr.equipmentmaintenance.api.controller;

import br.ufpr.equipmentmaintenance.api.security.AuthorizationService;
import br.ufpr.equipmentmaintenance.api.service.RelatorioService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/relatorios")
public class RelatorioController {

    private final RelatorioService relatorioService;
    private final AuthorizationService authorizationService;

    public RelatorioController(RelatorioService relatorioService, AuthorizationService authorizationService) {
        this.relatorioService = relatorioService;
        this.authorizationService = authorizationService;
    }

    /** RF019 — PDF receitas por dia no período (datas opcionais). */
    @GetMapping(value = "/receitas", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> receitasPorPeriodo(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim) {
        authorizationService.assertFuncionario();
        byte[] pdf = relatorioService.gerarPdfReceitasPorPeriodo(dataInicio, dataFim);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=receitas-por-dia.pdf")
                .body(pdf);
    }

    /** RF020 — PDF receitas agrupadas por categoria (desde sempre). */
    @GetMapping(value = "/receitas-por-categoria", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> receitasPorCategoria() {
        authorizationService.assertFuncionario();
        byte[] pdf = relatorioService.gerarPdfReceitasPorCategoria();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=receitas-por-categoria.pdf")
                .body(pdf);
    }
}
