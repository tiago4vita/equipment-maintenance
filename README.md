# Equipment Maintenance - Guia de Primeira Execução

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

## 9. Referências

- Angular CLI: https://angular.dev/tools/cli
- Tailwind CSS: https://tailwindcss.com/docs
- Spring Boot: https://spring.io/projects/spring-boot
