# Decisões de projeto (suposições documentadas)

Conforme o enunciado, suposições não definidas no texto oficial devem ser documentadas. Este arquivo registra as decisões da equipe para a integração frontend ↔ backend.

**Referência dos requisitos:** `.cursor/requirements.md` (enunciado *Manutenção de Equipamentos* — UFPR SEPT TADS Web-II).

## Índice de RFs documentados

| RF | Título resumido |
|----|-----------------|
| RF001 | Autocadastro do cliente |
| RF002 | Login |
| RF003 | Página inicial do cliente |
| RF004 | Solicitação de manutenção |
| RF005 | Mostrar orçamento |
| RF006 | Aprovar serviço |
| RF007 | Rejeitar serviço |
| RF008 | Visualizar serviço |
| RF009 | Resgatar serviço |
| RF010 | Pagar serviço |
| RF011 | Página inicial do funcionário |
| RF012 | Efetuar orçamento |
| RF013 | Listar solicitações (funcionário) |
| RF014 | Efetuar manutenção |
| RF015 | Redirecionar manutenção |
| RF016 | Finalizar solicitação |
| RF017 | CRUD de categorias |
| RF018 | CRUD de funcionários |
| RF019 / RF020 | Relatórios PDF |

---

## RF001 — Autocadastro do cliente

- A senha gerada aleatoriamente possui **4 dígitos numéricos** (conforme enunciado), gerada no backend (`SenhaUtil`) e enviada por e-mail via `EmailService` no momento do autocadastro. O cliente nunca digita a senha no formulário.
- O endereço persistido inclui **CEP, logradouro (campo `rua`), número, bairro, complemento, cidade e estado**, atendendo literalmente "Endereço completo" do enunciado. Cidade e estado **não** foram normalizados (FK), conforme exceção autorizada pelo enunciado. `bairro` é obrigatório; `complemento` é opcional.
- A consulta ViaCEP é feita no frontend (`ViaCepService`) e preenche logradouro e bairro antes do envio. Mesmo que o usuário ajuste manualmente, todos os campos vão separados para o backend (não há concatenação de logradouro + bairro).
- Máscaras aplicadas no frontend: CPF (`000.000.000-00`), CEP (`00000-000`) e telefone (`(00) 00000-0000`).
- **Migração de esquema:** em desenvolvimento o H2 com `ddl-auto=update` cria as colunas `bairro` e `complemento` automaticamente. Em produção (MySQL/PostgreSQL) aplicar:
  ```sql
  ALTER TABLE cliente ADD COLUMN bairro VARCHAR(100);
  ALTER TABLE cliente ADD COLUMN complemento VARCHAR(150);
  ```

---

## RF002 — Autenticação JWT

- Após login bem-sucedido, `POST /api/auth/login` retorna `LoginResponse { id, nome, email, perfil, token }`.
- O frontend armazena o token em `localStorage` (chave `token`) e envia em todas as chamadas via interceptor (`Authorization: Bearer <token>`).
- Apenas `RF001 (POST /api/clientes)`, `RF002 (POST /api/auth/login)` e endpoints públicos de health check ficam fora do guard.
- O perfil retornado (`CLIENTE` ou `FUNCIONARIO`) é usado pelo `authGuard` para impedir acesso cruzado às áreas.

---

## RF003 — Página inicial do cliente

- Rota: `/user/maintenance` (`MaintenancePageComponent`). Dados via `GET /api/solicitacoes/cliente/{clienteId}`, ordenados no backend por `dataCriacao` **ascendente**; o frontend reordena com `compareBrDateTime` para manter a mesma regra na UI.
- Cada linha exibe **data/hora** (`formatBrDateTime`), **descrição do equipamento** truncada em **30 caracteres** (`solicitation-row.truncatedDevice`) e **status** com cores por estado.
- **Visualizar (RF008):** link “Visualizar” em toda linha abre o modal com histórico completo.
- **Ações por status** (`solicitation-row`):
  - `ORCADA`: botões **Aprovar** e **Rejeitar** (ambos abrem RF005 — ver RF003/RF005 abaixo).
  - `APROVADA`: sem botão de ação.
  - `REJEITADA`: **Resgatar Serviço** (RF009).
  - `ARRUMADA`: **Pagar Serviço** (RF010).
  - Demais estados: sem botão de ação dedicado; o enunciado cita “Visualizar serviço”, implementado pelo link **Visualizar** já presente em todas as linhas (equivalente funcional).

