<img width="859" height="333" alt="image" src="https://github.com/user-attachments/assets/6f52898c-cd6d-4184-944c-e78bee423a51" />

TECNOLOGIA EM ANÁLISE E DESEVOLVIMENTO DE SISTEMAS UFPR
DISCIPLINA DE DESENVOLVIMENTO WEB II 

# PROJETO TADS SYSTEM - MANUTENÇÃO DE EQUIPAMENTOS
GUIA DE PRIMEIRA EXECUÇÃO

## Equipe
Larissa Ribeiro Borges GRR20204495
Luiz Michel Soares de Souza GRR20193907
Marcos Eduardo de Mello Lopes GRR20231009 
Murilo Santana Cardoso GRR20234187
Tiago Pareja Vita GRR20234975

Aplicação full stack com:
- Frontend em Angular standalone v21
- Estilizacao com Tailwind CSS
- Backend Spring Boot com API REST

## 1. Visão geral

Este guia mostra como rodar o sistema pela primeira vez em ambiente local, incluindo frontend e backend, com verificacoes rapidas para confirmar que tudo esta funcionando.

## 2. Pré-requisitos e versões

Use estas versoes recomendadas:
- Node.js: `20.x` ou `22.x`
- npm: `10.x`
- Java JDK: `17`
- Maven: `3.9+`

Verifique no terminal:

```bash
node -v
npm -v
java -version
mvn -v
npx ng version
```

## 3. Estrutura do projeto

No diretório raiz `equipment-maintenance`, a estrutura principal é:
- `frontend/`: Angular + Tailwind
- `backend/`: Spring Boot API REST

## 4. Primeiro start (ordem recomendada)

### 4.0 (Opcional, mas recomendado) Suba a stack auxiliar

```bash
docker compose up -d
```

Isso inicia MySQL (porta 3306) e Adminer (`http://localhost:8081`).

Para capturar no navegador os e-mails de senha do autocadastro (RF001) via MailHog, suba também o perfil `mail` (SMTP em `localhost:1025`, UI em `http://localhost:8025`):

```bash
docker compose up -d --profile mail
```

O MailHog fica em perfil separado para evitar falha quando a porta 1025 já estiver ocupada (por exemplo por outro contêiner `mailhog`). Sem MailHog, o backend continua funcionando: a falha de envio é logada como WARN e o cadastro segue normalmente — a senha gerada é exibida via toast no frontend e devolvida no corpo da resposta da API.

### 4.1 Inicie o backend

No primeiro terminal:

```bash
cd backend
mvn spring-boot:run
```

Quando subir corretamente, a API deve responder em:
- `http://localhost:8080/api/status`

### 4.2 Inicie o frontend

No segundo terminal:

```bash
cd frontend
npm install
npm start
```

Abra no navegador:
- `http://localhost:4200`

## 5. Como a integração funciona

- O frontend chama `GET /api/status`
- O arquivo `frontend/proxy.conf.json` redireciona `/api/*` para `http://localhost:8080`
- O backend permite CORS a partir de `http://localhost:4200` via Spring Security (`SecurityConfig`)

## 6. Comandos uteis

### 6.1 Frontend

```bash
npm start
npm run build
npm test
```

### 6.2 Backend

```bash
mvn spring-boot:run
mvn test
mvn package
```

## 7. Arquivos principais

- `frontend/src/app/app.ts`: componente raiz standalone
- `frontend/src/app/status-api.service.ts`: chamada HTTP da API
- `frontend/proxy.conf.json`: proxy local para backend
- `backend/src/main/java/br/ufpr/equipmentmaintenance/api/status/StatusController.java`: endpoint REST
- `backend/src/main/java/br/ufpr/equipmentmaintenance/api/config/SecurityConfig.java`: segurança da API (JWT) e configuração CORS

## 8. Solução de problemas

- `mvn` nao reconhecido:
  - Instale Maven e adicione ao `PATH`
  - Reabra o terminal e execute `mvn -v`
- Porta `8080` ocupada:
  - Encerre o processo atual da porta, ou altere `server.port` em `backend/src/main/resources/application.properties`
- Porta `4200` ocupada:
  - Encerre outro processo Angular em execucao
- Frontend sem conectar na API:
  - Confirme backend ativo em `http://localhost:8080`
  - Teste `http://localhost:8080/api/status`
- `docker compose` falha em MailHog com `Bind for 0.0.0.0:1025 failed: port is already allocated`:
  - Outro MailHog (ou serviço) já usa a porta. Parar o contêiner que ocupa 1025 (`docker ps` e `docker stop <nome>`) ou subir só MySQL/Adminer com `docker compose up -d` sem `--profile mail`.
- Seed de dados (Maria, Mário, João, José, Joana, Joaquina) não aparece após login:
  - O `DemoDataLoader` é idempotente por `maria@empresa.com`. Em bancos MySQL com volume antigo (versões anteriores criavam Maria com clientes diferentes), o loader detecta a Maria existente e não recarrega.
  - Em desenvolvimento, faça o reset do volume MySQL para repopular a partir de uma base limpa:
    ```bash
    docker compose down -v
    docker compose up -d
    # opcional: MailHog → acrescente --profile mail na linha acima
    cd backend && mvn spring-boot:run
    ```
  - Atenção: `down -v` apaga TODOS os dados locais do MySQL.
- POST `/api/solicitacoes` retornando HTTP 500:
  - Quase sempre é schema MySQL legado: colunas `solicitacao.categoria_id`, `solicitacao.descricao_equipamento` e `historico_solicitacao.cliente_id` foram adicionadas como `NOT NULL` em versões recentes, e o `ddl-auto=update` do Hibernate não reescreve constraints em tabelas com dados.
  - Solução recomendada: o reset do volume descrito acima.
  - Logs detalhados de SQL/bind já estão habilitados em `application.properties` (`logging.level.org.hibernate.SQL=DEBUG`, `org.hibernate.orm.jdbc.bind=TRACE`) — consulte o console do backend para identificar a query exata que falhou.

## 9. Referências

- Angular CLI: https://angular.dev/tools/cli
- Tailwind CSS: https://tailwindcss.com/docs
- Spring Boot: https://spring.io/projects/spring-boot

## Notas de Desenvolvimento

* Ajuste geral de documentação do projeto.
* Revisão das instruções de primeira execução.
* Organização das etapas de configuração local.
* Complemento das orientações para frontend e backend.
* Melhoria na descrição da integração entre os serviços.
* Atualização das observações sobre ambiente de desenvolvimento.
* Inclusão de lembretes para execução local da aplicação.
* Revisão dos comandos úteis do projeto.
* Ajuste textual para facilitar a leitura do README.
* Complemento das informações sobre dependências necessárias.
* Padronização das instruções de instalação.
* Melhoria nas mensagens de solução de problemas.
* Atualização das observações sobre Docker Compose.
* Complemento das informações sobre banco de dados local.
* Revisão da estrutura principal do projeto.
* Ajuste na explicação sobre proxy do frontend.
* Complemento das orientações sobre API REST.
* Melhoria na organização das seções do documento.
* Atualização simples para controle de versionamento.
* Registro adicional de manutenção da documentação.

