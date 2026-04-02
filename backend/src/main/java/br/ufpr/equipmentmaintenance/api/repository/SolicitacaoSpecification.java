package br.ufpr.equipmentmaintenance.api.repository;

import br.ufpr.equipmentmaintenance.api.model.Solicitacao;
import br.ufpr.equipmentmaintenance.api.model.StatusSolicitacao;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

public final class SolicitacaoSpecification {

    private SolicitacaoSpecification() {}

    /**
     * RF013: listagem para funcionário — filtro de status, período sobre dataCriacao,
     * e visibilidade de REDIRECIONADA apenas para o destino atual.
     */
    public static Specification<Solicitacao> paraListagemFuncionario(
            StatusSolicitacao statusFiltro,
            LocalDateTime inicio,
            LocalDateTime fim,
            Long funcionarioLogadoId) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (statusFiltro != null) {
                predicates.add(cb.equal(root.get("status"), statusFiltro));
            }
            if (inicio != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("dataCriacao"), inicio));
            }
            if (fim != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("dataCriacao"), fim));
            }

            // REDIRECIONADA só aparece para quem é o destino atual (RF013/RF015)
            Predicate naoEhRedirect = cb.notEqual(root.get("status"), StatusSolicitacao.REDIRECIONADA);
            Predicate redirectParaMim = cb.and(
                    cb.equal(root.get("status"), StatusSolicitacao.REDIRECIONADA),
                    cb.equal(root.get("funcionarioDestinoAtual").get("id"), funcionarioLogadoId));
            predicates.add(cb.or(naoEhRedirect, redirectParaMim));

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    public static LocalDateTime inicioDoDia(LocalDate d) {
        return d.atStartOfDay();
    }

    public static LocalDateTime fimDoDia(LocalDate d) {
        return d.atTime(LocalTime.MAX);
    }
}
