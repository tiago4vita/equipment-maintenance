package br.ufpr.equipmentmaintenance.api.repository;

import br.ufpr.equipmentmaintenance.api.model.CategoriaEquipamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoriaRepository extends JpaRepository<CategoriaEquipamento, Long> {

    List<CategoriaEquipamento> findByAtivoTrue();

}