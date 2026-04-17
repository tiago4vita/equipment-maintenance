package br.ufpr.equipmentmaintenance.api.service;

import br.ufpr.equipmentmaintenance.api.dto.ReceitaCategoriaResponse;
import br.ufpr.equipmentmaintenance.api.dto.ReceitaDiariaResponse;
import br.ufpr.equipmentmaintenance.api.model.Solicitacao;
import br.ufpr.equipmentmaintenance.api.model.StatusSolicitacao;
import br.ufpr.equipmentmaintenance.api.repository.SolicitacaoRepository;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class RelatorioService {

    private static final DateTimeFormatter FMT_BR = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final SolicitacaoRepository solicitacaoRepository;

    public RelatorioService(SolicitacaoRepository solicitacaoRepository) {
        this.solicitacaoRepository = solicitacaoRepository;
    }

    public byte[] gerarPdfReceitasPorPeriodo(LocalDate dataInicio, LocalDate dataFim) {
        List<Solicitacao> pagas = solicitacaoRepository.findByStatusIn(
                List.of(StatusSolicitacao.PAGA, StatusSolicitacao.FINALIZADA));

        LocalDateTime inicio = dataInicio != null
                ? dataInicio.atStartOfDay()
                : LocalDateTime.of(1970, 1, 1, 0, 0);
        LocalDateTime fim = dataFim != null
                ? dataFim.atTime(LocalTime.MAX)
                : LocalDateTime.of(2999, 12, 31, 23, 59, 59);

        List<Solicitacao> filtradas = pagas.stream()
                .filter(s -> s.getDataHoraPagamento() != null)
                .filter(s -> !s.getDataHoraPagamento().isBefore(inicio) && !s.getDataHoraPagamento().isAfter(fim))
                .sorted(Comparator.comparing(Solicitacao::getDataHoraPagamento))
                .toList();

        Map<LocalDate, BigDecimal> porDia = filtradas.stream()
                .collect(Collectors.groupingBy(
                        s -> s.getDataHoraPagamento().toLocalDate(),
                        Collectors.reducing(BigDecimal.ZERO,
                                s -> s.getValorOrcamento() != null ? s.getValorOrcamento() : BigDecimal.ZERO,
                                BigDecimal::add)));

        List<LocalDate> diasOrdenados = porDia.keySet().stream().sorted().toList();

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try {
            Document doc = new Document();
            PdfWriter.getInstance(doc, baos);
            doc.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, Color.DARK_GRAY);
            doc.add(new Paragraph("Relatório de receitas por dia", titleFont));
            doc.add(new Paragraph(" "));

            String periodoTxt = (dataInicio != null ? dataInicio.format(FMT_BR) : "—")
                    + " a "
                    + (dataFim != null ? dataFim.format(FMT_BR) : "—");
            doc.add(new Paragraph("Período: " + periodoTxt, FontFactory.getFont(FontFactory.HELVETICA, 11)));
            doc.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.addCell(new Phrase("Data", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11)));
            table.addCell(new Phrase("Total (R$)", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11)));

            BigDecimal totalGeral = BigDecimal.ZERO;
            for (LocalDate dia : diasOrdenados) {
                BigDecimal v = porDia.get(dia);
                totalGeral = totalGeral.add(v);
                table.addCell(dia.format(FMT_BR));
                table.addCell(formatarMoeda(v));
            }
            doc.add(table);
            doc.add(new Paragraph(" "));
            doc.add(new Paragraph("Total geral: R$ " + formatarMoeda(totalGeral),
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));

            doc.close();
            return baos.toByteArray();
        } catch (DocumentException e) {
            throw new IllegalStateException("Falha ao gerar PDF", e);
        }
    }

    public byte[] gerarPdfReceitasPorCategoria() {
        List<Solicitacao> pagas = solicitacaoRepository.findByStatusIn(
                List.of(StatusSolicitacao.PAGA, StatusSolicitacao.FINALIZADA));

        Map<String, BigDecimal> porCategoria = pagas.stream()
                .filter(s -> s.getValorOrcamento() != null)
                .collect(Collectors.groupingBy(
                        s -> s.getEquipamento().getCategoria() != null
                                ? s.getEquipamento().getCategoria().getNome()
                                : "(sem categoria)",
                        Collectors.reducing(BigDecimal.ZERO, Solicitacao::getValorOrcamento, BigDecimal::add)));

        List<String> categorias = porCategoria.keySet().stream().sorted().toList();

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try {
            Document doc = new Document();
            PdfWriter.getInstance(doc, baos);
            doc.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, Color.DARK_GRAY);
            doc.add(new Paragraph("Relatório de receitas por categoria", titleFont));
            doc.add(new Paragraph(" "));
            doc.add(new Paragraph("Consolidado desde o início dos registros.", FontFactory.getFont(FontFactory.HELVETICA, 11)));
            doc.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.addCell(new Phrase("Categoria", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11)));
            table.addCell(new Phrase("Total (R$)", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11)));

            BigDecimal totalGeral = BigDecimal.ZERO;
            for (String cat : categorias) {
                BigDecimal v = porCategoria.get(cat);
                totalGeral = totalGeral.add(v);
                table.addCell(cat);
                table.addCell(formatarMoeda(v));
            }
            doc.add(table);
            doc.add(new Paragraph(" "));
            doc.add(new Paragraph("Total geral: R$ " + formatarMoeda(totalGeral),
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));

            doc.close();
            return baos.toByteArray();
        } catch (DocumentException e) {
            throw new IllegalStateException("Falha ao gerar PDF", e);
        }
    }

    private static String formatarMoeda(BigDecimal v) {
        return String.format(java.util.Locale.forLanguageTag("pt-BR"), "%,.2f", v);
    }

    public List<ReceitaDiariaResponse> obterDadosReceitasPorPeriodo(LocalDate dataInicio, LocalDate dataFim) {
        List<Solicitacao> pagas = solicitacaoRepository.findByStatusIn(
                List.of(StatusSolicitacao.PAGA, StatusSolicitacao.FINALIZADA));

        LocalDateTime inicio = dataInicio != null ? dataInicio.atStartOfDay() : LocalDateTime.of(1970, 1, 1, 0, 0);
        LocalDateTime fim = dataFim != null ? dataFim.atTime(LocalTime.MAX) : LocalDateTime.of(2999, 12, 31, 23, 59, 59);

        Map<LocalDate, BigDecimal> porDia = pagas.stream()
                .filter(s -> s.getDataHoraPagamento() != null)
                .filter(s -> !s.getDataHoraPagamento().isBefore(inicio) && !s.getDataHoraPagamento().isAfter(fim))
                .collect(Collectors.groupingBy(
                        s -> s.getDataHoraPagamento().toLocalDate(),
                        Collectors.reducing(BigDecimal.ZERO, 
                                s -> s.getValorOrcamento() != null ? s.getValorOrcamento() : BigDecimal.ZERO, 
                                BigDecimal::add)));

        return porDia.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(e -> new ReceitaDiariaResponse(e.getKey(), e.getValue()))
                .toList();
    }

    public List<ReceitaCategoriaResponse> obterDadosReceitasPorCategoria() {
        List<Solicitacao> pagas = solicitacaoRepository.findByStatusIn(
                List.of(StatusSolicitacao.PAGA, StatusSolicitacao.FINALIZADA));

        Map<String, BigDecimal> porCategoria = pagas.stream()
                .filter(s -> s.getValorOrcamento() != null)
                .collect(Collectors.groupingBy(
                        s -> s.getEquipamento().getCategoria() != null ? s.getEquipamento().getCategoria().getNome() : "(sem categoria)",
                        Collectors.reducing(BigDecimal.ZERO, Solicitacao::getValorOrcamento, BigDecimal::add)));

        return porCategoria.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(e -> new ReceitaCategoriaResponse(e.getKey(), e.getValue()))
                .toList();
    }
}