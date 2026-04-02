package br.ufpr.equipmentmaintenance.api.service;

import br.ufpr.equipmentmaintenance.api.dto.AlterarStatusRequest;
import br.ufpr.equipmentmaintenance.api.dto.SolicitacaoRequest;
import br.ufpr.equipmentmaintenance.api.dto.SolicitacaoResponse;
import br.ufpr.equipmentmaintenance.api.model.*;
import br.ufpr.equipmentmaintenance.api.repository.*;
import br.ufpr.equipmentmaintenance.api.security.JwtPrincipal;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
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

    @Transactional
    public SolicitacaoResponse criar(SolicitacaoRequest request, JwtPrincipal principal) {
        if ("CLIENTE".equals(principal.perfil())) {
            if (!principal.userId().equals(request.clienteId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "Só é possível abrir solicitação em nome do próprio cliente.");
            }
        }

        Equipamento equipamento = equipamentoRepository.findById(request.equipamentoId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipamento não encontrado."));

        if ("CLIENTE".equals(principal.perfil())
                && !equipamento.getCliente().getId().equals(principal.userId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "O equipamento não pertence ao cliente logado.");
        }

        Cliente cliente = clienteRepository.findById(request.clienteId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado."));

        Solicitacao solicitacao = new Solicitacao();
        solicitacao.setEquipamento(equipamento);
        solicitacao.setCliente(cliente);
        solicitacao.setDescricaoProblema(request.descricaoProblema());
        solicitacao.setStatus(StatusSolicitacao.ABERTA);

        HistoricoSolicitacao historicoCriacao = new HistoricoSolicitacao();
        historicoCriacao.setSolicitacao(solicitacao);
        historicoCriacao.setStatusAnterior(StatusSolicitacao.ABERTA);
        historicoCriacao.setStatusNovo(StatusSolicitacao.ABERTA);
        historicoCriacao.setObservacao("Solicitação criada pelo cliente.");
        solicitacao.getHistorico().add(historicoCriacao);

        return SolicitacaoResponse.fromEntity(solicitacaoRepository.save(solicitacao));
    }

    @Transactional
    public SolicitacaoResponse alterarStatus(Long id, AlterarStatusRequest request, JwtPrincipal principal) {
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

        StatusSolicitacao atual = solicitacao.getStatus();
        if (atual == novoStatus) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A solicitação já está neste status.");
        }

        SolicitacaoTransicao.validar(principal, atual, novoStatus);

        if (novoStatus == StatusSolicitacao.ORCADA) {
            if (request.valorOrcamento() == null || request.valorOrcamento().compareTo(java.math.BigDecimal.ZERO) <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "O valor do orçamento é obrigatório e deve ser maior que zero ao mudar para ORÇADA.");
            }
            solicitacao.setValorOrcamento(request.valorOrcamento());
        }

        if (novoStatus == StatusSolicitacao.ARRUMADA) {
            if (request.descricaoManutencao() == null || request.descricaoManutencao().isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "A descrição da manutenção é obrigatória ao mudar para ARRUMADA.");
            }
            if (request.orientacoesCliente() == null || request.orientacoesCliente().isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "As orientações para o cliente são obrigatórias ao mudar para ARRUMADA.");
            }
            solicitacao.setDescricaoManutencao(request.descricaoManutencao());
            solicitacao.setOrientacoesCliente(request.orientacoesCliente());
        }

        if (novoStatus == StatusSolicitacao.REDIRECIONADA) {
            if (request.funcionarioDestinoId() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "O funcionário destino é obrigatório ao redirecionar.");
            }
            if (request.funcionarioId() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "O funcionário de origem é obrigatório ao redirecionar.");
            }
            if (request.funcionarioId().equals(request.funcionarioDestinoId())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Não é possível redirecionar para si mesmo.");
            }
        }

        if (novoStatus == StatusSolicitacao.PAGA) {
            solicitacao.setDataHoraPagamento(LocalDateTime.now());
        }
        if (novoStatus == StatusSolicitacao.FINALIZADA) {
            solicitacao.setDataHoraFinalizacao(LocalDateTime.now());
        }

        if (novoStatus == StatusSolicitacao.REDIRECIONADA) {
            Funcionario destino = funcionarioRepository.findById(request.funcionarioDestinoId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionário destino não encontrado."));
            solicitacao.setFuncionarioDestinoAtual(destino);
        } else {
            solicitacao.setFuncionarioDestinoAtual(null);
        }

        HistoricoSolicitacao historico = new HistoricoSolicitacao();
        historico.setSolicitacao(solicitacao);
        historico.setStatusAnterior(atual);
        historico.setStatusNovo(novoStatus);
        historico.setObservacao(request.observacao());

        if (request.funcionarioId() != null) {
            Funcionario funcionario = funcionarioRepository.findById(request.funcionarioId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionário não encontrado."));
            historico.setFuncionarioResponsavel(funcionario);
        }

        if (novoStatus == StatusSolicitacao.REDIRECIONADA) {
            Funcionario destino = funcionarioRepository.findById(request.funcionarioDestinoId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionário destino não encontrado."));
            historico.setFuncionarioDestino(destino);
        }

        solicitacao.getHistorico().add(historico);
        solicitacao.setStatus(novoStatus);

        return SolicitacaoResponse.fromEntity(solicitacaoRepository.save(solicitacao));
    }

    /**
     * RF013: listagem para funcionário — filtros periodo (todas|hoje|intervalo), status opcional.
     */
    public List<SolicitacaoResponse> listarParaFuncionario(
            String statusParam,
            String periodo,
            LocalDate dataInicio,
            LocalDate dataFim,
            Long funcionarioLogadoId) {

        StatusSolicitacao statusEnum = null;
        if (statusParam != null && !statusParam.isBlank()) {
            try {
                statusEnum = StatusSolicitacao.valueOf(statusParam.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Status inválido: " + statusParam);
            }
        }

        String p = periodo == null || periodo.isBlank() ? "todas" : periodo.toLowerCase();
        LocalDateTime inicio = null;
        LocalDateTime fim = null;

        switch (p) {
            case "todas" -> { /* sem filtro de data */ }
            case "hoje" -> {
                LocalDate hoje = LocalDate.now();
                inicio = SolicitacaoSpecification.inicioDoDia(hoje);
                fim = SolicitacaoSpecification.fimDoDia(hoje);
            }
            case "intervalo" -> {
                if (dataInicio == null || dataFim == null) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Para periodo=intervalo informe dataInicio e dataFim (yyyy-MM-dd).");
                }
                inicio = SolicitacaoSpecification.inicioDoDia(dataInicio);
                fim = SolicitacaoSpecification.fimDoDia(dataFim);
            }
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "periodo deve ser: todas, hoje ou intervalo");
        }

        Specification<Solicitacao> spec = SolicitacaoSpecification.paraListagemFuncionario(
                statusEnum, inicio, fim, funcionarioLogadoId);

        return solicitacaoRepository.findAll(spec, Sort.by("dataCriacao").ascending()).stream()
                .map(SolicitacaoResponse::fromEntity)
                .toList();
    }

    public List<SolicitacaoResponse> listarPorCliente(Long clienteId) {
        return solicitacaoRepository.findByClienteIdOrderByDataCriacaoAsc(clienteId).stream()
                .map(SolicitacaoResponse::fromEntity)
                .toList();
    }

    public SolicitacaoResponse buscarPorId(Long id, JwtPrincipal principal) {
        Solicitacao s = solicitacaoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitação não encontrada."));
        if ("CLIENTE".equals(principal.perfil())) {
            if (!s.getCliente().getId().equals(principal.userId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado.");
            }
        }
        return SolicitacaoResponse.fromEntity(s);
    }
}
