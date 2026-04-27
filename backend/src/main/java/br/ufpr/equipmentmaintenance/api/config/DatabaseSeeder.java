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
            System.out.println("[SEEDER] Iniciando carga de dados no banco de dados...");
            popularBancoDeDados();
            System.out.println("[SEEDER] Carga de dados finalizada com sucesso!");
        } else {
            System.out.println("[SEEDER] Banco de dados já populado. Ignorando seed.");
        }
    }

    private void popularBancoDeDados() {
        List<CategoriaEquipamento> categorias = salvarCategorias();
        System.out.println("[SEEDER] " + categorias.size() + " categorias cadastradas.");

        List<Funcionario> funcionarios = salvarFuncionarios();
        System.out.println("[SEEDER] " + funcionarios.size() + " funcionários cadastrados.");

        List<Cliente> clientes = salvarClientes();
        System.out.println("[SEEDER] " + clientes.size() + " clientes cadastrados.");

        List<Equipamento> equipamentos = salvarEquipamentos(categorias, clientes);
        System.out.println("[SEEDER] " + equipamentos.size() + " equipamentos cadastrados.");

        salvarSolicitacoes(clientes, equipamentos, funcionarios);
    }

    private List<CategoriaEquipamento> salvarCategorias() {
        return categoriaRepository.saveAll(List.of(
                criarCategoria("Notebook", "Computadores portáteis e ultrabooks"),
                criarCategoria("Desktop", "Computadores de mesa e estações de trabalho"),
                criarCategoria("Impressora", "Impressoras a laser, jato de tinta e térmicas"),
                criarCategoria("Mouse", "Mouses ópticos e periféricos de precisão"),
                criarCategoria("Teclado", "Teclados mecânicos e de membrana"),
                // Novas linhas adicionadas
                criarCategoria("Monitor", "Monitores LED, LCD e Ultrawide"),
                criarCategoria("Nobreak", "Equipamentos de proteção de energia e baterias"),
                criarCategoria("Servidor", "Servidores em rack e torre para datacenters"),
                criarCategoria("Projetor", "Projetores de vídeo corporativos e educacionais"),
                criarCategoria("Switch", "Equipamentos de rede e roteadores corporativos")
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
                criarFuncionario("Carlos Silva", "carlos@empresa.com", "123456", LocalDate.of(1988, 11, 10)),
                // Novas linhas adicionadas
                criarFuncionario("Ana Beatriz", "ana@empresa.com", "123456", LocalDate.of(1995, 2, 28)),
                criarFuncionario("Paulo Mendes", "paulo@empresa.com", "123456", LocalDate.of(1980, 10, 5)),
                criarFuncionario("Fernanda Souza", "fernanda@empresa.com", "123456", LocalDate.of(1998, 7, 12))
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
                criarCliente("Pedro Rocha", "pedro@email.com", "55555555555", "41999999995"),
                // Novas linhas adicionadas
                criarCliente("Lucas Martins", "lucas@email.com", "66666666666", "41999999996"),
                criarCliente("Mariana Dias", "mariana@email.com", "77777777777", "41999999997"),
                criarCliente("Roberto Alves", "roberto@email.com", "88888888888", "41999999998"),
                criarCliente("Camila Ribeiro", "camila@email.com", "99999999999", "41999999999"),
                criarCliente("Bruno Fernandes", "bruno@email.com", "00000000000", "41999999900")
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
                criarEquipamento("LaserJet Pro", "HP", "M15w", "SN44444", categorias.get(2), clientes.get(0)),
                // Novas linhas adicionadas
                criarEquipamento("Monitor UltraSharp", "Dell", "U2720Q", "SN55511", categorias.get(5), clientes.get(5)),
                criarEquipamento("Nobreak APC", "Schneider", "BR1500G", "SN66622", categorias.get(6), clientes.get(6)),
                criarEquipamento("Projetor PowerLite", "Epson", "X39", "SN77733", categorias.get(8), clientes.get(7)),
                criarEquipamento("Switch Catalyst", "Cisco", "2960", "SN88844", categorias.get(9), clientes.get(8)),
                criarEquipamento("Servidor ProLiant", "HP", "DL380", "SN99955", categorias.get(7), clientes.get(9))
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
        
        // Adicionado o status REDIRECIONADA para simular todos os fluxos
        StatusSolicitacao[] statusPossiveis = {
                StatusSolicitacao.ABERTA, StatusSolicitacao.ORCADA, StatusSolicitacao.REJEITADA,
                StatusSolicitacao.APROVADA, StatusSolicitacao.ARRUMADA, StatusSolicitacao.PAGA,
                StatusSolicitacao.FINALIZADA, StatusSolicitacao.REDIRECIONADA
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

            if (statusAlvo == StatusSolicitacao.APROVADA || statusAlvo == StatusSolicitacao.ARRUMADA || statusAlvo == StatusSolicitacao.PAGA || statusAlvo == StatusSolicitacao.FINALIZADA || statusAlvo == StatusSolicitacao.REDIRECIONADA) {
                solicitacao.getHistorico().add(gerarHistorico(solicitacao, StatusSolicitacao.ORCADA, StatusSolicitacao.APROVADA, "Orçamento aprovado pelo cliente via portal", null, solicitacao.getCliente()));
            }

            // Lógica nova para testar o requisito RF015 (Redirecionamento)
            if (statusAlvo == StatusSolicitacao.REDIRECIONADA) {
                Funcionario colegaDestino = funcionarios.get((funcionarios.indexOf(funcionario) + 1) % funcionarios.size());
                solicitacao.setFuncionarioDestinoAtual(colegaDestino);
                solicitacao.getHistorico().add(gerarHistorico(solicitacao, StatusSolicitacao.APROVADA, StatusSolicitacao.REDIRECIONADA, "Serviço redirecionado devido à alta complexidade técnica", funcionario, colegaDestino, null));
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
        System.out.println("[SEEDER] 35 solicitações de teste geradas com sucesso.");
    }

    private HistoricoSolicitacao gerarHistorico(Solicitacao solicitacao, StatusSolicitacao anterior, StatusSolicitacao novo, String observacao, Funcionario funcionario, Cliente cliente) {
        return gerarHistorico(solicitacao, anterior, novo, observacao, funcionario, null, cliente);
    }

    // Sobrecarga de método útil para incluir o funcionário de destino nos casos de Redirecionamento
    private HistoricoSolicitacao gerarHistorico(Solicitacao solicitacao, StatusSolicitacao anterior, StatusSolicitacao novo, String observacao, Funcionario responsavel, Funcionario destino, Cliente cliente) {
        HistoricoSolicitacao historico = new HistoricoSolicitacao();
        historico.setSolicitacao(solicitacao);
        historico.setStatusAnterior(anterior);
        historico.setStatusNovo(novo);
        historico.setObservacao(observacao);
        historico.setFuncionarioResponsavel(responsavel);
        historico.setFuncionarioDestino(destino);
        historico.setCliente(cliente);
        return historico;
    }
}