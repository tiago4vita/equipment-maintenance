package br.ufpr.equipmentmaintenance.api.service;

import br.ufpr.equipmentmaintenance.api.dto.ClienteRequest;
import br.ufpr.equipmentmaintenance.api.dto.ClienteResponse;
import br.ufpr.equipmentmaintenance.api.model.Cliente;
import br.ufpr.equipmentmaintenance.api.repository.ClienteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClienteService {

    private final ClienteRepository repository;

    public ClienteService(ClienteRepository repository) {
        this.repository = repository;
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

    public ClienteResponse criar(ClienteRequest request) {
        Cliente cliente = new Cliente();
        preencherDados(cliente, request);
        cliente = repository.save(cliente);
        return ClienteResponse.fromEntity(cliente);
    }

    public ClienteResponse atualizar(Long id, ClienteRequest request) {
        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado."));
        preencherDados(cliente, request);
        cliente = repository.save(cliente);
        return ClienteResponse.fromEntity(cliente);
    }

    public void deletar(Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado.");
        }
        // O Hibernate vai transformar isso em um UPDATE ativo = false automaticamente
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
        cliente.setCidade(request.getCidade());
        cliente.setEstado(request.getEstado());
        if (request.getSenha() != null && !request.getSenha().isBlank()) {
            cliente.setSenha(request.getSenha());
        }
    }
}