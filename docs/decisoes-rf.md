# Decisões de projeto (suposições documentadas)

Conforme o enunciado, suposições não definidas no texto oficial devem ser documentadas. Este arquivo registra as decisões da equipe para a integração frontend ↔ backend.

## RF004 — Solicitação de manutenção (extensão do modelo)

**Contexto:** O enunciado exige que a solicitação contenha **descrição do equipamento (texto livre)**, **categoria do equipamento** e **descrição do defeito**, mas a implementação inicial vinculava obrigatoriamente um `equipamentoId` previamente cadastrado.

**Decisão adotada:**

1. A entidade `Solicitacao` foi estendida com dois campos persistidos diretamente:
   - `descricaoEquipamento` (texto livre, NOT NULL, máx. 200 caracteres) — corresponde literalmente à “descrição do equipamento” do enunciado.
   - `categoria` (FK obrigatória para `CategoriaEquipamento`) — corresponde à “categoria do equipamento”.
2. O `equipamentoId` (vínculo a um `Equipamento` previamente cadastrado) tornou-se **opcional**, mantido apenas para retrocompatibilidade com massas de teste e cenários em que o cliente já possua o equipamento cadastrado.
3. Como o backend passou a expor `descricaoEquipamento` e `categoriaId/categoriaNome` no `SolicitacaoResponse`, o cliente cria uma solicitação enviando apenas `clienteId`, `categoriaId`, `descricaoEquipamento` e `descricaoProblema` no `POST /api/solicitacoes`.
4. O serviço de relatórios (`RelatorioService`) passou a agrupar receitas por `solicitacao.categoria.nome` (RF020), com fallback para `equipamento.categoria.nome` quando a solicitação ainda não tiver categoria explícita (massa antiga).

**Alternativa não adotada:** manter dois fluxos (cadastro de equipamento + abertura) e exigir `equipamentoId` em RF004. Foi descartada porque obrigaria mais um RF/tela não previsto no enunciado e dificultaria a implementação literal do RF004.

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

## RF003 / RF005 — Fluxo de aprovar/rejeitar pelo cliente

- Os botões **Aprovar** e **Rejeitar** na linha da tela RF003 (quando o estado é ORÇADA) **não executam ação direta**. Ambos abrem a tela **Mostrar Orçamento (RF005)** no modal, onde o cliente vê o valor orçado em destaque junto com os botões **Aprovar** e **Rejeitar** definitivos, atendendo literalmente o enunciado: _"Botão Aprovar/Rejeitar Serviço, que apresenta a tela de Mostrar orçamento (RF005)"._
- RF006: a mensagem exibida após aprovar é exatamente **"Serviço Aprovado no Valor R$ xxxx"** (com iniciais maiúsculas, conforme enunciado). O clique em **Ok** fecha o modal e o usuário permanece na listagem do RF003.
- RF007: a mensagem após rejeitar é exatamente **"Serviço Rejeitado"**.

## RF002 — Autenticação JWT

- Após login bem-sucedido, `POST /api/auth/login` retorna `LoginResponse { id, nome, email, perfil, token }`.
- O frontend armazena o token em `localStorage` (chave `token`) e envia em todas as chamadas via interceptor (`Authorization: Bearer <token>`).
- Apenas `RF001 (POST /api/clientes)`, `RF002 (POST /api/auth/login)` e endpoints públicos de health check ficam fora do guard.
- O perfil retornado (`CLIENTE` ou `FUNCIONARIO`) é usado pelo `authGuard` para impedir acesso cruzado às áreas.

## Mapeamento de status (`ORCADA` sem cedilha)

- O enum `StatusSolicitacao` no backend usa identificadores ASCII (`ORCADA`, não `ORÇADA`) por conveniência de serialização e parsing JPA/JSON.
- O frontend mantém o **rótulo de exibição com cedilha** (`Orçada`) através do mapa `STATUS_LABELS` em `cliente-integracao.model.ts`. O wire continua usando `ORCADA`.
- Mesmo princípio para a coloração de RF013, padronizada em `STATUS_BG_CLASSES` e na regra `solicitation-states.mdc`.

## RF013 — Listagem para funcionário

- Endpoint único `GET /api/solicitacoes` aceita:
  - `status` opcional. Quando **omitido**, retorna apenas `ABERTA` (RF011). Para listar tudo (RF013), enviar `status=todos`.
  - `periodo`: `todas` (padrão), `hoje`, `intervalo`. Com `intervalo`, exigem-se `dataInicio` e `dataFim` (ISO `yyyy-MM-dd`).
- Solicitações no estado `REDIRECIONADA` só aparecem para o funcionário **destino atual** do redirecionamento (regra aplicada no service).

## RF015 — Redirecionamento

- O dropdown de “Novo responsável” lista todos os funcionários ativos **exceto o usuário logado** (regra aplicada no `staff-redirect`, e replicada no backend para defesa em profundidade).
- O `funcionarioDestinoId` é enviado no `PATCH /api/solicitacoes/{id}/status` junto com `novoStatus=REDIRECIONADA`. O motivo (opcional) vai em `observacao`.

## RF019 / RF020 — Relatórios PDF

- `GET /api/relatorios/receitas-periodo?dataInicio=&dataFim=` retorna `application/pdf`.
- `GET /api/relatorios/receitas-categoria` retorna `application/pdf`.
- Para preview na tela, há os endpoints irmãos `/dados` que retornam JSON (`ReceitaDiariaResponse`, `ReceitaCategoriaResponse`) com `valorTotal: BigDecimal`.
- O frontend baixa o PDF via `HttpClient.get` com `responseType: 'blob'` e dispara o download criando um `<a download>` em memória.

## RF018 — CRUD de funcionários

- O backend impede remover o último funcionário ativo e impede que o funcionário remova a si mesmo. O frontend replica essa regra para feedback imediato (botão desabilitado + mensagem).
- Senha é obrigatória ao criar um funcionário e **opcional** na atualização (mantém a senha atual quando vazia).

## Soft-delete

- Toda exclusão (categoria, funcionário, equipamento, cliente) usa o campo `ativo = false`. Não há `DELETE` físico.
- O frontend pede confirmação (`confirm(...)`) antes de qualquer remoção, conforme exigido pelos requisitos não-funcionais.

## Produção

- Defina a variável de ambiente **`JWT_SECRET`** com uma chave forte (≥ 256 bits para HS256).
- Ative o perfil **`prod`** (`spring.profiles.active=prod`) para desabilitar o console H2 e migrar para PostgreSQL/MySQL (`application-prod.properties`).
- Em desenvolvimento, o frontend usa `proxy.conf.json` para encaminhar `/api/*` ao backend em `localhost:8080`.
