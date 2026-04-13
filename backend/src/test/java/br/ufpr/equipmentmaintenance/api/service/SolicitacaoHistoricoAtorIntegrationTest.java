package br.ufpr.equipmentmaintenance.api.service;

import br.ufpr.equipmentmaintenance.api.dto.AlterarStatusRequest;
import br.ufpr.equipmentmaintenance.api.dto.HistoricoSolicitacaoResponse;
import br.ufpr.equipmentmaintenance.api.dto.SolicitacaoRequest;
import br.ufpr.equipmentmaintenance.api.dto.SolicitacaoResponse;
import br.ufpr.equipmentmaintenance.api.model.*;
import br.ufpr.equipmentmaintenance.api.repository.*;
import br.ufpr.equipmentmaintenance.api.security.JwtPrincipal;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class SolicitacaoHistoricoAtorIntegrationTest {

    @Autowired
    private SolicitacaoService solicitacaoService;
    @Autowired
    private ClienteRepository clienteRepository;
    @Autowired
    private FuncionarioRepository funcionarioRepository;
    @Autowired
    private CategoriaRepository categoriaRepository;
    @Autowired
    private EquipamentoRepository equipamentoRepository;

    @Test
    void clienteNaRejeicao_funcionarioNoOrcamento() {
        Cliente cliente = clienteRepository.save(criarCliente("111", "Cliente Teste", "ct@test"));
        Funcionario funcionario = funcionarioRepository.save(criarFuncionario("Técnico Teste", "ft@test"));
        CategoriaEquipamento cat = categoriaRepository.save(criarCategoria("Notebook"));
        Equipamento equipamento = equipamentoRepository.save(criarEquipamento("Notebook X", cliente, cat));

        JwtPrincipal clienteJwt = new JwtPrincipal(cliente.getEmail(), cliente.getId(), "CLIENTE");
        JwtPrincipal funcJwt = new JwtPrincipal(funcionario.getEmail(), funcionario.getId(), "FUNCIONARIO");

        SolicitacaoResponse criada = solicitacaoService.criar(
                new SolicitacaoRequest(equipamento.getId(), cliente.getId(), "Tela piscando."),
                clienteJwt);

        HistoricoSolicitacaoResponse abertura = ultimoHistorico(criada.historico());
        assertThat(abertura.clienteNome()).isEqualTo("Cliente Teste");
        assertThat(abertura.clienteId()).isEqualTo(cliente.getId());
        assertThat(abertura.funcionarioResponsavel()).isNull();

        SolicitacaoResponse orcada = solicitacaoService.alterarStatus(
                criada.id(),
                new AlterarStatusRequest("ORCADA", null, null, new BigDecimal("199.90"), null, null),
                funcJwt);

        HistoricoSolicitacaoResponse linhaOrcamento = ultimoHistorico(orcada.historico());
        assertThat(linhaOrcamento.funcionarioResponsavel()).isEqualTo("Técnico Teste");
        assertThat(linhaOrcamento.clienteNome()).isNull();
        assertThat(linhaOrcamento.clienteId()).isNull();

        SolicitacaoResponse rejeitada = solicitacaoService.alterarStatus(
                criada.id(),
                new AlterarStatusRequest("REJEITADA", null, "Caro demais.", null, null, null),
                clienteJwt);

        HistoricoSolicitacaoResponse linhaRejeicao = ultimoHistorico(rejeitada.historico());
        assertThat(linhaRejeicao.statusNovo()).isEqualTo("REJEITADA");
        assertThat(linhaRejeicao.clienteNome()).isEqualTo("Cliente Teste");
        assertThat(linhaRejeicao.funcionarioResponsavel()).isNull();
    }

    private static HistoricoSolicitacaoResponse ultimoHistorico(List<HistoricoSolicitacaoResponse> historico) {
        return historico.stream()
                .max(Comparator.comparing(HistoricoSolicitacaoResponse::dataAlteracao))
                .orElseThrow();
    }

    private static Cliente criarCliente(String cpf, String nome, String email) {
        Cliente c = new Cliente();
        c.setCpf(cpf);
        c.setNome(nome);
        c.setEmail(email);
        c.setSenha("x");
        c.setAtivo(true);
        return c;
    }

    private static Funcionario criarFuncionario(String nome, String email) {
        Funcionario f = new Funcionario();
        f.setNome(nome);
        f.setEmail(email);
        f.setSenha("x");
        f.setDataNascimento(LocalDate.of(1990, 1, 1));
        f.setAtivo(true);
        return f;
    }

    private static CategoriaEquipamento criarCategoria(String nome) {
        CategoriaEquipamento c = new CategoriaEquipamento();
        c.setNome(nome);
        c.setDescricao("d");
        c.setAtivo(true);
        return c;
    }

    private static Equipamento criarEquipamento(String nome, Cliente cliente, CategoriaEquipamento cat) {
        Equipamento e = new Equipamento();
        e.setNome(nome);
        e.setCliente(cliente);
        e.setCategoria(cat);
        e.setAtivo(true);
        return e;
    }
}
