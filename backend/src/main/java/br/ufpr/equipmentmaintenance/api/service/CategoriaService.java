package br.ufpr.equipmentmaintenance.api.service;

import br.ufpr.equipmentmaintenance.api.dto.CategoriaRequest;
import br.ufpr.equipmentmaintenance.api.dto.CategoriaResponse;
import br.ufpr.equipmentmaintenance.api.model.CategoriaEquipamento;
import br.ufpr.equipmentmaintenance.api.repository.CategoriaRepository;
import org.springframework.stereotype.Service;

@Service
public class CategoriaService {

    private final CategoriaRepository repository;

    public CategoriaService(CategoriaRepository repository) {
        this.repository = repository;
    }

    public CategoriaResponse criar(CategoriaRequest request) {

        CategoriaEquipamento categoria = new CategoriaEquipamento();

        categoria.setNome(request.getNome());
        categoria.setDescricao(request.getDescricao());

        categoria = repository.save(categoria);

        CategoriaResponse response = new CategoriaResponse();

        response.setId(categoria.getId());
        response.setNome(categoria.getNome());
        response.setDescricao(categoria.getDescricao());

        return response;
    }
}