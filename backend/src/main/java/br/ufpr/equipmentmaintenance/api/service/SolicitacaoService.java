package br.ufpr.equipmentmaintenance.api.service;

import br.ufpr.equipmentmaintenance.api.dto.SolicitacaoRequest;
import br.ufpr.equipmentmaintenance.api.dto.SolicitacaoResponse;
import br.ufpr.equipmentmaintenance.api.model.*;
import br.ufpr.equipmentmaintenance.api.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SolicitacaoService {

    private final SolicitacaoRepository repository;
    private final EquipamentoRepository equipamentoRepository;
    private final FuncionarioRepository funcionarioRepository;

    public SolicitacaoService(SolicitacaoRepository repository,
                               EquipamentoRepository equipamentoRepository,
                               FuncionarioRepository funcionarioRepository) {
        this.repository = repository;
        this.equipamentoRepository = equipamentoRepository;
        this.funcionarioRepository = funcionarioRepository;
    }

    public List<SolicitacaoResponse> listarTodas() {
        return repository.findAll().stream()
                .map(SolicitacaoResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<SolicitacaoResponse> listarPorCliente(Long clienteId) {
        return repository.findByEquipamentoClienteId(clienteId).stream()
                .map(SolicitacaoResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public SolicitacaoResponse buscarPorId(Long id) {
        SolicitacaoManutencao s = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitação não encontrada."));
        return SolicitacaoResponse.fromEntity(s);
    }

    public SolicitacaoResponse criar(SolicitacaoRequest request) {
        SolicitacaoManutencao s = new SolicitacaoManutencao();
        preencherDados(s, request);
        s = repository.save(s);
        return SolicitacaoResponse.fromEntity(s);
    }

    public SolicitacaoResponse atualizar(Long id, SolicitacaoRequest request) {
        SolicitacaoManutencao s = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitação não encontrada."));
        preencherDados(s, request);
        s = repository.save(s);
        return SolicitacaoResponse.fromEntity(s);
    }

    public SolicitacaoResponse atualizarStatus(Long id, StatusSolicitacao novoStatus) {
        SolicitacaoManutencao s = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitação não encontrada."));
        s.setStatus(novoStatus);
        s = repository.save(s);
        return SolicitacaoResponse.fromEntity(s);
    }

    public void deletar(Long id) {
        SolicitacaoManutencao s = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitação não encontrada."));
        repository.delete(s);
    }

    private void preencherDados(SolicitacaoManutencao s, SolicitacaoRequest request) {
        Equipamento equipamento = equipamentoRepository.findById(request.getEquipamentoId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipamento não encontrado."));
        s.setDescricaoProblema(request.getDescricaoProblema());
        s.setEquipamento(equipamento);
        s.setPrecoOrcamento(request.getPrecoOrcamento());
        s.setDataConclusao(request.getDataConclusao());
        if (request.getFuncionarioId() != null) {
            Funcionario funcionario = funcionarioRepository.findById(request.getFuncionarioId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionário não encontrado."));
            s.setFuncionario(funcionario);
        }
    }
}