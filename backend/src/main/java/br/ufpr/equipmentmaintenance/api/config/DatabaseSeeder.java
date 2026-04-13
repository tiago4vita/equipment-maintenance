package br.ufpr.equipmentmaintenance.api.config;

import br.ufpr.equipmentmaintenance.api.model.*;
import br.ufpr.equipmentmaintenance.api.repository.*;
import br.ufpr.equipmentmaintenance.api.util.SenhaUtil;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Configuration
@Profile("!test")
public class DatabaseSeeder implements CommandLineRunner {

    private final FuncionarioRepository funcionarioRepository;
    private final ClienteRepository clienteRepository;
    private final CategoriaRepository categoriaRepository;
    private final EquipamentoRepository equipamentoRepository;
    private final SolicitacaoRepository solicitacaoRepository;
    private final SenhaUtil senhaUtil;

    public DatabaseSeeder(FuncionarioRepository funcionarioRepository,
                          ClienteRepository clienteRepository,
                          CategoriaRepository categoriaRepository,
                          EquipamentoRepository equipamentoRepository,
                          SolicitacaoRepository solicitacaoRepository,
                          SenhaUtil senhaUtil) {
        this.funcionarioRepository = funcionarioRepository;
        this.clienteRepository = clienteRepository;
        this.categoriaRepository = categoriaRepository;
        this.equipamentoRepository = equipamentoRepository;
        this.solicitacaoRepository = solicitacaoRepository;
        this.senhaUtil = senhaUtil;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (categoriaRepository.count() == 0) {
            popularBancoDeDados();
        }
    }

    private void popularBancoDeDados() {
        List<CategoriaEquipamento> categorias = salvarCategorias();
        List<Funcionario> funcionarios = salvarFuncionarios();
        List<Cliente> clientes = salvarClientes();
        List<Equipamento> equipamentos = salvarEquipamentos(categorias, clientes);
        salvarSolicitacoes(clientes, equipamentos, funcionarios);
    }

    private List<CategoriaEquipamento> salvarCategorias() {
        return categoriaRepository.saveAll(List.of(
                criarCategoria("Notebook", "Computadores portáteis e ultrabooks"),
                criarCategoria("Desktop", "Computadores de mesa e estações de trabalho"),
                criarCategoria("Impressora", "Impressoras a laser, jato de tinta e térmicas"),
                criarCategoria("Mouse", "Mouses ópticos e periféricos de precisão"),
                criarCategoria("Teclado", "Teclados mecânicos e de membrana")
        ));
    }

    private CategoriaEquipamento criarCategoria(String nome, String descricao) {
        CategoriaEquipamento categoria = new CategoriaEquipamento();
        categoria.setNome(nome);
        categoria.setDescricao(descricao);
        categoria.setAtivo(true);
        return categoria;
    }

    private List<Funcionario> salvarFuncionarios() {
        return funcionarioRepository.saveAll(List.of(
                criarFuncionario("Maria Oliveira", "maria@empresa.com", "123456", LocalDate.of(1985, 5, 20)),
                criarFuncionario("Mário Santos", "mario@empresa.com", "123456", LocalDate.of(1992, 8, 15)),
                criarFuncionario("Carlos Silva", "carlos@empresa.com", "123456", LocalDate.of(1988, 11, 10))
        ));
    }

    private Funcionario criarFuncionario(String nome, String email, String senha, LocalDate dataNascimento) {
        Funcionario funcionario = new Funcionario();
        funcionario.setNome(nome);
        funcionario.setEmail(email);
        funcionario.setSenha(senhaUtil.criptografar(senha));
        funcionario.setDataNascimento(dataNascimento);
        funcionario.setAtivo(true);
        return funcionario;
    }

