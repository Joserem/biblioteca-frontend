# DATA_STRUCTURE.md — Estrutura de Dados do Sistema Bibliotecário UNDB

Este documento descreve detalhadamente todas as estruturas de dados, tipos TypeScript, interfaces, enums, relacionamentos, dados derivados e dados mock utilizados no frontend do **Sistema Bibliotecário UNDB**.

> **Finalidade**: Servir como referência para a modelagem do Banco de Dados PostgreSQL e desenvolvimento das APIs backend (Go / Gin).

---

## 1. Entidades Principais Identificadas

As seguintes entidades foram identificadas no frontend a partir dos tipos em `src/types/index.ts`, `src/features/auth/types/auth.types.ts` e páginas do sistema:

1. **`Book`** (Livro / Item do Acervo)
2. **`Member`** (Membro / Leitor Cadastrado)
3. **`Loan`** (Empréstimo de Livro)
4. **`Reservation`** (Reserva de Livro)
5. **`LibrarySettings`** (Configurações Gerais da Biblioteca)
6. **`User` / `SystemUser`** (Usuários do Sistema com Acesso Administrativo)

---

## 2. Tabelas de Estrutura de Dados

### 2.1. Entidade `Book` (Acervo)
* **Descrição**: Representa uma obra ou livro físico cadastrado no acervo da biblioteca.
* **Arquivo TypeScript**: [`src/types/index.ts`](file:///Users/josehenrique/Desktop/sistema_biblioteca/sistema-de-gest%C3%A3o-bibliotec%C3%A1ria/frontend/src/types/index.ts#L3-L22)

| Campo | Tipo Frontend | Obrigatório | Exemplo Real no Mock | Observação / Descrição |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `string` | Sim | `"liv-001"` | Identificador único (chave primária) |
| `title` | `string` | Sim | `"Dom Casmurro"` | Título da obra |
| `author` | `string` | Sim | `"Machado de Assis"` | Nome do autor (string simples no frontend) |
| `isbn` | `string` | Sim | `"978-8572328104"` | Código ISBN do livro |
| `publisher` | `string` | Sim | `"Companhia das Letras"` | Nome da editora |
| `category` | `string` | Sim | `"Literatura Brasileira"` | Categoria / Gênero literário |
| `year` | `number` | Sim | `1899` | Ano de publicação da obra |
| `edition` | `string` | Sim | `"4ª Edição"` | Descrição da edição |
| `pages` | `number` | Sim | `256` | Número total de páginas |
| `language` | `string` | Sim | `"Português"` | Idioma do exemplar |
| `shelf` | `string` | Sim | `"A-01-04"` | Código da prateleira / localização física |
| `totalCopies` | `number` | Sim | `8` | Quantidade total de cópias físicas |
| `availableCopies` | `number` | Sim | `3` | Quantidade de cópias atualmente disponíveis |
| `status` | `BookStatus` | Sim | `"Disponível"` | Status operacional (`Disponível`, `Reservado`, `Emprestado`, etc.) |
| `description` | `string` | Sim | `"Um dos maiores clássicos..."` | Resumo ou sinopse da obra |
| `coverColor` | `string` | Não | `"#1E3A8A"` | Cor em código hex para simulação visual |
| `createdAt` | `string` | Sim | `"2023-01-15T10:00:00Z"` | Data/hora de cadastro no formato ISO |
| `updatedAt` | `string` | Sim | `"2024-02-10T14:30:00Z"` | Data/hora da última atualização |

---

### 2.2. Entidade `Member` (Leitor / Membro)
* **Descrição**: Representa o aluno, professor ou colaborador cadastrado para utilizar os serviços da biblioteca.
* **Arquivo TypeScript**: [`src/types/index.ts`](file:///Users/josehenrique/Desktop/sistema_biblioteca/sistema-de-gest%C3%A3o-bibliotec%C3%A1ria/frontend/src/types/index.ts#L26-L40)

| Campo | Tipo Frontend | Obrigatório | Exemplo Real no Mock | Observação / Descrição |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `string` | Sim | `"mem-001"` | Identificador único (chave primária) |
| `name` | `string` | Sim | `"Ana Clara Silveira"` | Nome completo do membro |
| `registrationNumber` | `string` | Sim | `"MAT-2024-001"` | Número de matrícula institucional |
| `cpf` | `string` | Sim | `"123.456.789-01"` | CPF formatado do leitor |
| `email` | `string` | Sim | `"ana.silveira@email.com"` | Endereço de e-mail de contato |
| `phone` | `string` | Sim | `"(11) 98765-4321"` | Telefone de contato |
| `birthDate` | `string` | Sim | `"1995-04-12"` | Data de nascimento (AAAA-MM-DD) |
| `address` | `string` | Sim | `"Av. Paulista, 1578 - SP"` | Endereço residencial completo |
| `status` | `MemberStatus` | Sim | `"Ativo"` | Status do cadastro (`Ativo`, `Inativo`, `Suspenso`, `Pendente`) |
| `activeLoansCount` | `number` | Sim | `2` | Contagem de empréstimos atualmente ativos |
| `totalLoansHistory` | `number` | Sim | `14` | Histórico acumulado de empréstimos |
| `createdAt` | `string` | Sim | `"2023-01-10T10:00:00Z"` | Data/hora de cadastro no formato ISO |
| `avatarUrl` | `string` | Não | `undefined` | URL da foto de perfil (opcional) |

---

### 2.3. Entidade `Loan` (Empréstimo)
* **Descrição**: Registro da circulação de um livro retirado por um membro cadastrado.
* **Arquivo TypeScript**: [`src/types/index.ts`](file:///Users/josehenrique/Desktop/sistema_biblioteca/sistema-de-gest%C3%A3o-bibliotec%C3%A1ria/frontend/src/types/index.ts#L44-L59)

| Campo | Tipo Frontend | Obrigatório | Exemplo Real no Mock | Observação / Descrição |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `string` | Sim | `"emp-001"` | Identificador único do empréstimo |
| `bookId` | `string` | Sim | `"liv-001"` | Chave estrangeira para o livro (`Book.id`) |
| `bookTitle` | `string` | Sim | `"Dom Casmurro"` | Título desnormalizado para exibição direta |
| `bookIsbn` | `string` | Sim | `"978-8572328104"` | ISBN desnormalizado para buscas |
| `memberId` | `string` | Sim | `"mem-001"` | Chave estrangeira para o leitor (`Member.id`) |
| `memberName` | `string` | Sim | `"Ana Clara Silveira"` | Nome do leitor desnormalizado |
| `memberRegistration` | `string` | Sim | `"MAT-2024-001"` | Matrícula desnormalizada |
| `memberEmail` | `string` | Sim | `"ana.silveira@email.com"` | E-mail do leitor para notificações |
| `loanDate` | `string` | Sim | `"2024-03-01T10:00:00Z"` | Data de realização da retirada |
| `dueDate` | `string` | Sim | `"2024-03-15T23:59:59Z"` | Data limite prevista para devolução |
| `returnDate` | `string` | Não | `"2024-03-14T15:20:00Z"` | Data real da devolução (nula enquanto ativo) |
| `renewalsCount` | `number` | Sim | `0` | Quantidade de renovações efetuadas |
| `status` | `LoanStatus` | Sim | `"Ativo"` | Status (`Ativo`, `Atrasado`, `Devolvido`, `Renovado`, `Cancelado`) |
| `notes` | `string` | Não | `"Notificado por e-mail."` | Observações do operador da biblioteca |

---

### 2.4. Entidade `Reservation` (Reserva)
* **Descrição**: Solicitação de reserva de livro indisponível feita por um membro.
* **Arquivo TypeScript**: [`src/types/index.ts`](file:///Users/josehenrique/Desktop/sistema_biblioteca/sistema-de-gest%C3%A3o-bibliotec%C3%A1ria/frontend/src/types/index.ts#L63-L75)

| Campo | Tipo Frontend | Obrigatório | Exemplo Real no Mock | Observação / Descrição |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `string` | Sim | `"res-001"` | Identificador único da reserva |
| `bookId` | `string` | Sim | `"liv-004"` | Chave estrangeira para o livro (`Book.id`) |
| `bookTitle` | `string` | Sim | `"Clean Code"` | Título desnormalizado do livro |
| `bookAuthor` | `string` | Sim | `"Robert C. Martin"` | Autor desnormalizado do livro |
| `memberId` | `string` | Sim | `"mem-001"` | Chave estrangeira para o leitor (`Member.id`) |
| `memberName` | `string` | Sim | `"Ana Clara Silveira"` | Nome do leitor desnormalizado |
| `memberRegistration` | `string` | Sim | `"MAT-2024-001"` | Matrícula desnormalizada |
| `reservationDate` | `string` | Sim | `"2024-03-05T14:00:00Z"` | Data da criação da reserva |
| `expirationDate` | `string` | Sim | `"2024-03-19T23:59:59Z"` | Data limite de validade da reserva |
| `status` | `ReservationStatus` | Sim | `"Pendente"` | Status (`Pendente`, `Disponível`, `Concluída`, `Expirada`, `Cancelada`) |
| `priorityPosition` | `number` | Sim | `1` | Posição na fila de espera da reserva |

---

### 2.5. Entidade `SystemUser` (Usuário do Sistema / Autenticação)
* **Descrição**: Conta administrativa de operador do sistema bibliotecário.
* **Arquivos TypeScript**: [`src/features/auth/types/auth.types.ts`](file:///Users/josehenrique/Desktop/sistema_biblioteca/sistema-de-gest%C3%A3o-bibliotec%C3%A1ria/frontend/src/features/auth/types/auth.types.ts#L1-L6) e [`src/features/settings/pages/SettingsPage.tsx`](file:///Users/josehenrique/Desktop/sistema_biblioteca/sistema-de-gest%C3%A3o-bibliotec%C3%A1ria/frontend/src/features/settings/pages/SettingsPage.tsx#L21-L27)

| Campo | Tipo Frontend | Obrigatório | Exemplo Real no Mock | Observação / Descrição |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `string` | Sim | `"usr_admin_01"` | Identificador do usuário |
| `name` | `string` | Sim | `"Administrador Principal"` | Nome completo do usuário |
| `email` | `string` | Sim | `"admin@biblioteca.com"` | E-mail de login do operador |
| `role` | `string` | Sim | `"Administrador"` | Nível de permissão (`Administrador`, `Bibliotecário`, `Assistente`) |
| `createdAt` | `string` | Sim | `"19/08/2026"` | Data de cadastro do operador |

---

### 2.6. Entidade `LibrarySettings` (Configurações Institucionais)
* **Descrição**: Parâmetros operacionais globais da biblioteca.
* **Arquivo TypeScript**: [`src/types/index.ts`](file:///Users/josehenrique/Desktop/sistema_biblioteca/sistema-de-gest%C3%A3o-bibliotec%C3%A1ria/frontend/src/types/index.ts#L77-L93)

| Campo | Tipo Frontend | Obrigatório | Exemplo Real no Mock | Observação / Descrição |
| :--- | :--- | :---: | :--- | :--- |
| `libraryName` | `string` | Sim | `"Biblioteca Municipal Central"` | Nome oficial da unidade |
| `contactEmail` | `string` | Sim | `"contato@bibliotecamunicipal.gov.br"` | E-mail oficial de atendimento |
| `phone` | `string` | Sim | `"(11) 3456-7890"` | Telefone oficial de contato |
| `document` | `string` | Não | `"12.345.678/0001-90"` | CNPJ ou Registro Institucional |
| `openingHours` | `string` | Sim | `"Segunda a Sexta: 08h às 20h"` | Horário de funcionamento |
| `address` | `string` | Sim | `"Av. Paulista, 1000 - SP"` | Endereço físico completo |

---

## 3. Relacionamentos Identificados

```
       ┌───────────┐ 1         N ┌───────────┐
       │  Member   │─────────────│   Loan    │
       └───────────┘             └───────────┘
         │ 1                       │ N
         │                         │
         │ 1                       │ 1
       ┌───────────┐ N         1 ┌───────────┐
       │Reservation│─────────────│   Book    │
       └───────────┘             └───────────┘
```

1. **`Loan` → `Book`**: Relação **N:1**. Cada empréstimo aponta para um único livro (`bookId`). Um livro pode possuir vários empréstimos ao longo do tempo.
2. **`Loan` → `Member`**: Relação **N:1**. Cada empréstimo pertence a um único leitor (`memberId`). Um leitor pode ter múltiplos empréstimos.
3. **`Reservation` → `Book`**: Relação **N:1**. Cada reserva é destinada a um único livro (`bookId`).
4. **`Reservation` → `Member`**: Relação **N:1**. Cada reserva pertence a um único leitor (`memberId`).
5. **`Book` → `Author` / `Publisher` / `Category`**:
   * `DECISÃO PENDENTE DA EQUIPE`: No frontend atual, autor, editora e categoria são strings diretas na entidade `Book`. A equipe de banco de dados deverá decidir se normalizará em tabelas distintas (`authors`, `publishers`, `categories`) com chaves estrangeiras.
6. **`Book` → `BookCopy` (Exemplares Físicos)**:
   * `DECISÃO PENDENTE DA EQUIPE`: No frontend atual, exemplares são controlados numericamente (`totalCopies` e `availableCopies`). Se o banco de dados exigir códigos de barras de tombo/etiqueta individualizados por exemplar físico, uma entidade `BookCopy` precisará ser modelada no backend.

---

## 4. Enums e Status Utilizados no Frontend

Consolidação completa dos status e valores literais utilizados na interface do usuário:

### 4.1. `BookStatus`
* **Definição**: [`src/types/index.ts`](file:///Users/josehenrique/Desktop/sistema_biblioteca/sistema-de-gest%C3%A3o-bibliotec%C3%A1ria/frontend/src/types/index.ts#L1)

| Valor Técnico | Label Exibido na UI | Cor / Estilo Badge na UI | Onde Aparece no Frontend |
| :--- | :--- | :--- | :--- |
| `"Disponível"` | Disponível | Verde (`bg-emerald-50 text-emerald-700`) | Listagem de Livros, Detalhes, Busca |
| `"Emprestado"` | Emprestado | Azul / Laranja (`bg-amber-50 text-amber-700`) | Listagem de Livros, Detalhes |
| `"Reservado"` | Reservado | Roxo (`bg-purple-50 text-purple-700`) | Listagem de Livros, Detalhes |
| `"Manutenção"` | Manutenção | Cinza / Amarelo (`bg-slate-100 text-slate-700`) | Listagem de Livros |
| `"Indisponível"` | Indisponível | Vermelho (`bg-rose-50 text-rose-700`) | Listagem de Livros |

### 4.2. `MemberStatus`
* **Definição**: [`src/types/index.ts`](file:///Users/josehenrique/Desktop/sistema_biblioteca/sistema-de-gest%C3%A3o-bibliotec%C3%A1ria/frontend/src/types/index.ts#L24)

| Valor Técnico | Label Exibido na UI | Cor / Estilo Badge na UI | Onde Aparece no Frontend |
| :--- | :--- | :--- | :--- |
| `"Ativo"` | Ativo | Verde (`bg-emerald-50 text-emerald-700`) | Listagem de Membros, Detalhes |
| `"Inativo"` | Inativo | Cinza (`bg-slate-100 text-slate-700`) | Listagem de Membros |
| `"Suspenso"` | Suspenso | Vermelho (`bg-rose-50 text-rose-700`) | Listagem de Membros, Alerta de Empréstimo |
| `"Pendente"` | Pendente | Amarelo (`bg-amber-50 text-amber-700`) | Listagem de Membros |

### 4.3. `LoanStatus`
* **Definição**: [`src/types/index.ts`](file:///Users/josehenrique/Desktop/sistema_biblioteca/sistema-de-gest%C3%A3o-bibliotec%C3%A1ria/frontend/src/types/index.ts#L42)

| Valor Técnico | Label Exibido na UI | Cor / Estilo Badge na UI | Onde Aparece no Frontend |
| :--- | :--- | :--- | :--- |
| `"Ativo"` | Em Aberto | Azul / Amarelo (`bg-blue-50 text-blue-700`) | Listagem de Empréstimos, Dashboard |
| `"Atrasado"` | Atrasado | Vermelho (`bg-rose-50 text-rose-700`) | Dashboard, Empréstimos, Relatórios |
| `"Devolvido"` | Devolvido | Verde (`bg-emerald-50 text-emerald-700`) | Listagem de Empréstimos, Histórico |
| `"Renovado"` | Renovado | Roxo (`bg-purple-50 text-purple-700`) | Listagem de Empréstimos |
| `"Cancelado"` | Cancelado | Cinza (`bg-slate-100 text-slate-700`) | Listagem de Empréstimos |

### 4.4. `ReservationStatus`
* **Definição**: [`src/types/index.ts`](file:///Users/josehenrique/Desktop/sistema_biblioteca/sistema-de-gest%C3%A3o-bibliotec%C3%A1ria/frontend/src/types/index.ts#L61)

| Valor Técnico | Label Exibido na UI | Cor / Estilo Badge na UI | Onde Aparece no Frontend |
| :--- | :--- | :--- | :--- |
| `"Pendente"` | Aguardando | Amarelo (`bg-amber-50 text-amber-700`) | Listagem de Reservas, Sidebar |
| `"Disponível"` | Retirar no Balcão | Verde (`bg-emerald-50 text-emerald-700`) | Listagem de Reservas |
| `"Concluída"` | Atendida | Azul (`bg-blue-50 text-blue-700`) | Histórico de Reservas |
| `"Expirada"` | Expirada | Vermelho (`bg-rose-50 text-rose-700`) | Listagem de Reservas |
| `"Cancelada"` | Cancelada | Cinza (`bg-slate-100 text-slate-700`) | Listagem de Reservas |

---

## 5. Mapeamento dos Arquivos Mock

| Arquivo Mock | Entidade Associada | Qtd. Registros Mock | Páginas do Frontend que Consomem |
| :--- | :--- | :---: | :--- |
| `books.mock.ts` | `Book` | 18 livros | `/livros`, `/livros/buscar`, `/livros/:id`, `/dashboard` |
| `members.mock.ts` | `Member` | 12 leitores | `/membros`, `/membros/:id`, `/emprestimos/novo`, `/dashboard` |
| `loans.mock.ts` | `Loan` | 10 empréstimos | `/emprestimos`, `/emprestimos/:id`, `/dashboard`, `/relatorios` |
| `reservations.mock.ts` | `Reservation` | 6 reservas | `/reservas`, `/reservas/:id`, `/dashboard` |
| `dashboard.mock.ts` | `DashboardMetric` | 1 resumo agregado | `/dashboard` |
| `reports.mock.ts` | `ReportMetric` | 1 resumo de relatórios | `/relatorios` |

---

## 6. Dados Derivados (`DADO CALCULADO`)

Informações que aparecem nas telas da aplicação mas que **NÃO devem ser salvas como colunas físicas no banco de dados**, pois são resultantes de consultas de agregação SQL:

1. **`Total de Livros`**:
   * **Fórmula**: `SUM(books.total_copies)`
   * **Exibido em**: Dashboard e Relatórios.
2. **`Membros Ativos`**:
   * **Fórmula**: `COUNT(members.id) WHERE status = 'Ativo'`
   * **Exibido em**: Dashboard e Relatórios.
3. **`Empréstimos Ativos`**:
   * **Fórmula**: `COUNT(loans.id) WHERE status IN ('Ativo', 'Renovado')`
   * **Exibido em**: Dashboard.
4. **`Empréstimos Atrasados`**:
   * **Fórmula**: `COUNT(loans.id) WHERE status = 'Atrasado' OR (due_date < NOW() AND status != 'Devolvido')`
   * **Exibido em**: Dashboard e Relatórios.
5. **`Ranking de Livros Populares`**:
   * **Fórmula**: Agregação `COUNT(loans.id) GROUP BY book_id ORDER BY count DESC LIMIT 5`.
   * **Exibido em**: Dashboard (coluna lateral).
6. **`Ranking de Leitores mais Ativos`**:
   * **Fórmula**: Agregação `COUNT(loans.id) GROUP BY member_id ORDER BY count DESC LIMIT 5`.
   * **Exibido em**: Empréstimos (`/emprestimos`).
7. **`Taxa de Disponibilidade`**:
   * **Fórmula**: `(SUM(available_copies) / SUM(total_copies)) * 100`
   * **Exibido em**: Relatórios.
8. **`Taxa de Atraso`**:
   * **Fórmula**: `(COUNT(loans_overdue) / COUNT(loans_total)) * 100`
   * **Exibido em**: Relatórios.