---

## RF004 — Solicitação de manutenção (extensão do modelo)

**Contexto:** O enunciado exige que a solicitação contenha **descrição do equipamento (texto livre)**, **categoria do equipamento** e **descrição do defeito**, mas a implementação inicial vinculava obrigatoriamente um `equipamentoId` previamente cadastrado.

**Decisão adotada:**

1. A entidade `Solicitacao` foi estendida com dois campos persistidos diretamente:
   - `descricaoEquipamento` (texto livre, NOT NULL, máx. 200 caracteres) — corresponde literalmente à “descrição do equipamento” do enunciado.
   - `categoria` (FK obrigatória para `CategoriaEquipamento`) — corresponde à “categoria do equipamento”.
2. O `equipamentoId` (vínculo a um `Equipamento` previamente cadastrado) tornou-se **opcional**, mantido apenas para retrocompatibilidade com massas de teste e cenários em que o cliente já possua o equipamento cadastrado.
3. O cliente cria uma solicitação enviando `clienteId`, `categoriaId`, `descricaoEquipamento` e `descricaoProblema` no `POST /api/solicitacoes`. Status inicial **ABERTA** com `dataCriacao` automática.
4. O serviço de relatórios (`RelatorioService`) agrupa receitas por `solicitacao.categoria.nome` (RF020), com fallback para `equipamento.categoria.nome` quando a solicitação ainda não tiver categoria explícita (massa antiga).
5. UI: modal em modo `creation` na página RF003; categorias ativas vêm de `GET /api/categorias`.

**Alternativa não adotada:** manter dois fluxos (cadastro de equipamento + abertura) e exigir `equipamentoId` em RF004. Foi descartada porque obrigaria mais um RF/tela não previsto no enunciado.

---

## RF005 — Mostrar orçamento

- Implementado no componente compartilhado `SolicitationVisualizationModalComponent` (modo `orcada`).
- Exibe equipamento, categoria, defeito, valor orçado em destaque e botões **Aprovar** / **Rejeitar**.
- Os botões da **linha** RF003 (ORÇADA) **não alteram status diretamente**; redirecionam para este mesmo modal (RF005), conforme o enunciado.

---

## RF006 — Aprovar serviço

- No modal RF005, **Aprovar** dispara `PATCH /api/solicitacoes/{id}/status` com `novoStatus=APROVADA` (transição validada em `SolicitacaoTransicao`).
- Após sucesso, o modal passa ao modo `aprovada` e exibe a mensagem **"Serviço Aprovado no Valor R$ xxxx"** (formatação `pt-BR` / BRL). O botão **Ok** fecha o modal; o usuário permanece na listagem RF003.

---

## RF007 — Rejeitar serviço

- No modal RF005, **Rejeitar** abre um passo intermediário com `textarea` para o **motivo da rejeição** (campo obrigatório na prática de UX; enviado como `observacao` no `AlterarStatusRequest`).
- Após confirmar, status **REJEITADA** e o modal exibe **"Serviço Rejeitado"** com o valor riscado, conforme enunciado.
- O motivo fica registrado no **histórico** (`HistoricoSolicitacao.observacao`) com o cliente como ator.

---

## RF008 — Visualizar serviço