    private List<Cliente> salvarClientes() {
        return clienteRepository.saveAll(List.of(
                criarCliente("João Pereira", "joao@email.com", "11111111111", "41999999991"),
                criarCliente("José Almeida", "jose@email.com", "22222222222", "41999999992"),
                criarCliente("Joana Costa", "joana@email.com", "33333333333", "41999999993"),
                criarCliente("Joaquina Lima", "joaquina@email.com", "44444444444", "41999999994"),
                criarCliente("Pedro Rocha", "pedro@email.com", "55555555555", "41999999995")
        ));
    }

    private Cliente criarCliente(String nome, String email, String cpf, String telefone) {
        Cliente cliente = new Cliente();
        cliente.setNome(nome);
        cliente.setEmail(email);
        cliente.setCpf(cpf);
        cliente.setSenha(senhaUtil.criptografar("1234"));
        cliente.setTelefone(telefone);
        cliente.setCep("80000000");
        cliente.setRua("Rua Ficticia");
        cliente.setNumero("123");
        cliente.setCidade("Curitiba");
        cliente.setEstado("PR");
        cliente.setAtivo(true);
        return cliente;
    }

    private List<Equipamento> salvarEquipamentos(List<CategoriaEquipamento> categorias, List<Cliente> clientes) {
        return equipamentoRepository.saveAll(List.of(
                criarEquipamento("Notebook Inspiron", "Dell", "3501", "SN12345", categorias.get(0), clientes.get(0)),
                criarEquipamento("PC Gamer", "Custom", "ATX-500", "SN98765", categorias.get(1), clientes.get(1)),
                criarEquipamento("EcoTank L3150", "Epson", "L3150", "SN55555", categorias.get(2), clientes.get(2)),
                criarEquipamento("Mouse G203", "Logitech", "G203", "SN11111", categorias.get(3), clientes.get(3)),
                criarEquipamento("Teclado K120", "Logitech", "K120", "SN22222", categorias.get(4), clientes.get(4)),
                criarEquipamento("MacBook Air", "Apple", "M1 2020", "SN33333", categorias.get(0), clientes.get(1)),
                criarEquipamento("LaserJet Pro", "HP", "M15w", "SN44444", categorias.get(2), clientes.get(0))
        ));
    }

    private Equipamento criarEquipamento(String nome, String marca, String modelo, String serial, CategoriaEquipamento categoria, Cliente cliente) {
        Equipamento equipamento = new Equipamento();
        equipamento.setNome(nome);
        equipamento.setMarca(marca);
        equipamento.setModelo(modelo);
        equipamento.setNumeroSerie(serial);
        equipamento.setCategoria(categoria);
        equipamento.setCliente(cliente);
        equipamento.setAtivo(true);
        return equipamento;
    }

