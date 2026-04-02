package br.ufpr.equipmentmaintenance.api.service;

import br.ufpr.equipmentmaintenance.api.model.StatusSolicitacao;
import br.ufpr.equipmentmaintenance.api.security.JwtPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Set;

/**
 * Valida transições de estado e perfil (cliente x funcionário).
 */
public final class SolicitacaoTransicao {

    private static final Set<String> CLIENTE = Set.of(
            chave(StatusSolicitacao.ORCADA, StatusSolicitacao.APROVADA),
            chave(StatusSolicitacao.ORCADA, StatusSolicitacao.REJEITADA),
            chave(StatusSolicitacao.REJEITADA, StatusSolicitacao.APROVADA),
            chave(StatusSolicitacao.ARRUMADA, StatusSolicitacao.PAGA)
    );

    private static final Set<String> FUNCIONARIO = Set.of(
            chave(StatusSolicitacao.ABERTA, StatusSolicitacao.ORCADA),
            chave(StatusSolicitacao.APROVADA, StatusSolicitacao.ARRUMADA),
            chave(StatusSolicitacao.APROVADA, StatusSolicitacao.REDIRECIONADA),
            chave(StatusSolicitacao.REDIRECIONADA, StatusSolicitacao.ARRUMADA),
            chave(StatusSolicitacao.REDIRECIONADA, StatusSolicitacao.REDIRECIONADA),
            chave(StatusSolicitacao.PAGA, StatusSolicitacao.FINALIZADA)
    );

    private SolicitacaoTransicao() {}

    private static String chave(StatusSolicitacao a, StatusSolicitacao b) {
        return a.name() + "->" + b.name();
    }

    public static void validar(JwtPrincipal principal, StatusSolicitacao atual, StatusSolicitacao novo) {
        String k = chave(atual, novo);
        if ("CLIENTE".equals(principal.perfil())) {
            if (!CLIENTE.contains(k)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "Transição não permitida para o cliente: " + k);
            }
            return;
        }
        if ("FUNCIONARIO".equals(principal.perfil())) {
            if (!FUNCIONARIO.contains(k)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "Transição não permitida para o funcionário: " + k);
            }
            return;
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Perfil inválido.");
    }
}
