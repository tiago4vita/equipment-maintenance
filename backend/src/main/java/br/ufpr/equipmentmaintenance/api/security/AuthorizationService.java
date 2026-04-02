package br.ufpr.equipmentmaintenance.api.security;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthorizationService {

    public JwtPrincipal requireAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Não autenticado.");
        }
        Object principal = authentication.getPrincipal();
        if (!(principal instanceof JwtPrincipal)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Não autenticado.");
        }
        return (JwtPrincipal) principal;
    }

    public void assertFuncionario() {
        JwtPrincipal p = requireAuthenticated();
        if (!"FUNCIONARIO".equals(p.perfil())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso exclusivo de funcionário.");
        }
    }

    public void assertClienteSelfOrFuncionario(Long idCliente) {
        JwtPrincipal p = requireAuthenticated();
        if ("FUNCIONARIO".equals(p.perfil())) {
            return;
        }
        if ("CLIENTE".equals(p.perfil()) && p.userId() != null && p.userId().equals(idCliente)) {
            return;
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado a dados de outro cliente.");
    }

    public void assertCliente(Long idCliente) {
        JwtPrincipal p = requireAuthenticated();
        if (!"CLIENTE".equals(p.perfil()) || p.userId() == null || !p.userId().equals(idCliente)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado.");
        }
    }

    public void assertClienteOuFuncionario() {
        JwtPrincipal p = requireAuthenticated();
        if (!"CLIENTE".equals(p.perfil()) && !"FUNCIONARIO".equals(p.perfil())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Perfil inválido.");
        }
    }
}
