// ==========================================
// 1. ENTIDADES BASE (DADOS INICIAIS)
// ==========================================

export const CLIENTES = [
  { id: 1, nome: 'João', cpf: '111.222.333-44', telefone: '(11) 91111-1111' },
  { id: 2, nome: 'José', cpf: '222.333.444-55', telefone: '(11) 92222-2222' },
  { id: 3, nome: 'Joana', cpf: '333.444.555-66', telefone: '(11) 93333-3333' },
  { id: 4, nome: 'Joaquina', cpf: '444.555.666-77', telefone: '(11) 94444-4444' }
];

export const FUNCIONARIOS = [
  { id: 1, nome: 'Maria', email: 'maria@empresa.com', cargo: 'Técnica Sênior' },
  { id: 2, nome: 'Mário', email: 'mario@empresa.com', cargo: 'Técnico Pleno' }
];

export const CATEGORIAS = [
  { id: 1, nome: 'Notebook' },
  { id: 2, nome: 'Desktop' },
  { id: 3, nome: 'Impressora' },
  { id: 4, nome: 'Mouse' },
  { id: 5, nome: 'Teclado' }
];

// ==========================================
// 2. MASSA DE TESTES (20 SOLICITAÇÕES)
// ==========================================

export const SOLICITACOES = [
  // --- ESTADO: ABERTA (Devem aparecer na Home - RF011) ---
  {
    id: 1001,
    clienteId: 1, // João
    categoriaId: 1, // Notebook
    produto: 'Notebook Dell Inspiron',
    descricaoDefeito: 'Tela piscando e desliga após 10 minutos.',
    estado: 'ABERTA',
    dataAbertura: '2026-04-06T09:00:00',
    historico: [{ dataHora: '2026-04-06T09:00:00', status: 'ABERTA', observacao: 'Solicitação criada pelo cliente.' }]
  },
  {
    id: 1002,
    clienteId: 2, // José
    categoriaId: 3, // Impressora
    produto: 'Impressora Epson EcoTank',
    descricaoDefeito: 'Não puxa o papel e luz vermelha piscando.',
    estado: 'ABERTA',
    dataAbertura: '2026-04-06T10:30:00',
    historico: [{ dataHora: '2026-04-06T10:30:00', status: 'ABERTA', observacao: 'Solicitação criada pelo cliente.' }]
  },
  {
    id: 1003,
    clienteId: 3, // Joana
    categoriaId: 2, // Desktop
    produto: 'PC Gamer Custom',
    descricaoDefeito: 'Computador liga mas não dá vídeo.',
    estado: 'ABERTA',
    dataAbertura: '2026-04-06T11:15:00',
    historico: [{ dataHora: '2026-04-06T11:15:00', status: 'ABERTA', observacao: 'Solicitação criada pelo cliente.' }]
  },

  // --- ESTADO: ORÇADA (Aguardando resposta do cliente) ---
  {
    id: 1004,
    clienteId: 4, // Joaquina
    categoriaId: 4, // Mouse
    produto: 'Mouse Logitech MX Master',
    descricaoDefeito: 'Scroll parou de funcionar.',
    estado: 'ORÇADA',
    dataAbertura: '2026-04-05T14:00:00',
    valorOrcamento: 85.00,
    historico: [
      { dataHora: '2026-04-05T14:00:00', status: 'ABERTA', observacao: 'Solicitação criada' },
      { dataHora: '2026-04-05T15:30:00', status: 'ORÇADA', funcionarioId: 1, observacao: 'Orçamento gerado por Maria.' }
    ]
  },
  {
    id: 1005,
    clienteId: 1, // João
    categoriaId: 5, // Teclado
    produto: 'Teclado Mecânico Redragon',
    descricaoDefeito: 'Teclas W, A, S, D não registram o clique.',
    estado: 'ORÇADA',
    dataAbertura: '2026-04-04T09:00:00',
    valorOrcamento: 120.00,
    historico: [
      { dataHora: '2026-04-04T09:00:00', status: 'ABERTA' },
      { dataHora: '2026-04-04T11:00:00', status: 'ORÇADA', funcionarioId: 2, observacao: 'Orçamento gerado por Mário.' }
    ]
  },

  // --- ESTADO: REJEITADA (Cliente não quis consertar) ---
  {
    id: 1006,
    clienteId: 2, // José
    categoriaId: 1, // Notebook
    produto: 'MacBook Air 2017',
    descricaoDefeito: 'Bateria estufada.',
    estado: 'REJEITADA',
    dataAbertura: '2026-03-25T10:00:00',
    valorOrcamento: 850.00,
    historico: [
      { dataHora: '2026-03-25T10:00:00', status: 'ABERTA' },
      { dataHora: '2026-03-25T14:00:00', status: 'ORÇADA', funcionarioId: 1 },
      { dataHora: '2026-03-26T09:00:00', status: 'REJEITADA', observacao: 'Cliente achou o valor muito alto.' }
    ]
  },

  // --- ESTADO: APROVADA (Pronto para Manutenção - RF014) ---
  {
    id: 1007,
    clienteId: 3, // Joana
    categoriaId: 2, // Desktop
    produto: 'Desktop HP Slim',
    descricaoDefeito: 'Muito lento e fazendo barulho alto na ventoinha.',
    estado: 'APROVADA',
    dataAbertura: '2026-04-03T08:00:00',
    valorOrcamento: 250.00,
    historico: [
      { dataHora: '2026-04-03T08:00:00', status: 'ABERTA' },
      { dataHora: '2026-04-03T10:00:00', status: 'ORÇADA', funcionarioId: 2 },
      { dataHora: '2026-04-04T08:30:00', status: 'APROVADA', observacao: 'Pagamento aprovado, aguardando conserto.' }
    ]
  },
  {
    id: 1008,
    clienteId: 4, // Joaquina
    categoriaId: 3, // Impressora
    produto: 'Impressora HP LaserJet',
    descricaoDefeito: 'Manchando as folhas de preto na lateral.',
    estado: 'APROVADA',
    dataAbertura: '2026-04-02T13:00:00',
    valorOrcamento: 180.00,
    historico: [
      { dataHora: '2026-04-02T13:00:00', status: 'ABERTA' },
      { dataHora: '2026-04-02T16:00:00', status: 'ORÇADA', funcionarioId: 1 },
      { dataHora: '2026-04-03T10:00:00', status: 'APROVADA' }
    ]
  },

  // --- ESTADO: REDIRECIONADA (RF015) ---
  {
    id: 1009,
    clienteId: 1, // João
    categoriaId: 1, // Notebook
    produto: 'Notebook Lenovo ThinkPad',
    descricaoDefeito: 'Não reconhece o SSD M.2.',
    estado: 'REDIRECIONADA',
    dataAbertura: '2026-04-01T09:00:00',
    valorOrcamento: 300.00,
    historico: [
      { dataHora: '2026-04-01T09:00:00', status: 'ABERTA' },
      { dataHora: '2026-04-01T11:00:00', status: 'ORÇADA', funcionarioId: 2 },
      { dataHora: '2026-04-02T09:00:00', status: 'APROVADA' },
      { dataHora: '2026-04-02T14:00:00', status: 'REDIRECIONADA', funcionarioOrigem: 2, funcionarioDestino: 1, observacao: 'Repassei para Maria pois exige solda BGA.' }
    ]
  },
  {
    id: 1010,
    clienteId: 2, // José
    categoriaId: 2, // Desktop
    produto: 'Workstation Dell',
    descricaoDefeito: 'Fonte queimou.',
    estado: 'REDIRECIONADA',
    dataAbertura: '2026-03-31T15:00:00',
    valorOrcamento: 450.00,
    historico: [
      { dataHora: '2026-03-31T15:00:00', status: 'ABERTA' },
      { dataHora: '2026-04-01T10:00:00', status: 'ORÇADA', funcionarioId: 1 },
      { dataHora: '2026-04-01T14:00:00', status: 'APROVADA' },
      { dataHora: '2026-04-01T16:00:00', status: 'REDIRECIONADA', funcionarioOrigem: 1, funcionarioDestino: 2, observacao: 'Mário é especialista nestas fontes.' }
    ]
  },

  // --- ESTADO: ARRUMADA (Aguardando cliente pagar/buscar) ---
  {
    id: 1011,
    clienteId: 3, // Joana
    categoriaId: 5, // Teclado
    produto: 'Teclado Apple Magic',
    descricaoDefeito: 'Caiu café, não liga.',
    estado: 'ARRUMADA',
    dataAbertura: '2026-03-28T10:00:00',
    valorOrcamento: 150.00,
    descricaoManutencao: 'Limpeza química da placa lógica.',
    orientacoesCliente: 'Evitar líquidos próximos ao periférico.',
    historico: [
      { dataHora: '2026-03-28T10:00:00', status: 'ABERTA' },
      { dataHora: '2026-03-28T14:00:00', status: 'ORÇADA', funcionarioId: 1 },
      { dataHora: '2026-03-29T09:00:00', status: 'APROVADA' },
      { dataHora: '2026-03-30T16:00:00', status: 'ARRUMADA', funcionarioId: 1 }
    ]
  },
  {
    id: 1012,
    clienteId: 4, // Joaquina
    categoriaId: 4, // Mouse
    produto: 'Mouse Razer DeathAdder',
    descricaoDefeito: 'Clique duplo (Double click).',
    estado: 'ARRUMADA',
    dataAbertura: '2026-03-27T11:00:00',
    valorOrcamento: 90.00,
    descricaoManutencao: 'Troca dos switches Omron originais.',
    orientacoesCliente: 'Garantia de 90 dias nos switches.',
    historico: [
      { dataHora: '2026-03-27T11:00:00', status: 'ABERTA' },
      { dataHora: '2026-03-27T13:00:00', status: 'ORÇADA', funcionarioId: 2 },
      { dataHora: '2026-03-28T10:00:00', status: 'APROVADA' },
      { dataHora: '2026-03-29T14:00:00', status: 'ARRUMADA', funcionarioId: 2 }
    ]
  },

  // --- ESTADO: PAGA (Aguardando Finalização pelo Funcionário - RF016) ---
  {
    id: 1013,
    clienteId: 1, // João
    categoriaId: 1, // Notebook
    produto: 'Notebook Acer Nitro 5',
    descricaoDefeito: 'Limpeza preventiva e troca de pasta térmica.',
    estado: 'PAGA',
    dataAbertura: '2026-03-25T09:00:00',
    valorOrcamento: 150.00,
    descricaoManutencao: 'Limpeza dos coolers e aplicação de pasta térmica prata.',
    orientacoesCliente: 'Refazer a limpeza anualmente.',
    historico: [
      { dataHora: '2026-03-25T09:00:00', status: 'ABERTA' },
      { dataHora: '2026-03-25T11:00:00', status: 'ORÇADA', funcionarioId: 1 },
      { dataHora: '2026-03-25T14:00:00', status: 'APROVADA' },
      { dataHora: '2026-03-26T15:00:00', status: 'ARRUMADA', funcionarioId: 1 },
      { dataHora: '2026-03-27T10:00:00', status: 'PAGA', observacao: 'Pagamento via PIX confirmado.' }
    ]
  },
  {
    id: 1014,
    clienteId: 2, // José
    categoriaId: 3, // Impressora
    produto: 'Impressora Brother Laser',
    descricaoDefeito: 'Atolamento de papel constante.',
    estado: 'PAGA',
    dataAbertura: '2026-03-24T14:00:00',
    valorOrcamento: 220.00,
    descricaoManutencao: 'Troca do rolo tracionador de papel.',
    orientacoesCliente: 'Usar folhas de boa qualidade sem umidade.',
    historico: [
      { dataHora: '2026-03-24T14:00:00', status: 'ABERTA' },
      { dataHora: '2026-03-25T10:00:00', status: 'ORÇADA', funcionarioId: 2 },
      { dataHora: '2026-03-25T11:30:00', status: 'APROVADA' },
      { dataHora: '2026-03-26T16:00:00', status: 'ARRUMADA', funcionarioId: 2 },
      { dataHora: '2026-03-28T09:00:00', status: 'PAGA', observacao: 'Pagamento via Cartão de Crédito.' }
    ]
  },

  // --- ESTADO: FINALIZADA (Prontas para Relatórios - RF019 e RF020) ---
  {
    id: 1015,
    clienteId: 3, // Joana
    categoriaId: 1, // Notebook
    produto: 'Notebook Positivo',
    descricaoDefeito: 'Quebrou a dobradiça da tela.',
    estado: 'FINALIZADA',
    dataAbertura: '2026-03-20T10:00:00',
    valorOrcamento: 180.00,
    descricaoManutencao: 'Reconstrução da carcaça com resina epóxi.',
    orientacoesCliente: 'Abrir a tela sempre segurando pelo meio.',
    historico: [
      { dataHora: '2026-03-20T10:00:00', status: 'ABERTA' },
      { dataHora: '2026-03-20T14:00:00', status: 'ORÇADA', funcionarioId: 1 },
      { dataHora: '2026-03-21T09:00:00', status: 'APROVADA' },
      { dataHora: '2026-03-22T16:00:00', status: 'ARRUMADA', funcionarioId: 1 },
      { dataHora: '2026-03-23T10:00:00', status: 'PAGA' },
      { dataHora: '2026-03-23T10:15:00', status: 'FINALIZADA', funcionarioId: 1, observacao: 'Aparelho entregue ao cliente.' }
    ]
  },
  {
    id: 1016,
    clienteId: 4, // Joaquina
    categoriaId: 2, // Desktop
    produto: 'Computador Montado',
    descricaoDefeito: 'Instalação de Windows e Office.',
    estado: 'FINALIZADA',
    dataAbertura: '2026-03-21T09:00:00',
    valorOrcamento: 120.00,
    descricaoManutencao: 'Formatação, backup e instalação de SO.',
    orientacoesCliente: 'Backup salvo na pasta Documentos.',
    historico: [
      { dataHora: '2026-03-21T09:00:00', status: 'ABERTA' },
      { dataHora: '2026-03-21T10:00:00', status: 'ORÇADA', funcionarioId: 2 },
      { dataHora: '2026-03-21T10:30:00', status: 'APROVADA' },
      { dataHora: '2026-03-21T16:00:00', status: 'ARRUMADA', funcionarioId: 2 },
      { dataHora: '2026-03-22T14:00:00', status: 'PAGA' },
      { dataHora: '2026-03-22T14:30:00', status: 'FINALIZADA', funcionarioId: 2, observacao: 'Aparelho entregue.' }
    ]
  },
  {
    id: 1017,
    clienteId: 1, // João
    categoriaId: 1, // Notebook
    produto: 'Notebook Samsung Expert',
    descricaoDefeito: 'Upgrade para SSD de 1TB.',
    estado: 'FINALIZADA',
    dataAbertura: '2026-03-22T11:00:00',
    valorOrcamento: 450.00, // Vai somar bastante no relatório de receitas!
    descricaoManutencao: 'Troca de HD por SSD NVMe 1TB e clonagem do sistema.',
    orientacoesCliente: 'HD antigo entregue em case externo.',
    historico: [
      { dataHora: '2026-03-22T11:00:00', status: 'ABERTA' },
      { dataHora: '2026-03-22T14:00:00', status: 'ORÇADA', funcionarioId: 1 },
      { dataHora: '2026-03-23T09:00:00', status: 'APROVADA' },
      { dataHora: '2026-03-24T15:00:00', status: 'ARRUMADA', funcionarioId: 1 },
      { dataHora: '2026-03-25T10:00:00', status: 'PAGA' },
      { dataHora: '2026-03-25T10:30:00', status: 'FINALIZADA', funcionarioId: 1 }
    ]
  },
  {
    id: 1018,
    clienteId: 2, // José
    categoriaId: 5, // Teclado
    produto: 'Teclado Multilaser',
    descricaoDefeito: 'Cabo USB com mau contato.',
    estado: 'FINALIZADA',
    dataAbertura: '2026-03-26T13:00:00',
    valorOrcamento: 45.00,
    descricaoManutencao: 'Refeita a solda do cabo USB na placa do teclado.',
    orientacoesCliente: 'Não dobrar o cabo próximo à base.',
    historico: [
      { dataHora: '2026-03-26T13:00:00', status: 'ABERTA' },
      { dataHora: '2026-03-26T14:00:00', status: 'ORÇADA', funcionarioId: 2 },
      { dataHora: '2026-03-26T15:00:00', status: 'APROVADA' },
      { dataHora: '2026-03-27T09:00:00', status: 'ARRUMADA', funcionarioId: 2 },
      { dataHora: '2026-03-27T16:00:00', status: 'PAGA' },
      { dataHora: '2026-03-27T16:15:00', status: 'FINALIZADA', funcionarioId: 2 }
    ]
  },
  {
    id: 1019,
    clienteId: 3, // Joana
    categoriaId: 3, // Impressora
    produto: 'Impressora Canon',
    descricaoDefeito: 'Erro de almofada de tinta cheia.',
    estado: 'FINALIZADA',
    dataAbertura: '2026-03-28T09:00:00',
    valorOrcamento: 130.00,
    descricaoManutencao: 'Troca da almofada absorvente e reset da EPROM.',
    orientacoesCliente: 'Impressora limpa e pronta para uso.',
    historico: [
      { dataHora: '2026-03-28T09:00:00', status: 'ABERTA' },
      { dataHora: '2026-03-28T11:00:00', status: 'ORÇADA', funcionarioId: 1 },
      { dataHora: '2026-03-28T13:00:00', status: 'APROVADA' },
      { dataHora: '2026-03-29T15:00:00', status: 'ARRUMADA', funcionarioId: 1 },
      { dataHora: '2026-03-30T10:00:00', status: 'PAGA' },
      { dataHora: '2026-03-30T10:10:00', status: 'FINALIZADA', funcionarioId: 1 }
    ]
  },
  {
    id: 1020,
    clienteId: 4, // Joaquina
    categoriaId: 2, // Desktop
    produto: 'Mini PC Intel NUC',
    descricaoDefeito: 'Bipe contínuo ao ligar.',
    estado: 'FINALIZADA',
    dataAbertura: '2026-03-30T14:00:00',
    valorOrcamento: 200.00,
    descricaoManutencao: 'Limpeza de contatos e troca de um módulo de memória RAM danificado.',
    orientacoesCliente: 'Peça antiga embalada junto.',
    historico: [
      { dataHora: '2026-03-30T14:00:00', status: 'ABERTA' },
      { dataHora: '2026-03-30T16:00:00', status: 'ORÇADA', funcionarioId: 2 },
      { dataHora: '2026-03-31T09:00:00', status: 'APROVADA' },
      { dataHora: '2026-04-01T11:00:00', status: 'ARRUMADA', funcionarioId: 2 },
      { dataHora: '2026-04-02T15:00:00', status: 'PAGA' },
      { dataHora: '2026-04-02T15:30:00', status: 'FINALIZADA', funcionarioId: 2 }
    ]
  }
];