package br.ufpr.equipmentmaintenance.api.service;

import br.ufpr.equipmentmaintenance.api.dto.AlterarStatusRequest;
import br.ufpr.equipmentmaintenance.api.dto.SolicitacaoRequest;
import br.ufpr.equipmentmaintenance.api.dto.SolicitacaoResponse;
import br.ufpr.equipmentmaintenance.api.model.*;
import br.ufpr.equipmentmaintenance.api.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class SolicitacaoService {

    private final SolicitacaoRepository solicitacaoRepository;
    private final EquipamentoRepository equipamentoRepository;
    private final ClienteRepository clienteRepository;
    private final FuncionarioRepository funcionarioRepository;

    public SolicitacaoService(SolicitacaoRepository solicitacaoRepository,
                               EquipamentoRepository equipamentoRepository,
                               ClienteRepository clienteRepository,
                               FuncionarioRepository funcionarioRepository) {
        this.solicitacaoRepository = solicitacaoRepository;
        this.equipamentoRepository = equipamentoRepository;
        this.clienteRepository = clienteRepository;
        this.funcionarioRepository = funcionarioRepository;
    }

    // ── Criar solicitação (status inicial: ABERTA) ─────────────────────────────
    @Transactional
    public SolicitacaoResponse criar(SolicitacaoRequest request) {
        Equipamento equipamento = equipamentoRepository.findById(request.equipamentoId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipamento não encontrado."));

        Cliente cliente = clienteRepository.findById(request.clienteId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado."));

        Solicitacao solicitacao = new Solicitacao();
        solicitacao.setEquipamento(equipamento);
        solicitacao.setCliente(cliente);
        solicitacao.setDescricaoProblema(request.descricaoProblema());
        solicitacao.setStatus(StatusSolicitacao.ABERTA);

        // Primeiro histórico: criação da solicitação
        HistoricoSolicitacao historicoCriacao = new HistoricoSolicitacao();
        historicoCriacao.setSolicitacao(solicitacao);
        historicoCriacao.setStatusAnterior(StatusSolicitacao.ABERTA);
        historicoCriacao.setStatusNovo(StatusSolicitacao.ABERTA);
        historicoCriacao.setObservacao("Solicitação criada pelo cliente.");
        solicitacao.getHistorico().add(historicoCriacao);

        return SolicitacaoResponse.fromEntity(solicitacaoRepository.save(solicitacao));
    }

    // ── Alterar status com registro automático de histórico (RF008) ────────────
    @Transactional
    public SolicitacaoResponse alterarStatus(Long id, AlterarStatusRequest request) {
        Solicitacao solicitacao = solicitacaoRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitação não encontrada."));

        StatusSolicitacao novoStatus;
        try {
            novoStatus = StatusSolicitacao.valueOf(request.novoStatus().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Status inválido: " + request.novoStatus() + ". Valores permitidos: " +
                java.util.Arrays.toString(StatusSolicitacao.values()));
        }

        // Ao orçar, o valor é obrigatório
        if (novoStatus == StatusSolicitacao.ORCADA) {
            if (request.valorOrcamento() == null || request.valorOrcamento().compareTo(java.math.BigDecimal.ZERO) <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "O valor do orçamento é obrigatório e deve ser maior que zero ao mudar para ORCADA.");
            }
            solicitacao.setValorOrcamento(request.valorOrcamento());
        }

        // Registra o histórico ANTES de mudar o status
        HistoricoSolicitacao historico = new HistoricoSolicitacao();
        historico.setSolicitacao(solicitacao);
        historico.setStatusAnterior(solicitacao.getStatus());
        historico.setStatusNovo(novoStatus);
        historico.setObservacao(request.observacao());

        // Vincula o funcionário responsável (se informado)
        if (request.funcionarioId() != null) {
            Funcionario funcionario = funcionarioRepository.findById(request.funcionarioId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionário não encontrado."));
            historico.setFuncionarioResponsavel(funcionario);
        }

        solicitacao.getHistorico().add(historico);
        solicitacao.setStatus(novoStatus);

        return SolicitacaoResponse.fromEntity(solicitacaoRepository.save(solicitacao));
    }

    // ── Consultas ──────────────────────────────────────────────────────────────
    public List<SolicitacaoResponse> listarTodas() {
        return solicitacaoRepository.findAll().stream()
            .map(SolicitacaoResponse::fromEntity)
            .toList();
    }

    public List<SolicitacaoResponse> listarPorCliente(Long clienteId) {
        return solicitacaoRepository.findByClienteId(clienteId).stream()
            .map(SolicitacaoResponse::fromEntity)
            .toList();
    }

    public SolicitacaoResponse buscarPorId(Long id) {
        return SolicitacaoResponse.fromEntity(
            solicitacaoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitação não encontrada."))
        );
    }
}