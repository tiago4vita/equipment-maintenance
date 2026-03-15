package br.ufpr.equipmentmaintenance.api.service;

import br.ufpr.equipmentmaintenance.api.model.CategoriaEquipamento;
import br.ufpr.equipmentmaintenance.api.repository.CategoriaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaService {

    private final CategoriaRepository repository;

    public CategoriaService(CategoriaRepository repository) {
        this.repository = repository;
    }

    public List<CategoriaEquipamento> listar() {
        return repository.findByAtivoTrue();
    }

    public CategoriaEquipamento salvar(CategoriaEquipamento categoria) {
        return repository.save(categoria);
    }

    public CategoriaEquipamento atualizar(Long id, CategoriaEquipamento categoria) {

        CategoriaEquipamento existente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));

        existente.setNome(categoria.getNome());

        return repository.save(existente);
    }

    public void remover(Long id) {

        CategoriaEquipamento categoria = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));

        categoria.setAtivo(false);

        repository.save(categoria);
    }
}