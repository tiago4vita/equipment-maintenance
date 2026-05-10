package br.ufpr.equipmentmaintenance.api.repository;

import br.ufpr.equipmentmaintenance.api.model.CategoriaEquipamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoriaRepository extends JpaRepository<CategoriaEquipamento, Long> {

    /** RF017 — listagem do CRUD e dropdown de nova solicitação só veem categorias ativas. */
    List<CategoriaEquipamento> findByAtivoTrueOrderByNomeAsc();
}