- O link **Visualizar** na linha RF003 abre o mesmo modal com `showsHistory=true`: faixa horizontal com cada etapa do `historico` da API (`HistoricoSolicitacaoResponse`), mostrando **data/hora** e **autor** (`formatHistoricoAutor` — funcionário ou cliente conforme quem executou a ação).
- Botões de ação do modal seguem o status atual (aprovar, rejeitar, resgatar, pagar, etc.), atendendo “botões de ação conforme necessário”.

---

## RF009 — Resgatar serviço

- Na linha REJEITADA ou no modal, **Resgatar** pede confirmação (`ConfirmDialogComponent`) e envia `novoStatus=APROVADA` com `observacao` opcional `"Resgate do serviço"`.
- Transição permitida: `REJEITADA → APROVADA` apenas para perfil **CLIENTE** (`SolicitacaoTransicao`).
- Após o resgate, a UI volta ao estado **Aprovada** (amarelo); o status wire continua `APROVADA` (não há status `RESGATADA` no backend). O histórico registra a transição com observação.

---

## RF010 — Pagar serviço

- Em **ARRUMADA**, o modal exibe valor em destaque e **Pagar Serviço**; confirmação simula o pagamento com `novoStatus=PAGA`.
- O backend grava `dataHoraPagamento` (`LocalDateTime.now()`) ao aplicar PAGA. Não há integração com gateway de pagamento real (simulação conforme enunciado).

---

## RF011 — Página inicial do funcionário

- Rota: `/staff/home`. `GET /api/solicitacoes` **sem** parâmetro `status` retorna somente solicitações **ABERTA**.
- Colunas: data/hora, **nome do cliente**, descrição do produto (truncada em 30 caracteres), ação **Efetuar Orçamento** → navega para `/staff/budget/:id` (RF012).

---

## RF012 — Efetuar orçamento

- Tela dedicada `StaffBudgetComponent` (`/staff/budget/:id`). Carrega solicitação via `GET /api/solicitacoes/{id}`.
- Envio: `PATCH .../status` com `novoStatus=ORCADA` e `valorOrcamento` > 0. Funcionário logado registrado em `HistoricoSolicitacao.funcionarioResponsavel`.

---

## RF013 — Listagem para funcionário

- Endpoint único `GET /api/solicitacoes` aceita:
  - `status` opcional. Quando **omitido**, retorna apenas `ABERTA` (RF011). Para listar tudo (RF013), enviar `status=todos`.
  - `periodo`: `todas` (padrão), `hoje`, `intervalo`. Com `intervalo`, exigem-se `dataInicio` e `dataFim` (ISO `yyyy-MM-dd`).
- Ordenação: `dataCriacao` ascendente.
- Solicitações no estado `REDIRECIONADA` só aparecem para o funcionário **destino atual** do redirecionamento (regra aplicada no service).
- Cores de status na tela `staff-all-requests` alinhadas ao enunciado (cinza, marrom, vermelho, amarelo, roxo, azul, laranja, verde) via classes Tailwind e tokens em `cliente-integracao.model.ts` / `solicitation-states.mdc`.
- Ações na listagem: **Efetuar Orçamento** (ABERTA), **Efetuar Manutenção** (APROVADA/REDIRECIONADA), **Finalizar Solicitação** (PAGA).

---

## Mapeamento de status (`ORCADA` sem cedilha)

- O enum `StatusSolicitacao` no backend usa identificadores ASCII (`ORCADA`, não `ORÇADA`) por conveniência de serialização e parsing JPA/JSON.
- O frontend mantém o **rótulo de exibição com cedilha** (`Orçada`) através do mapa `STATUS_LABELS` em `cliente-integracao.model.ts`. O wire continua usando `ORCADA`.
- Mesmo princípio para a coloração de RF013, padronizada em `STATUS_BG_CLASSES` e na regra `solicitation-states.mdc`.

---

## RF014 — Efetuar manutenção

- Tela `StaffMaintenanceComponent` (`/staff/maintenance/:id`). Duas saídas:
  1. **Efetuar manutenção:** `novoStatus=ARRUMADA` com `descricaoManutencao` e `orientacoesCliente` obrigatórios (validação backend).
  2. **Redirecionar:** navega para RF015 (`/staff/redirect/:id`).