    private void salvarSolicitacoes(List<Cliente> clientes, List<Equipamento> equipamentos, List<Funcionario> funcionarios) {
        Random random = new Random();
        LocalDateTime dataBase = LocalDateTime.now().minusDays(60);
        StatusSolicitacao[] statusPossiveis = {
                StatusSolicitacao.ABERTA, StatusSolicitacao.ORCADA, StatusSolicitacao.REJEITADA,
                StatusSolicitacao.APROVADA, StatusSolicitacao.ARRUMADA, StatusSolicitacao.PAGA,
                StatusSolicitacao.FINALIZADA
        };

        for (int i = 1; i <= 35; i++) {
            Cliente cliente = clientes.get(random.nextInt(clientes.size()));
            Equipamento equipamento = equipamentos.stream()
                    .filter(e -> e.getCliente().getId().equals(cliente.getId()))
                    .findFirst()
                    .orElse(equipamentos.get(random.nextInt(equipamentos.size())));
            Funcionario funcionario = funcionarios.get(random.nextInt(funcionarios.size()));
            StatusSolicitacao statusAlvo = statusPossiveis[random.nextInt(statusPossiveis.length)];
            LocalDateTime dataEvento = dataBase.plusDays(i);

            Solicitacao solicitacao = new Solicitacao();
            solicitacao.setCliente(equipamento.getCliente());
            solicitacao.setEquipamento(equipamento);
            solicitacao.setDescricaoProblema("Equipamento apresentando falhas intermitentes. Chamado #" + i);
            solicitacao.setStatus(statusAlvo);

            solicitacao.getHistorico().add(gerarHistorico(solicitacao, StatusSolicitacao.ABERTA, StatusSolicitacao.ABERTA, "Abertura inicial da solicitação pelo cliente", null, solicitacao.getCliente()));

            if (statusAlvo != StatusSolicitacao.ABERTA) {
                solicitacao.setValorOrcamento(BigDecimal.valueOf(120.50 + (i * 12.25)));
                solicitacao.getHistorico().add(gerarHistorico(solicitacao, StatusSolicitacao.ABERTA, StatusSolicitacao.ORCADA, "Orçamento técnico gerado no sistema", funcionario, null));
            }

            if (statusAlvo == StatusSolicitacao.REJEITADA) {
                solicitacao.getHistorico().add(gerarHistorico(solicitacao, StatusSolicitacao.ORCADA, StatusSolicitacao.REJEITADA, "Cliente não aprovou o valor do orçamento", null, solicitacao.getCliente()));
            }

            if (statusAlvo == StatusSolicitacao.APROVADA || statusAlvo == StatusSolicitacao.ARRUMADA || statusAlvo == StatusSolicitacao.PAGA || statusAlvo == StatusSolicitacao.FINALIZADA) {
                solicitacao.getHistorico().add(gerarHistorico(solicitacao, StatusSolicitacao.ORCADA, StatusSolicitacao.APROVADA, "Orçamento aprovado pelo cliente via portal", null, solicitacao.getCliente()));
            }

            if (statusAlvo == StatusSolicitacao.ARRUMADA || statusAlvo == StatusSolicitacao.PAGA || statusAlvo == StatusSolicitacao.FINALIZADA) {
                solicitacao.setDescricaoManutencao("Substituição de componentes defeituosos, limpeza interna e testes de estresse finalizados.");
                solicitacao.setOrientacoesCliente("Manter em ambiente com temperatura controlada e evitar umidade excessiva.");
                solicitacao.getHistorico().add(gerarHistorico(solicitacao, StatusSolicitacao.APROVADA, StatusSolicitacao.ARRUMADA, "Serviço de manutenção executado e testado", funcionario, null));
            }

            if (statusAlvo == StatusSolicitacao.PAGA || statusAlvo == StatusSolicitacao.FINALIZADA) {
                solicitacao.setDataHoraPagamento(dataEvento.plusDays(2));
                solicitacao.getHistorico().add(gerarHistorico(solicitacao, StatusSolicitacao.ARRUMADA, StatusSolicitacao.PAGA, "Confirmação de recebimento do pagamento", null, solicitacao.getCliente()));
            }

            if (statusAlvo == StatusSolicitacao.FINALIZADA) {
                solicitacao.setDataHoraFinalizacao(dataEvento.plusDays(4));
                solicitacao.getHistorico().add(gerarHistorico(solicitacao, StatusSolicitacao.PAGA, StatusSolicitacao.FINALIZADA, "Equipamento devolvido ao cliente e chamado encerrado", funcionario, null));
            }

            solicitacaoRepository.save(solicitacao);
        }
    }

    private HistoricoSolicitacao gerarHistorico(Solicitacao solicitacao, StatusSolicitacao anterior, StatusSolicitacao novo, String observacao, Funcionario funcionario, Cliente cliente) {
        HistoricoSolicitacao historico = new HistoricoSolicitacao();
        historico.setSolicitacao(solicitacao);
        historico.setStatusAnterior(anterior);
        historico.setStatusNovo(novo);
        historico.setObservacao(observacao);
        historico.setFuncionarioResponsavel(funcionario);
        historico.setCliente(cliente);
        return historico;
    }
}