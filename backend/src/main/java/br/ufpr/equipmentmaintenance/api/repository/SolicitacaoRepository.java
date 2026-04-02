package br.ufpr.equipmentmaintenance.api.repository;

import br.ufpr.equipmentmaintenance.api.model.Solicitacao;
import br.ufpr.equipmentmaintenance.api.model.StatusSolicitacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {
    List<Solicitacao> findByClienteIdOrderByDataCriacaoAsc(Long clienteId);
    List<Solicitacao> findByStatusOrderByDataCriacaoAsc(StatusSolicitacao status);
}