- Transições permitidas ao funcionário: `APROVADA→ARRUMADA`, `APROVADA→REDIRECIONADA`, `REDIRECIONADA→ARRUMADA`, `REDIRECIONADA→REDIRECIONADA` (novo destino). Quem recebe redirecionamento deve ser o destino atual para agir (`funcionarioDestinoAtual`).

---

## RF015 — Redirecionamento

- Tela `StaffRedirectComponent` (`/staff/redirect/:id`).
- O dropdown de “Novo responsável” lista todos os funcionários ativos **exceto o usuário logado** (regra aplicada no `staff-redirect`, e replicada no backend para defesa em profundidade).
- O `funcionarioDestinoId` é enviado no `PATCH /api/solicitacoes/{id}/status` junto com `novoStatus=REDIRECIONADA`. O motivo (opcional) vai em `observacao`. Histórico registra origem e destino.

---

## RF016 — Finalizar solicitação

- Na listagem RF013 (status PAGA), botão **Finalizar Solicitação** chama `PATCH` com `novoStatus=FINALIZADA` ou abre `StaffFinishComponent` (`/staff/finish/:id`) para revisão antes de confirmar.
- Backend grava `dataHoraFinalizacao` e funcionário responsável no histórico.

---

## RF017 — CRUD de categorias de equipamento

- Endpoints REST em `CategoriaController` (`/api/categorias`): listagem pública para clientes (somente `ativo=true`), CRUD completo restrito a **FUNCIONARIO**.
- **Exclusão:** soft-delete (`ativo=false`); categorias inativas não aparecem no dropdown de RF004.
- Frontend: `StaffCategoriesComponent` (`/staff/categories`) com confirmação antes de remover.

---

## RF018 — CRUD de funcionários

- O backend impede remover o último funcionário ativo e impede que o funcionário remova a si mesmo. O frontend replica essa regra para feedback imediato (botão desabilitado + mensagem).
- Senha é obrigatória ao criar um funcionário e **opcional** na atualização (mantém a senha atual quando vazia).

---

## RF019 / RF020 — Relatórios PDF

- `GET /api/relatorios/receitas-periodo?dataInicio=&dataFim=` retorna `application/pdf`.
- `GET /api/relatorios/receitas-categoria` retorna `application/pdf`.
- **RF019:** `dataInicio` e/ou `dataFim` podem ser omitidos; o backend usa limites abertos (1970 e 2999) para incluir todo o histórico de pagamentos no intervalo efetivo. Receita considera solicitações **PAGA** e **FINALIZADA**, agrupadas por **dia** do `dataHoraPagamento`.
- **RF020:** receita **desde o início** agrupada por **categoria** da solicitação (`solicitacao.categoria`, com fallback legado para equipamento).
- Para preview na tela, há os endpoints irmãos `/dados` que retornam JSON (`ReceitaDiariaResponse`, `ReceitaCategoriaResponse`) com `valorTotal: BigDecimal`.
- O frontend baixa o PDF via `HttpClient.get` com `responseType: 'blob'` e dispara o download criando um `<a download>` em memória.

---

## Soft-delete

- Toda exclusão (categoria, funcionário, equipamento, cliente) usa o campo `ativo = false`. Não há `DELETE` físico.
- O frontend pede confirmação (`confirm(...)`) antes de qualquer remoção, conforme exigido pelos requisitos não-funcionais.

---

## Produção

- Defina a variável de ambiente **`JWT_SECRET`** com uma chave forte (≥ 256 bits para HS256).
- Ative o perfil **`prod`** (`spring.profiles.active=prod`) para desabilitar o console H2 e migrar para PostgreSQL/MySQL (`application-prod.properties`).
- Em desenvolvimento, o frontend usa `proxy.conf.json` para encaminhar `/api/*` ao backend em `localhost:8080`.
