package br.ufpr.equipmentmaintenance.api.service;

import br.ufpr.equipmentmaintenance.api.dto.ClienteRequest;
import br.ufpr.equipmentmaintenance.api.dto.ClienteResponse;
import br.ufpr.equipmentmaintenance.api.model.Cliente;
import br.ufpr.equipmentmaintenance.api.repository.ClienteRepository;
import org.springframework.stereotype.Service;

@Service
public class ClienteService {

    private final ClienteRepository repository;

    public ClienteService(ClienteRepository repository) {
        this.repository = repository;
    }

    public ClienteResponse criar(ClienteRequest request){

        Cliente cliente = new Cliente();

        cliente.setCpf(request.getCpf());
        cliente.setNome(request.getNome());
        cliente.setEmail(request.getEmail());
        cliente.setTelefone(request.getTelefone());

        cliente = repository.save(cliente);

        ClienteResponse response = new ClienteResponse();

        response.setId(cliente.getId());
        response.setNome(cliente.getNome());
        response.setEmail(cliente.getEmail());

        return response;
    }
}