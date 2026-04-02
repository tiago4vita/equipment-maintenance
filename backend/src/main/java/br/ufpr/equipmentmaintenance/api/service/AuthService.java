package br.ufpr.equipmentmaintenance.api.service;

import br.ufpr.equipmentmaintenance.api.dto.LoginRequest;
import br.ufpr.equipmentmaintenance.api.dto.LoginResponse;
import br.ufpr.equipmentmaintenance.api.repository.ClienteRepository;
import br.ufpr.equipmentmaintenance.api.repository.FuncionarioRepository;
import br.ufpr.equipmentmaintenance.api.security.JwtUtil;
import br.ufpr.equipmentmaintenance.api.util.SenhaUtil;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final FuncionarioRepository funcionarioRepository;
    private final ClienteRepository clienteRepository;
    private final SenhaUtil senhaUtil;
    private final JwtUtil jwtUtil;

    public AuthService(FuncionarioRepository funcionarioRepository,
                       ClienteRepository clienteRepository,
                       SenhaUtil senhaUtil,
                       JwtUtil jwtUtil) {
        this.funcionarioRepository = funcionarioRepository;
        this.clienteRepository = clienteRepository;
        this.senhaUtil = senhaUtil;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponse login(LoginRequest request) {
        // 1. Tenta autenticar como Funcionário (ativo)
        var funcionarioOpt = funcionarioRepository.findByEmail(request.email());
        if (funcionarioOpt.isPresent()) {
            var f = funcionarioOpt.get();
            if (f.isAtivo() && senhaUtil.validarSenha(request.senha(), f.getSenha())) {
                String token = jwtUtil.gerarToken(f.getEmail(), f.getId(), "FUNCIONARIO");
                return new LoginResponse(f.getId(), f.getNome(), f.getEmail(), "FUNCIONARIO", token);
            }
        }

        // 2. Tenta autenticar como Cliente (ativo)
        var clienteOpt = clienteRepository.findByEmail(request.email());
        if (clienteOpt.isPresent()) {
            var c = clienteOpt.get();
            if (Boolean.TRUE.equals(c.getAtivo()) && senhaUtil.validarSenha(request.senha(), c.getSenha())) {
                String token = jwtUtil.gerarToken(c.getEmail(), c.getId(), "CLIENTE");
                return new LoginResponse(c.getId(), c.getNome(), c.getEmail(), "CLIENTE", token);
            }
        }

        // 3. Credenciais inválidas
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "E-mail ou senha inválidos.");
    }
}