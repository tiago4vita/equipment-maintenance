package br.ufpr.equipmentmaintenance.api.bootstrap;

import br.ufpr.equipmentmaintenance.api.model.*;
import br.ufpr.equipmentmaintenance.api.repository.*;
import br.ufpr.equipmentmaintenance.api.util.SenhaUtil;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Massa de dados mínima do enunciado: 2 funcionários (Maria e Mário), 4 clientes (João, José, Joana, Joaquina),
 * 5 categorias, ≥20 solicitações com estados e histórico. Idempotente: não recarrega se já existir maria@empresa.com.
 */
@Component
@Order(100)
@ConditionalOnProperty(name = "app.seed-demo-data", havingValue = "true", matchIfMissing = true)
public class DemoDataLoader implements CommandLineRunner {

    /** E-mail da primeira funcionária — usado só para detectar seed já aplicado. */
    private static final String EMAIL_MARCADOR_SEED = "maria@empresa.com";

    private final SenhaUtil senhaUtil;
    private final FuncionarioRepository funcionarioRepository;
    private final ClienteRepository clienteRepository;
    private final CategoriaRepository categoriaRepository;
    private final EquipamentoRepository equipamentoRepository;
    private final SolicitacaoRepository solicitacaoRepository;

    public DemoDataLoader(SenhaUtil senhaUtil,
                          FuncionarioRepository funcionarioRepository,
                          ClienteRepository clienteRepository,
                          CategoriaRepository categoriaRepository,
                          EquipamentoRepository equipamentoRepository,
                          SolicitacaoRepository solicitacaoRepository) {
        this.senhaUtil = senhaUtil;
        this.funcionarioRepository = funcionarioRepository;
        this.clienteRepository = clienteRepository;
        this.categoriaRepository = categoriaRepository;
        this.equipamentoRepository = equipamentoRepository;
        this.solicitacaoRepository = solicitacaoRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (funcionarioRepository.findByEmail(EMAIL_MARCADOR_SEED).isPresent()) {
            return;
        }

        Funcionario maria = funcionario("Maria", EMAIL_MARCADOR_SEED, LocalDate.of(1990, 5, 15));
        Funcionario mario = funcionario("Mário", "mario@empresa.com", LocalDate.of(1985, 11, 22));
        maria = funcionarioRepository.save(maria);
        mario = funcionarioRepository.save(mario);

        List<CategoriaEquipamento> cats = new ArrayList<>();
        cats.add(categoria("Notebook", "Computadores portáteis"));
        cats.add(categoria("Desktop", "Computadores de mesa"));
        cats.add(categoria("Impressora", "Impressoras e multifuncionais"));
        cats.add(categoria("Mouse", "Dispositivos apontadores"));
        cats.add(categoria("Teclado", "Teclados"));
        for (int i = 0; i < cats.size(); i++) {
            cats.set(i, categoriaRepository.save(cats.get(i)));
        }

        Cliente joao = cliente("11111111111", "João", "joao@demo.seed", "41911111111");
        Cliente jose = cliente("22222222222", "José", "jose@demo.seed", "41922222222");
        Cliente joana = cliente("33333333333", "Joana", "joana@demo.seed", "41933333333");
        Cliente joaquina = cliente("44444444444", "Joaquina", "joaquina@demo.seed", "41944444444");
        joao = clienteRepository.save(joao);
        jose = clienteRepository.save(jose);
        joana = clienteRepository.save(joana);
        joaquina = clienteRepository.save(joaquina);

        List<Cliente> clientes = List.of(joao, jose, joana, joaquina);

        List<Equipamento> equipamentos = new ArrayList<>();
        int n = 0;
        for (Cliente c : clientes) {
            for (int k = 0; k < 6; k++) {
                CategoriaEquipamento cat = cats.get(n % cats.size());
                Equipamento e = equipamento(
                        c,
                        cat,
                        nomeEquipamentoDemonstracao(cat, n),
                        marcaDemonstracao(n),
                        "Ref-" + (100 + n),
                        "SN-" + String.format("%05d", n + 1));
                equipamentos.add(equipamentoRepository.save(e));
                n++;
                if (equipamentos.size() >= 22) {
                    break;
                }
            }
            if (equipamentos.size() >= 22) {
                break;
            }
        }

        StatusSolicitacao[] alvo = {
                StatusSolicitacao.ABERTA, StatusSolicitacao.ABERTA, StatusSolicitacao.ABERTA,
                StatusSolicitacao.ORCADA, StatusSolicitacao.ORCADA, StatusSolicitacao.ORCADA,
                StatusSolicitacao.ORCADA, StatusSolicitacao.ORCADA,
                StatusSolicitacao.APROVADA, StatusSolicitacao.APROVADA,
                StatusSolicitacao.REJEITADA, StatusSolicitacao.REJEITADA,
                StatusSolicitacao.REDIRECIONADA, StatusSolicitacao.REDIRECIONADA,
                StatusSolicitacao.ARRUMADA, StatusSolicitacao.ARRUMADA,
                StatusSolicitacao.PAGA, StatusSolicitacao.PAGA,
                StatusSolicitacao.FINALIZADA, StatusSolicitacao.FINALIZADA, StatusSolicitacao.FINALIZADA,
                StatusSolicitacao.ABERTA
        };

        LocalDateTime base = LocalDateTime.of(2024, 2, 1, 8, 30);
        for (int i = 0; i < alvo.length; i++) {
            Equipamento eq = equipamentos.get(i);
            Cliente cli = eq.getCliente();
            LocalDateTime t0 = base.plusDays(i % 20).plusHours(i % 9).plusMinutes(i * 7L);
            Solicitacao s = new Solicitacao();
            s.setEquipamento(eq);
            s.setCliente(cli);
            s.setDescricaoProblema("Defeito relatado #" + (i + 1) + ": equipamento apresenta falha intermitente.");
            s.setDataCriacao(t0);
            preencherPorEstado(s, alvo[i], maria, mario, t0);
            solicitacaoRepository.save(s);
        }
    }

