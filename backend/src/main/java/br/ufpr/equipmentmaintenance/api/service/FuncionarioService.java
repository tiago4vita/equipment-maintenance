package br.ufpr.equipmentmaintenance.api.service;

import br.ufpr.equipmentmaintenance.api.dto.FuncionarioRequest;
import br.ufpr.equipmentmaintenance.api.dto.FuncionarioResponse;
import br.ufpr.equipmentmaintenance.api.model.Funcionario;
import br.ufpr.equipmentmaintenance.api.repository.FuncionarioRepository;
import br.ufpr.equipmentmaintenance.api.util.SenhaUtil;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FuncionarioService {

    private final FuncionarioRepository repository;
    private final SenhaUtil senhaUtil;

    public FuncionarioService(FuncionarioRepository repository, SenhaUtil senhaUtil) {
        this.repository = repository;
        this.senhaUtil = senhaUtil;
    }

    public List<FuncionarioResponse> listarTodos() {
        return repository.findByAtivoTrue().stream()
                .map(FuncionarioResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public FuncionarioResponse buscarPorId(Long id) {
        Funcionario funcionario = repository.findById(id)
                .filter(Funcionario::isAtivo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return FuncionarioResponse.fromEntity(funcionario);
    }

    public FuncionarioResponse salvar(FuncionarioRequest request) {
        Funcionario funcionario = new Funcionario();
        funcionario.setNome(request.nome());
        funcionario.setEmail(request.email());
        funcionario.setDataNascimento(request.dataNascimento());
        funcionario.setSenha(senhaUtil.criptografar(request.senha()));
        
        funcionario = repository.save(funcionario);
        return FuncionarioResponse.fromEntity(funcionario);
    }

    public FuncionarioResponse atualizar(Long id, FuncionarioRequest request) {
        Funcionario funcionario = repository.findById(id)
                .filter(Funcionario::isAtivo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        funcionario.setNome(request.nome());
        funcionario.setEmail(request.email());
        funcionario.setDataNascimento(request.dataNascimento());
        
        if (request.senha() != null && !request.senha().isBlank()) {
            funcionario.setSenha(senhaUtil.criptografar(request.senha()));
        }

        funcionario = repository.save(funcionario);
        return FuncionarioResponse.fromEntity(funcionario);
    }

    public void deletar(Long id, Long idUsuarioLogado) {
        if (id.equals(idUsuarioLogado)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }

        if (repository.countByAtivoTrue() <= 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }

        Funcionario funcionario = repository.findById(id)
                .filter(Funcionario::isAtivo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        funcionario.setAtivo(false);
        repository.save(funcionario);
    }
}
