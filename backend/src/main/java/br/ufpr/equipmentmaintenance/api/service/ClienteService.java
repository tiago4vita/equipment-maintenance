package br.ufpr.equipmentmaintenance.api.service;

import br.ufpr.equipmentmaintenance.api.model.Cliente;
import br.ufpr.equipmentmaintenance.api.repository.ClienteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {

    private final ClienteRepository repository;

    public ClienteService(ClienteRepository repository) {
        this.repository = repository;
    }

    public List<Cliente> listar() {
        return repository.findAll();
    }

    public Cliente salvar(Cliente cliente) {

        if (repository.findByEmail(cliente.getEmail()).isPresent()) {
            throw new RuntimeException("Email já cadastrado");
        }

        if (repository.findByCpf(cliente.getCpf()).isPresent()) {
            throw new RuntimeException("CPF já cadastrado");
        }

        return repository.save(cliente);
    }

    public Cliente buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
    }

    public Cliente atualizar(Long id, Cliente clienteAtualizado) {

        Cliente cliente = buscarPorId(id);

        cliente.setNome(clienteAtualizado.getNome());
        cliente.setTelefone(clienteAtualizado.getTelefone());
        cliente.setCep(clienteAtualizado.getCep());
        cliente.setRua(clienteAtualizado.getRua());
        cliente.setNumero(clienteAtualizado.getNumero());
        cliente.setCidade(clienteAtualizado.getCidade());
        cliente.setEstado(clienteAtualizado.getEstado());

        return repository.save(cliente);
    }

    public void desativar(Long id) {

        Cliente cliente = buscarPorId(id);

        cliente.setAtivo(false);

        repository.save(cliente);
    }
}