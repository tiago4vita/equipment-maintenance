package br.ufpr.equipmentmaintenance.api.repository;

import br.ufpr.equipmentmaintenance.api.model.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {
    List<Funcionario> findByAtivoTrue();
    long countByAtivoTrue();
}