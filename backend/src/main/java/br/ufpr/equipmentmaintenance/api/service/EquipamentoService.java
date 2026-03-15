package br.ufpr.equipmentmaintenance.api.service;

import br.ufpr.equipmentmaintenance.api.dto.EquipamentoRequest;
import br.ufpr.equipmentmaintenance.api.dto.EquipamentoResponse;
import br.ufpr.equipmentmaintenance.api.model.CategoriaEquipamento;
import br.ufpr.equipmentmaintenance.api.model.Cliente;
import br.ufpr.equipmentmaintenance.api.model.Equipamento;
import br.ufpr.equipmentmaintenance.api.repository.CategoriaRepository;
import br.ufpr.equipmentmaintenance.api.repository.ClienteRepository;
import br.ufpr.equipmentmaintenance.api.repository.EquipamentoRepository;
import org.springframework.stereotype.Service;

@Service
public class EquipamentoService {

    private final EquipamentoRepository repository;
    private final ClienteRepository clienteRepository;
    private final CategoriaRepository categoriaRepository;

    public EquipamentoService(
            EquipamentoRepository repository,
            ClienteRepository clienteRepository,
            CategoriaRepository categoriaRepository) {

        this.repository = repository;
        this.clienteRepository = clienteRepository;
        this.categoriaRepository = categoriaRepository;
    }

    public EquipamentoResponse criar(EquipamentoRequest request){

        Cliente cliente = clienteRepository.findById(request.getClienteId()).orElseThrow();
        CategoriaEquipamento categoria = categoriaRepository.findById(request.getCategoriaId()).orElseThrow();

        Equipamento equipamento = new Equipamento();

        equipamento.setNome(request.getNome());
        equipamento.setMarca(request.getMarca());
        equipamento.setModelo(request.getModelo());
        equipamento.setNumeroSerie(request.getNumeroSerie());
        equipamento.setCliente(cliente);
        equipamento.setCategoria(categoria);

        equipamento = repository.save(equipamento);

        EquipamentoResponse response = new EquipamentoResponse();

        response.setId(equipamento.getId());
        response.setNome(equipamento.getNome());
        response.setMarca(equipamento.getMarca());
        response.setModelo(equipamento.getModelo());
        response.setNumeroSerie(equipamento.getNumeroSerie());
        response.setClienteNome(cliente.getNome());
        response.setCategoriaNome(categoria.getNome());

        return response;
    }
}