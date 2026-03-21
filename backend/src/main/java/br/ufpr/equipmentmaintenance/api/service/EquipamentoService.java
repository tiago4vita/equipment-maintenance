package br.ufpr.equipmentmaintenance.api.service;

import br.ufpr.equipmentmaintenance.api.dto.EquipamentoRequest;
import br.ufpr.equipmentmaintenance.api.dto.EquipamentoResponse;
import br.ufpr.equipmentmaintenance.api.model.CategoriaEquipamento;
import br.ufpr.equipmentmaintenance.api.model.Cliente;
import br.ufpr.equipmentmaintenance.api.model.Equipamento;
import br.ufpr.equipmentmaintenance.api.repository.CategoriaRepository;
import br.ufpr.equipmentmaintenance.api.repository.ClienteRepository;
import br.ufpr.equipmentmaintenance.api.repository.EquipamentoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EquipamentoService {

    private final EquipamentoRepository repository;
    private final ClienteRepository clienteRepository;
    private final CategoriaRepository categoriaRepository;

    public EquipamentoService(EquipamentoRepository repository,
                               ClienteRepository clienteRepository,
                               CategoriaRepository categoriaRepository) {
        this.repository = repository;
        this.clienteRepository = clienteRepository;
        this.categoriaRepository = categoriaRepository;
    }

    public List<EquipamentoResponse> listarTodos() {
        return repository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public EquipamentoResponse buscarPorId(Long id) {
        Equipamento equipamento = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipamento não encontrado."));
        return toResponse(equipamento);
    }

    public EquipamentoResponse criar(EquipamentoRequest request) {
        Equipamento equipamento = new Equipamento();
        preencherDados(equipamento, request);
        equipamento = repository.save(equipamento);
        return toResponse(equipamento);
    }

    public EquipamentoResponse atualizar(Long id, EquipamentoRequest request) {
        Equipamento equipamento = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipamento não encontrado."));
        preencherDados(equipamento, request);
        equipamento = repository.save(equipamento);
        return toResponse(equipamento);
    }

    public void deletar(Long id) {
        Equipamento equipamento = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipamento não encontrado."));
        repository.delete(equipamento);
    }

    private void preencherDados(Equipamento equipamento, EquipamentoRequest request) {
        Cliente cliente = clienteRepository.findById(request.getClienteId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado."));
        CategoriaEquipamento categoria = categoriaRepository.findById(request.getCategoriaId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria não encontrada."));

        equipamento.setNome(request.getNome());
        equipamento.setMarca(request.getMarca());
        equipamento.setModelo(request.getModelo());
        equipamento.setNumeroSerie(request.getNumeroSerie());
        equipamento.setCliente(cliente);
        equipamento.setCategoria(categoria);
    }

    private EquipamentoResponse toResponse(Equipamento e) {
        EquipamentoResponse r = new EquipamentoResponse();
        r.setId(e.getId());
        r.setNome(e.getNome());
        r.setMarca(e.getMarca());
        r.setModelo(e.getModelo());
        r.setNumeroSerie(e.getNumeroSerie());
        r.setClienteNome(e.getCliente() != null ? e.getCliente().getNome() : null);
        r.setCategoriaNome(e.getCategoria() != null ? e.getCategoria().getNome() : null);
        return r;
    }
}