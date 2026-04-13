package br.ufpr.equipmentmaintenance.api.repository;

import br.ufpr.equipmentmaintenance.api.model.Solicitacao;
import br.ufpr.equipmentmaintenance.api.model.StatusSolicitacao;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long>, JpaSpecificationExecutor<Solicitacao> {

    @EntityGraph(attributePaths = {
            "cliente",
            "equipamento",
            "funcionarioDestinoAtual",
            "historico",
            "historico.funcionarioResponsavel",
            "historico.funcionarioDestino",
            "historico.cliente"
    })
    Optional<Solicitacao> findDetailedById(Long id);

    @EntityGraph(attributePaths = {
            "cliente",
            "equipamento",
            "funcionarioDestinoAtual",
            "historico",
            "historico.funcionarioResponsavel",
            "historico.funcionarioDestino",
            "historico.cliente"
    })
    List<Solicitacao> findByClienteIdOrderByDataCriacaoAsc(Long clienteId);

    @EntityGraph(attributePaths = {
            "cliente",
            "equipamento",
            "funcionarioDestinoAtual",
            "historico",
            "historico.funcionarioResponsavel",
            "historico.funcionarioDestino",
            "historico.cliente"
    })
    @Override
    List<Solicitacao> findAll(Specification<Solicitacao> spec, Sort sort);

    List<Solicitacao> findByStatusOrderByDataCriacaoAsc(StatusSolicitacao status);

    List<Solicitacao> findByStatusInAndDataHoraPagamentoBetweenOrderByDataHoraPagamentoAsc(
            List<StatusSolicitacao> statuses, LocalDateTime inicio, LocalDateTime fim);

    List<Solicitacao> findByStatusIn(List<StatusSolicitacao> statuses);
}