    private void preencherPorEstado(
            Solicitacao s,
            StatusSolicitacao alvo,
            Funcionario mariaFunc,
            Funcionario marioFunc,
            LocalDateTime t0) {

        BigDecimal orc = BigDecimal.valueOf(120 + (s.getDescricaoProblema().length() % 80)).setScale(2, java.math.RoundingMode.HALF_UP);
        Funcionario origem = mariaFunc;
        Funcionario outro = marioFunc;

        switch (alvo) {
            case ABERTA -> {
                s.setStatus(StatusSolicitacao.ABERTA);
                s.getHistorico().add(hist(s, StatusSolicitacao.ABERTA, StatusSolicitacao.ABERTA, null, null, s.getCliente(),
                        "Abertura da solicitação registrada pelo cliente.", t0));
            }
            case ORCADA -> {
                s.setValorOrcamento(orc);
                s.setStatus(StatusSolicitacao.ORCADA);
                s.getHistorico().add(hist(s, StatusSolicitacao.ABERTA, StatusSolicitacao.ABERTA, null, null, s.getCliente(),
                        "Abertura da solicitação registrada pelo cliente.", t0));
                s.getHistorico().add(hist(s, StatusSolicitacao.ABERTA, StatusSolicitacao.ORCADA, origem, null, null,
                        "Orçamento efetuado.", t0.plusHours(2)));
            }
            case APROVADA -> {
                s.setValorOrcamento(orc);
                s.setStatus(StatusSolicitacao.APROVADA);
                s.getHistorico().add(hist(s, StatusSolicitacao.ABERTA, StatusSolicitacao.ABERTA, null, null, s.getCliente(),
                        "Abertura.", t0));
                s.getHistorico().add(hist(s, StatusSolicitacao.ABERTA, StatusSolicitacao.ORCADA, origem, null, null,
                        "Orçamento.", t0.plusHours(1)));
                s.getHistorico().add(hist(s, StatusSolicitacao.ORCADA, StatusSolicitacao.APROVADA, null, null, s.getCliente(),
                        "Cliente aprovou o serviço.", t0.plusHours(5)));
            }
            case REJEITADA -> {
                s.setValorOrcamento(orc);
                s.setStatus(StatusSolicitacao.REJEITADA);
                s.getHistorico().add(hist(s, StatusSolicitacao.ABERTA, StatusSolicitacao.ABERTA, null, null, s.getCliente(),
                        "Abertura.", t0));
                s.getHistorico().add(hist(s, StatusSolicitacao.ABERTA, StatusSolicitacao.ORCADA, marioFunc, null, null,
                        "Orçamento.", t0.plusHours(1)));
                s.getHistorico().add(hist(s, StatusSolicitacao.ORCADA, StatusSolicitacao.REJEITADA, null, null, s.getCliente(),
                        "Cliente rejeitou: valor acima do esperado.", t0.plusHours(3)));
            }
            case REDIRECIONADA -> {
                s.setValorOrcamento(orc);
                s.setFuncionarioDestinoAtual(outro);
                s.setStatus(StatusSolicitacao.REDIRECIONADA);
                s.getHistorico().add(hist(s, StatusSolicitacao.ABERTA, StatusSolicitacao.ABERTA, null, null, s.getCliente(),
                        "Abertura.", t0));
                s.getHistorico().add(hist(s, StatusSolicitacao.ABERTA, StatusSolicitacao.ORCADA, origem, null, null,
                        "Orçamento.", t0.plusHours(1)));
                s.getHistorico().add(hist(s, StatusSolicitacao.ORCADA, StatusSolicitacao.APROVADA, null, null, s.getCliente(),
                        "Aprovação.", t0.plusHours(2)));
                s.getHistorico().add(hist(s, StatusSolicitacao.APROVADA, StatusSolicitacao.REDIRECIONADA, origem, outro, null,
                        "Redirecionamento para outro especialista.", t0.plusHours(4)));
            }
            case ARRUMADA -> {
                s.setValorOrcamento(orc);
                s.setDescricaoManutencao("Substituição de componente e testes de carga.");
                s.setOrientacoesCliente("Evitar uso contínuo por 24h; contato em caso de novos sintomas.");
                s.setStatus(StatusSolicitacao.ARRUMADA);
                s.getHistorico().add(hist(s, StatusSolicitacao.ABERTA, StatusSolicitacao.ABERTA, null, null, s.getCliente(),
                        "Abertura.", t0));
                s.getHistorico().add(hist(s, StatusSolicitacao.ABERTA, StatusSolicitacao.ORCADA, origem, null, null,
                        "Orçamento.", t0.plusHours(1)));
                s.getHistorico().add(hist(s, StatusSolicitacao.ORCADA, StatusSolicitacao.APROVADA, null, null, s.getCliente(),
                        "Aprovação.", t0.plusHours(2)));
                s.getHistorico().add(hist(s, StatusSolicitacao.APROVADA, StatusSolicitacao.ARRUMADA, origem, null, null,
                        "Manutenção concluída.", t0.plusDays(1)));
            }
            case PAGA -> {
                s.setValorOrcamento(orc);
                s.setDescricaoManutencao("Manutenção concluída.");
                s.setOrientacoesCliente("Orientações gerais de uso.");
                LocalDateTime tpag = t0.plusDays(2);
                s.setDataHoraPagamento(tpag);
                s.setStatus(StatusSolicitacao.PAGA);
                s.getHistorico().add(hist(s, StatusSolicitacao.ABERTA, StatusSolicitacao.ABERTA, null, null, s.getCliente(),
                        "Abertura.", t0));
                s.getHistorico().add(hist(s, StatusSolicitacao.ABERTA, StatusSolicitacao.ORCADA, marioFunc, null, null,
                        "Orçamento.", t0.plusHours(2)));
                s.getHistorico().add(hist(s, StatusSolicitacao.ORCADA, StatusSolicitacao.APROVADA, null, null, s.getCliente(),
                        "Aprovação.", t0.plusHours(5)));
                s.getHistorico().add(hist(s, StatusSolicitacao.APROVADA, StatusSolicitacao.ARRUMADA, origem, null, null,
                        "Manutenção.", t0.plusDays(1)));
                s.getHistorico().add(hist(s, StatusSolicitacao.ARRUMADA, StatusSolicitacao.PAGA, null, null, s.getCliente(),
                        "Pagamento registrado.", tpag));
            }
            case FINALIZADA -> {
                s.setValorOrcamento(orc);
                s.setDescricaoManutencao("Serviço finalizado com sucesso.");
                s.setOrientacoesCliente("Garantia de 90 dias.");
                LocalDateTime tpag = t0.plusDays(2);
                LocalDateTime tfim = t0.plusDays(3);
                s.setDataHoraPagamento(tpag);
                s.setDataHoraFinalizacao(tfim);
                s.setStatus(StatusSolicitacao.FINALIZADA);
                s.getHistorico().add(hist(s, StatusSolicitacao.ABERTA, StatusSolicitacao.ABERTA, null, null, s.getCliente(),
                        "Abertura.", t0));
                s.getHistorico().add(hist(s, StatusSolicitacao.ABERTA, StatusSolicitacao.ORCADA, origem, null, null,
                        "Orçamento.", t0.plusHours(1)));
                s.getHistorico().add(hist(s, StatusSolicitacao.ORCADA, StatusSolicitacao.APROVADA, null, null, s.getCliente(),
                        "Aprovação.", t0.plusHours(3)));
                s.getHistorico().add(hist(s, StatusSolicitacao.APROVADA, StatusSolicitacao.ARRUMADA, marioFunc, null, null,
                        "Manutenção.", t0.plusDays(1)));
                s.getHistorico().add(hist(s, StatusSolicitacao.ARRUMADA, StatusSolicitacao.PAGA, null, null, s.getCliente(),
                        "Pagamento.", tpag));
                s.getHistorico().add(hist(s, StatusSolicitacao.PAGA, StatusSolicitacao.FINALIZADA, origem, null, null,
                        "Solicitação finalizada.", tfim));
            }
            default -> throw new IllegalStateException("Estado não tratado no seed: " + alvo);
        }
    }

