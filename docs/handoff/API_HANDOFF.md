# API_HANDOFF.md — Contrato de Endpoints e Handoff Técnico de Backend

> **AVISO IMPORTANTE**: Este documento descreve uma **PROPOSTA INICIAL DE API** para integração do frontend React/TypeScript com o futuro backend em Go / PostgreSQL. Os caminhos e contratos abaixo servem como base e podem ser ajustados em conjunto pelas equipes.

---

## 1. Padrões de Resposta e Paginação

### 1.1. Formato de Resposta Padrão para Listagens Paginadas
```json
{
  "data": [],
  "page": 1,
  "pageSize": 20,
  "total": 100,
  "totalPages": 5
}
```

### 1.2. Formato Padrão para Respostas de Erro
```json
{
  "code": "BOOK_NOT_FOUND",
  "message": "O livro solicitado não foi encontrado no acervo.",
  "details": null
}
```

---

## 2. Endpoints por Módulo

### 2.1. Módulo de Autenticação (`/auth`)

#### `POST /api/v1/auth/login`
* **Objetivo**: Autenticar operador do sistema.
* **Tela no Frontend**: `/login` ([`LoginForm.tsx`](file:///Users/josehenrique/Desktop/sistema_biblioteca/sistema-de-gest%C3%A3o-bibliotec%C3%A1ria/frontend/src/features/auth/components/LoginForm.tsx))
* **Request Body**:
  ```json
  {
    "identifier": "admin@biblioteca.com",
    "password": "admin123"
  }
  ```
* **Response Esperada (200 OK)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": "usr_admin_01",
      "name": "Administrador Principal",
      "email": "admin@biblioteca.com",
      "role": "Administrador"
    }
  }
  ```

#### `GET /api/v1/auth/me`
* **Objetivo**: Retornar o perfil do usuário logado a partir do Bearer Token.

---

### 2.2. Módulo de Acervo e Livros (`/books`)

#### `GET /api/v1/books`
* **Objetivo**: Listar livros com filtros e paginação.
* **Telas que Consomem**: `/livros` e `/livros/buscar`
* **Query Params**:
  * `search` (string): Busca por título, autor ou ISBN
  * `category` (string): Filtro por categoria
  * `status` (string): Filtro por status (`Disponível`, `Emprestado`, etc.)
  * `page` (int, default `1`)
  * `pageSize` (int, default `20`)
* **Response Esperada (200 OK)**: `PaginatedResponse<Book>`

#### `GET /api/v1/books/:id`
* **Objetivo**: Obter detalhes completos de um livro específico.
* **Tela no Frontend**: `/livros/:id`

#### `POST /api/v1/books`
* **Objetivo**: Cadastrar um novo livro no acervo.
* **Tela no Frontend**: `/livros/novo`
* **Request Body**: Objeto `Book` sem os campos `id`, `createdAt` e `updatedAt`.

#### `PUT /api/v1/books/:id`
* **Objetivo**: Atualizar dados de um livro existente.
* **Tela no Frontend**: `/livros/:id/editar`

#### `DELETE /api/v1/books/:id`
* **Objetivo**: Remover um livro do acervo (caso não possua pendências).

---

### 2.3. Módulo de Leitores e Membros (`/members`)

#### `GET /api/v1/members`
* **Objetivo**: Listar membros cadastrados.
* **Tela no Frontend**: `/membros`
* **Query Params**: `search`, `status`, `page`, `pageSize`

#### `GET /api/v1/members/:id`
* **Objetivo**: Detalhes do membro e seu histórico de empréstimos.
* **Tela no Frontend**: `/membros/:id`

#### `POST /api/v1/members`
* **Objetivo**: Cadastrar novo membro.
* **Tela no Frontend**: `/membros/novo`

#### `PUT /api/v1/members/:id`
* **Objetivo**: Atualizar dados cadastrais do membro.
* **Tela no Frontend**: `/membros/:id/editar`

---

### 2.4. Módulo de Empréstimos (`/loans`)

#### `GET /api/v1/loans`
* **Objetivo**: Listar todos os empréstimos registrados.
* **Tela no Frontend**: `/emprestimos`
* **Query Params**: `status`, `memberId`, `bookId`, `search`

#### `POST /api/v1/loans`
* **Objetivo**: Registrar um novo empréstimo.
* **Tela no Frontend**: `/emprestimos/novo`
* **Request Body**:
  ```json
  {
    "bookId": "liv-001",
    "memberId": "mem-001",
    "dueDate": "2026-09-02T23:59:59Z",
    "notes": "Empréstimo padrão"
  }
  ```

#### `POST /api/v1/loans/:id/return`
* **Objetivo**: Registrar a devolução física do livro.
* **Telas no Frontend**: `/emprestimos` e `/dashboard`

#### `POST /api/v1/loans/:id/renew`
* **Objetivo**: Renovar o prazo de devolução por mais 14 dias.
* **Telas no Frontend**: `/emprestimos` e `/dashboard`

---

### 2.5. Módulo de Reservas (`/reservas`)

#### `GET /api/v1/reservations`
* **Objetivo**: Listar reservas do sistema.
* **Tela no Frontend**: `/reservas`

#### `POST /api/v1/reservations`
* **Objetivo**: Registrar uma nova reserva de livro.
* **Tela no Frontend**: `/reservas/nova`

#### `POST /api/v1/reservations/:id/cancel`
* **Objetivo**: Cancelar solicitação de reserva.

---

### 2.6. Módulo de Dashboard e Métricas Aggregadas (`/dashboard`)

#### `GET /api/v1/dashboard/summary`
* **Objetivo**: Retornar em um único request consolidado todas as métricas do painel inicial.
* **Tela no Frontend**: `/dashboard`
* **Response Esperada (200 OK)**:
  ```json
  {
    "totalBooksCount": 1240,
    "activeMembersCount": 842,
    "activeLoansCount": 156,
    "delayedLoansCount": 12,
    "recentLoans": [...],
    "popularBooks": [...]
  }
  ```

---

### 2.7. Módulo de Usuários do Sistema (`/users`)

#### `GET /api/v1/users`
* **Objetivo**: Listar os operadores administrativos da biblioteca.
* **Tela no Frontend**: `/configuracoes` (Aba Usuários)

#### `POST /api/v1/users`
* **Objetivo**: Cadastrar novo usuário com permissão de login no sistema.
* **Tela no Frontend**: `/configuracoes` (Aba Usuários)

#### `DELETE /api/v1/users/:id`
* **Objetivo**: Remover operador do sistema.

---

## 3. Mapeamento Atual Mock → Serviços Futuros da API

| Módulo do Frontend | Mock Atual | Serviço Futuro Recomendado | Endpoint Backend |
| :--- | :--- | :--- | :--- |
| Login / Auth | `auth.mock.ts` | `authService.login()` | `POST /api/v1/auth/login` |
| Livros | `books.mock.ts` | `bookService.getAll()` | `GET /api/v1/books` |
| Membros | `members.mock.ts` | `memberService.getAll()` | `GET /api/v1/members` |
| Empréstimos | `loans.mock.ts` | `loanService.getAll()` | `GET /api/v1/loans` |
| Reservas | `reservations.mock.ts` | `reservationService.getAll()` | `GET /api/v1/reservations` |
| Dashboard | `dashboard.mock.ts` | `dashboardService.getSummary()` | `GET /api/v1/dashboard/summary` |
| Relatórios | `reports.mock.ts` | `reportService.getMetrics()` | `GET /api/v1/reports/metrics` |
| Usuários do Sistema | `localStorage('system_users')` | `userService.getAll()` | `GET /api/v1/users` |

---

## 4. Decisões que a Equipe Precisa Tomar antes do Backend

As perguntas e ambiguidades a seguir foram identificadas na análise do código e **precisam ser alinhadas entre as equipes de Backend e Banco de Dados**:

```txt
DECISÃO PENDENTE DA EQUIPE:
1. Livro e Exemplares serão entidades separadas no Banco de Dados?
   No frontend atual, a entidade Book controla 'totalCopies' e 'availableCopies' como números inteiros. 
   O banco de dados utilizará uma tabela 'book_copies' com tombo/código de barras individual para cada exemplar físico?

2. O código ISBN é estritamente único por livro no cadastro?
   O frontend possui campo de ISBN obrigatório, mas a regra de unicidade no banco precisa ser confirmada.

3. Membro pode ter múltiplos empréstimos ativos simultâneos?
   O limite atual no frontend é configurável em 3 livros por membro (maxBooksPerMember). O backend deverá validar esse limite antes de criar um empréstimo.

4. Como funcionará a expiração de reservas?
   O frontend exibe o status 'Expirada'. O backend rodará um job de cron/worker em segundo plano para marcar reservas expiradas após N dias?

5. Livro atrasado gera cobrança de multa automática?
   Nas configurações existe o campo 'finePerDay' (R$ 2,00). O backend calculará o valor acumulado da multa no retorno do livro?

6. Usuários do sistema possuem matriz de permissões/roles detalhada?
   No frontend existem os papéis 'Administrador', 'Bibliotecário' e 'Assistente'. O backend usará RBAC (Role-Based Access Control) com escopos JWT?
```
