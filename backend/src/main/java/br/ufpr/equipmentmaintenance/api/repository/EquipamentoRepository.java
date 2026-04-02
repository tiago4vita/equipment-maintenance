package br.ufpr.equipmentmaintenance.api.repository;

import br.ufpr.equipmentmaintenance.api.model.Equipamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EquipamentoRepository extends JpaRepository<Equipamento, Long> {
    List<Equipamento> findByClienteIdOrderByNomeAsc(Long clienteId);
}