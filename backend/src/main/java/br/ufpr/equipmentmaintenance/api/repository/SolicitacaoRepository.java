package br.ufpr.equipmentmaintenance.api.repository;

import br.ufpr.equipmentmaintenance.api.model.Solicitacao;
import br.ufpr.equipmentmaintenance.api.model.StatusSolicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDateTime;
import java.util.List;

public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long>, JpaSpecificationExecutor<Solicitacao> {
    List<Solicitacao> findByClienteIdOrderByDataCriacaoAsc(Long clienteId);
    List<Solicitacao> findByStatusOrderByDataCriacaoAsc(StatusSolicitacao status);

    List<Solicitacao> findByStatusInAndDataHoraPagamentoBetweenOrderByDataHoraPagamentoAsc(
            List<StatusSolicitacao> statuses, LocalDateTime inicio, LocalDateTime fim);

    List<Solicitacao> findByStatusIn(List<StatusSolicitacao> statuses);
}