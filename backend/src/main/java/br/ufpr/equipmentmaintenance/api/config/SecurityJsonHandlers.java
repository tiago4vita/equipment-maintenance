package br.ufpr.equipmentmaintenance.api.config;

import br.ufpr.equipmentmaintenance.api.dto.ApiErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;

/**
 * Respostas JSON para 401 (não autenticado) e 403 (sem permissão), alinhadas a {@link ApiErrorResponse}.
 */
@Configuration
public class SecurityJsonHandlers {

    @Bean
    public AuthenticationEntryPoint jsonAuthenticationEntryPoint(ObjectMapper objectMapper) {
        return (request, response, authException) -> {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            ApiErrorResponse body = ApiErrorResponse.of(
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "UNAUTHORIZED",
                    "É necessário estar autenticado para acessar este recurso.",
                    request.getRequestURI(),
                    null);
            objectMapper.writeValue(response.getOutputStream(), body);
        };
    }

    @Bean
    public AccessDeniedHandler jsonAccessDeniedHandler(ObjectMapper objectMapper) {
        return (request, response, accessDeniedException) -> {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            ApiErrorResponse body = ApiErrorResponse.of(
                    HttpServletResponse.SC_FORBIDDEN,
                    "FORBIDDEN",
                    accessDeniedException.getMessage() != null
                            ? accessDeniedException.getMessage()
                            : "Acesso negado.",
                    request.getRequestURI(),
                    null);
            objectMapper.writeValue(response.getOutputStream(), body);
        };
    }
}
