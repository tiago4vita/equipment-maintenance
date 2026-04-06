package br.ufpr.equipmentmaintenance.api.config;

import br.ufpr.equipmentmaintenance.api.model.*;
import br.ufpr.equipmentmaintenance.api.repository.*;
import br.ufpr.equipmentmaintenance.api.util.SenhaUtil;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Configuration
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
                criarCategoria("Notebook"),
                criarCategoria("Desktop"),
                criarCategoria("Impressora"),
                criarCategoria("Mouse"),
                criarCategoria("Teclado")
        ));
    }

    private CategoriaEquipamento criarCategoria(String nome) {
        CategoriaEquipamento categoria = new CategoriaEquipamento();
        categoria.setNome(nome);
        return categoria;
    }

    private List<Funcionario> salvarFuncionarios() {
        return funcionarioRepository.saveAll(List.of(
                criarFuncionario("Maria", "maria@empresa.com", "123456"),
                criarFuncionario("Mário", "mario@empresa.com", "123456")
        ));
    }

    private Funcionario criarFuncionario(String nome, String email, String senha) {
        Funcionario funcionario = new Funcionario();
        funcionario.setNome(nome);
        funcionario.setEmail(email);
        funcionario.setSenha(senhaUtil.criptografar(senha));
        funcionario.setDataNascimento(LocalDate.of(1990, 1, 1));
        funcionario.setAtivo(true);
        return funcionario;
    }

    private List<Cliente> salvarClientes() {
        return clienteRepository.saveAll(List.of(
                criarCliente("João", "joao@email.com", "11111111111"),
                criarCliente("José", "jose@email.com", "22222222222"),
                criarCliente("Joana", "joana@email.com", "33333333333"),
                criarCliente("Joaquina", "joaquina@email.com", "44444444444")
        ));
    }

    private Cliente criarCliente(String nome, String email, String cpf) {
        Cliente cliente = new Cliente();
        cliente.setNome(nome);
        cliente.setEmail(email);
        cliente.setCpf(cpf);
        cliente.setSenha(senhaUtil.criptografar("1234"));
        cliente.setTelefone("41999999999");
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
                criarEquipamento("Dell Inspiron", categorias.get(0), clientes.get(0)),
                criarEquipamento("PC Gamer", categorias.get(1), clientes.get(1)),
                criarEquipamento("Epson L3150", categorias.get(2), clientes.get(2)),
                criarEquipamento("Logitech G203", categorias.get(3), clientes.get(3)),
                criarEquipamento("Teclado Mecânico", categorias.get(4), clientes.get(0))
        ));
    }

    private Equipamento criarEquipamento(String nome, CategoriaEquipamento categoria, Cliente cliente) {
        Equipamento equipamento = new Equipamento();
        equipamento.setNome(nome); 
        equipamento.setCategoria(categoria);
        equipamento.setCliente(cliente);
        return equipamento;
    }

    private void salvarSolicitacoes(List<Cliente> clientes, List<Equipamento> equipamentos, List<Funcionario> funcionarios) {
        StatusSolicitacao[] statusArray = StatusSolicitacao.values();
        Random random = new Random();
        LocalDateTime dataBase = LocalDateTime.now();

        for (int i = 1; i <= 25; i++) {
            Cliente cliente = clientes.get(random.nextInt(clientes.size()));
            Equipamento equipamento = equipamentos.stream()
                    .filter(e -> e.getCliente().getId().equals(cliente.getId()))
                    .findFirst()
                    .orElse(equipamentos.get(0));
            Funcionario funcionario = funcionarios.get(random.nextInt(funcionarios.size()));
            StatusSolicitacao statusAtual = statusArray[random.nextInt(statusArray.length)];

            Solicitacao solicitacao = new Solicitacao();
            solicitacao.setCliente(equipamento.getCliente());
            solicitacao.setEquipamento(equipamento);
            solicitacao.setDescricaoProblema("Problema relatado número " + i);
            solicitacao.setStatus(statusAtual);

            if (statusAtual != StatusSolicitacao.ABERTA) {
                solicitacao.setValorOrcamento(BigDecimal.valueOf(100.0 + i * 10));
            }
            
        
 //           if (statusAtual == StatusSolicitacao.ARRUMADA || statusAtual == StatusSolicitacao.PAGA || statusAtual == StatusSolicitacao.FINALIZADA) {
 //              solicitacao.setDescricaoManutencao("Manutenção finalizada conforme diagnóstico.");
 //               solicitacao.setOrientacoesCliente("Evitar umidade.");
 //           }

 //           if (statusAtual == StatusSolicitacao.PAGA) {
 //               solicitacao.setDataHoraPagamento(dataBase.plusDays(i));
  //          }
            
 //           if (statusAtual == StatusSolicitacao.FINALIZADA) {
 //               solicitacao.setDataHoraPagamento(dataBase.plusDays(i).minusHours(2));
 //               solicitacao.setDataHoraFinalizacao(dataBase.plusDays(i));
  //          }

            HistoricoSolicitacao historico = new HistoricoSolicitacao();
            historico.setSolicitacao(solicitacao);
            historico.setStatusAnterior(StatusSolicitacao.ABERTA);
            historico.setStatusNovo(statusAtual);
            historico.setObservacao("Processo registrado via inicialização automática.");
            historico.setFuncionarioResponsavel(funcionario);

            solicitacao.getHistorico().add(historico);
            solicitacaoRepository.save(solicitacao);
        }
    }
}