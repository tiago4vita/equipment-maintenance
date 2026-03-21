package br.ufpr.equipmentmaintenance.api.repository;

import br.ufpr.equipmentmaintenance.api.model.SolicitacaoManutencao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SolicitacaoRepository extends JpaRepository<SolicitacaoManutencao, Long> {
    List<SolicitacaoManutencao> findByEquipamentoClienteId(Long clienteId);
    List<SolicitacaoManutencao> findByFuncionarioId(Long funcionarioId);
}