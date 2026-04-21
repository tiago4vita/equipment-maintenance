package br.ufpr.equipmentmaintenance.api.service;

import br.ufpr.equipmentmaintenance.api.dto.ClienteRequest;
import br.ufpr.equipmentmaintenance.api.dto.ClienteResponse;
import br.ufpr.equipmentmaintenance.api.model.Cliente;
import br.ufpr.equipmentmaintenance.api.repository.ClienteRepository;
import br.ufpr.equipmentmaintenance.api.util.SenhaUtil;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class ClienteService {

    private final ClienteRepository repository;
    private final SenhaUtil senhaUtil;
    private final EmailService emailService;

    public ClienteService(ClienteRepository repository, SenhaUtil senhaUtil, EmailService emailService) {
        this.repository = repository;
        this.senhaUtil = senhaUtil;
        this.emailService = emailService;
    }

    public List<ClienteResponse> listarTodos() {
        return repository.findAll().stream()
                .map(ClienteResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public ClienteResponse buscarPorId(Long id) {
        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado."));
        return ClienteResponse.fromEntity(cliente);
    }

    // RF001 — Autocadastro: senha gerada automaticamente (4 dígitos) e enviada por e-mail
    public ClienteResponse criar(ClienteRequest request) {
        if (repository.findByCpf(request.getCpf()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "CPF já cadastrado.");
        }
        if (repository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já cadastrado.");
        }

        String senhaGerada = String.format("%04d", new Random().nextInt(10000));

        Cliente cliente = new Cliente();
        preencherDados(cliente, request);
        cliente.setSenha(senhaUtil.criptografar(senhaGerada));

        cliente = repository.save(cliente);

        emailService.enviarSenhaAutocadastro(cliente.getEmail(), cliente.getNome(), senhaGerada);

        return ClienteResponse.fromEntity(cliente);
    }

    public ClienteResponse atualizar(Long id, ClienteRequest request) {
        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado."));

        repository.findByEmail(request.getEmail())
                .filter(c -> !c.getId().equals(id))
                .ifPresent(c -> { throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já em uso por outro cliente."); });

        repository.findByCpf(request.getCpf())
                .filter(c -> !c.getId().equals(id))
                .ifPresent(c -> { throw new ResponseStatusException(HttpStatus.CONFLICT, "CPF já em uso por outro cliente."); });

        preencherDados(cliente, request);
        cliente = repository.save(cliente);
        return ClienteResponse.fromEntity(cliente);
    }

    public void deletar(Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado.");
        }
        repository.deleteById(id);
    }

    private void preencherDados(Cliente cliente, ClienteRequest request) {
        cliente.setNome(request.getNome());
        cliente.setCpf(request.getCpf());
        cliente.setEmail(request.getEmail());
        cliente.setTelefone(request.getTelefone());
        cliente.setCep(request.getCep());
        cliente.setRua(request.getRua());
        cliente.setNumero(request.getNumero());
        cliente.setBairro(request.getBairro());
        cliente.setComplemento(request.getComplemento());
        cliente.setCidade(request.getCidade());
        cliente.setEstado(request.getEstado());
    }
}