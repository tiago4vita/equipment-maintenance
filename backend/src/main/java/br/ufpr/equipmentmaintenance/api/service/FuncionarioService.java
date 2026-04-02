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
        return repository.findAll().stream()
                .map(FuncionarioResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public FuncionarioResponse buscarPorId(Long id) {
        Funcionario funcionario = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return FuncionarioResponse.fromEntity(funcionario);
    }

    public FuncionarioResponse salvar(FuncionarioRequest request) {
        if (request.senha() == null || request.senha().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A senha é obrigatória no cadastro.");
        }
        if (repository.findByEmail(request.email()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já cadastrado.");
        }

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
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionário não encontrado."));

        repository.findByEmail(request.email())
                .filter(f -> !f.getId().equals(id))
                .ifPresent(f -> { throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já em uso por outro funcionário."); });

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
        Funcionario funcionario = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionário não encontrado."));

        if (id.equals(idUsuarioLogado)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Você não pode remover a si mesmo.");
        }

        if (repository.countByAtivoTrue() <= 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Não é possível remover o único funcionário ativo.");
        }

        repository.deleteById(funcionario.getId());
    }
}