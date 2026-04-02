# Decisões de projeto (suposições documentadas)

Conforme o enunciado, suposições não definidas no texto oficial devem ser documentadas. Este arquivo registra as decisões da equipe.

## RF004 — Solicitação de manutenção e cadastro de equipamento

**Contexto:** O enunciado exige que a solicitação contenha descrição do equipamento, categoria e descrição do defeito, mas não define um RF separado para “cadastro de equipamento” pelo cliente.

**Decisão adotada:**

1. O **equipamento** é uma entidade própria (`Equipamento`), vinculada a um **cliente** e a uma **categoria** (`CategoriaEquipamento`).
2. O fluxo no sistema é em **duas etapas**:
   - **Etapa A — cadastro do equipamento:** o cliente autenticado registra o equipamento via `POST /api/equipamentos` (informando `clienteId`, `categoriaId`, nome, marca, modelo, etc.).
   - **Etapa B — abertura da solicitação:** o cliente cria a solicitação via `POST /api/solicitacoes`, informando `equipamentoId`, `clienteId` e `descricaoProblema` (defeito).
3. A **“descrição do equipamento”** exigida pelo RF004 é atendida pelos dados do equipamento já cadastrado (nome/marca/modelo); a **categoria** vem do vínculo do equipamento com a categoria; a **descrição do defeito** é o campo `descricaoProblema` da solicitação.

**Alternativa não adotada:** enviar todos os dados do equipamento e do defeito em uma única requisição de solicitação (criaria duplicação de modelo ou lógica mais complexa). A opção em duas etapas mantém normalização e reutilização de equipamentos em novas solicitações.

---

## Autenticação (RF002)

**Decisão:** Após login bem-sucedido, a API retorna um **token JWT** no campo `token` de `LoginResponse`. As demais rotas (exceto login, autocadastro de cliente e health check) exigem o cabeçalho `Authorization: Bearer <token>`. O cliente da API (navegador, Postman, app Angular etc.) deve armazenar o token e reenviá-lo nas requisições protegidas.

## Listagem de solicitações (funcionário — RF013)

**Parâmetros em** `GET /api/solicitacoes`:

| Parâmetro | Valores | Descrição |
|-----------|---------|-----------|
| `periodo` | `todas` (padrão), `hoje`, `intervalo` | Filtro pela **data de abertura** (`dataCriacao`). Com `intervalo`, envie também `dataInicio` e `dataFim` (ISO `yyyy-MM-dd`). |
| `status` | ex.: `ABERTA`, `ORCADA`, … | Opcional; filtra por estado atual. |
| `dataInicio`, `dataFim` | datas | Obrigatórios quando `periodo=intervalo`. |

Solicitações **REDIRECIONADAS** só aparecem para o funcionário que é o **destino atual** (`funcionarioDestinoAtual` na entidade), exceto quando o filtro de status restringe outros casos.

## Relatórios PDF (RF019 / RF020)

- `GET /api/relatorios/receitas?dataInicio=&dataFim=` — receitas por dia no período (datas opcionais; usa `dataHoraPagamento`).
- `GET /api/relatorios/receitas-por-categoria` — receitas agrupadas por categoria de equipamento.

Ambos exigem perfil **FUNCIONARIO** e retornam `application/pdf`.

## Produção

- Defina a variável de ambiente **`JWT_SECRET`** com uma chave forte (≥ 256 bits para HS256).
- Ative o perfil **`prod`** (`spring.profiles.active=prod`) para desabilitar o console H2 (`application-prod.properties`).
