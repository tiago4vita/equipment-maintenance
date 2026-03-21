package br.ufpr.equipmentmaintenance.api.service;

import br.ufpr.equipmentmaintenance.api.dto.CategoriaRequest;
import br.ufpr.equipmentmaintenance.api.dto.CategoriaResponse;
import br.ufpr.equipmentmaintenance.api.model.CategoriaEquipamento;
import br.ufpr.equipmentmaintenance.api.repository.CategoriaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoriaService {

    private final CategoriaRepository repository;

    public CategoriaService(CategoriaRepository repository) {
        this.repository = repository;
    }

    public List<CategoriaResponse> listarTodos() {
        return repository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public CategoriaResponse buscarPorId(Long id) {
        CategoriaEquipamento categoria = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria não encontrada."));
        return toResponse(categoria);
    }

    public CategoriaResponse criar(CategoriaRequest request) {
        CategoriaEquipamento categoria = new CategoriaEquipamento();
        categoria.setNome(request.getNome());
        categoria.setDescricao(request.getDescricao());
        categoria = repository.save(categoria);
        return toResponse(categoria);
    }

    public CategoriaResponse atualizar(Long id, CategoriaRequest request) {
        CategoriaEquipamento categoria = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria não encontrada."));
        categoria.setNome(request.getNome());
        categoria.setDescricao(request.getDescricao());
        categoria = repository.save(categoria);
        return toResponse(categoria);
    }

    public void deletar(Long id) {
        CategoriaEquipamento categoria = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria não encontrada."));
        repository.delete(categoria);
    }

    private CategoriaResponse toResponse(CategoriaEquipamento c) {
        CategoriaResponse r = new CategoriaResponse();
        r.setId(c.getId());
        r.setNome(c.getNome());
        r.setDescricao(c.getDescricao());
        return r;
    }
}