    private HistoricoSolicitacao hist(
            Solicitacao s,
            StatusSolicitacao anterior,
            StatusSolicitacao novo,
            Funcionario responsavel,
            Funcionario destino,
            Cliente atorCliente,
            String obs,
            LocalDateTime quando) {
        HistoricoSolicitacao h = new HistoricoSolicitacao();
        h.setSolicitacao(s);
        h.setStatusAnterior(anterior);
        h.setStatusNovo(novo);
        h.setFuncionarioResponsavel(responsavel);
        h.setFuncionarioDestino(destino);
        h.setCliente(atorCliente);
        h.setObservacao(obs);
        h.setDataAlteracao(quando);
        return h;
    }

    private Funcionario funcionario(String nome, String email, LocalDate nasc) {
        Funcionario f = new Funcionario();
        f.setNome(nome);
        f.setEmail(email);
        f.setDataNascimento(nasc);
        f.setSenha(senhaUtil.criptografar("1234"));
        return f;
    }

    private CategoriaEquipamento categoria(String nome, String desc) {
        CategoriaEquipamento c = new CategoriaEquipamento();
        c.setNome(nome);
        c.setDescricao(desc);
        return c;
    }

    private Cliente cliente(String cpf, String nome, String email, String tel) {
        Cliente c = new Cliente();
        c.setCpf(cpf);
        c.setNome(nome);
        c.setEmail(email);
        c.setTelefone(tel);
        c.setCep("80010000");
        c.setRua("Rua da Universidade");
        c.setNumero("1000");
        c.setCidade("Curitiba");
        c.setEstado("PR");
        c.setSenha(senhaUtil.criptografar("1234"));
        return c;
    }

    /**
     * Nome legível na listagem (RF003/RF011): categoria + marca fictícia, ex. "Notebook Dell — #1".
     */
    private static String nomeEquipamentoDemonstracao(CategoriaEquipamento cat, int indice) {
        return cat.getNome() + " " + marcaDemonstracao(indice) + " — #" + (indice + 1);
    }

    private static String marcaDemonstracao(int indice) {
        String[] marcas = {"Dell", "HP", "Lenovo", "Samsung", "Logitech", "LG", "Asus", "Acer"};
        return marcas[indice % marcas.length];
    }

    private Equipamento equipamento(Cliente cli, CategoriaEquipamento cat, String nome, String marca, String modelo, String sn) {
        Equipamento e = new Equipamento();
        e.setCliente(cli);
        e.setCategoria(cat);
        e.setNome(nome);
        e.setMarca(marca);
        e.setModelo(modelo);
        e.setNumeroSerie(sn);
        return e;
    }
}
