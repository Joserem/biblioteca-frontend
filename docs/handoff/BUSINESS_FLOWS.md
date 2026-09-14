# BUSINESS_FLOWS.md — Fluxos de Negócio e Regras do Frontend

Este documento descreve os fluxos funcionais, regras de negócio e validações esperadas pelo frontend do **Sistema Bibliotecário UNDB**.

---

## 1. Módulo de Livros (Acervo)

### 1.1. Cadastro de Novo Livro
* **Rota**: `/livros/novo`
* **Formulário**: [`src/features/books/pages/NewBookPage.tsx`](file:///Users/josehenrique/Desktop/sistema_biblioteca/sistema-de-gest%C3%A3o-bibliotec%C3%A1ria/frontend/src/features/books/pages/NewBookPage.tsx)
* **Validações de Campo**:
  * `title`: Obrigatório (string).
  * `author`: Obrigatório (string).
  * `isbn`: Obrigatório (string, formato ISBN-10 ou ISBN-13).
  * `publisher`: Obrigatório (string).
  * `category`: Obrigatório (Seleção entre opções existentes).
  * `year`: Obrigatório (número inteiro positivo).
  * `shelf`: Obrigatório (string de localização física, ex: `"A-01-04"`).
  * `totalCopies`: Obrigatório (número inteiro ≥ 1).
  * `availableCopies`: Inicializado com o mesmo valor de `totalCopies`.
  * `description`: Opcional/Recomendado.
* **Resultado Esperado**:
  * O livro é salvo no estado e o status é definido como `"Disponível"`.
  * Exibição de notificação Toast de sucesso.
  * Redirecionamento automático para a listagem `/livros`.

### 1.2. Listagem e Edição de Livros
* **Rotas**: `/livros` e `/livros/:id/editar`
* **Fluxo de Edição**:
  * Ao alterar `totalCopies`, se a nova quantidade for menor que o número de livros emprestados no momento, o frontend emite alerta.
  * Se `availableCopies === 0`, o status do livro é automaticamente atualizado para `"Indisponível"` ou `"Emprestado"`.

### 1.3. Exclusão de Livros
* **Regra Identificada**: Não é permitida a exclusão de um livro que possua empréstimos ativos (`status === 'Ativo'`) ou reservas pendentes ativas.

---

## 2. Módulo de Membros (Leitores)

### 2.1. Cadastro de Novo Membro
* **Rota**: `/membros/novo`
* **Formulário**: [`src/features/members/pages/NewMemberPage.tsx`](file:///Users/josehenrique/Desktop/sistema_biblioteca/sistema-de-gest%C3%A3o-bibliotec%C3%A1ria/frontend/src/features/members/pages/NewMemberPage.tsx)
* **Validações de Campo**:
  * `name`: Obrigatório (nome completo).
  * `registrationNumber`: Obrigatório (matrícula institucional única).
  * `cpf`: Obrigatório (formato CPF `XXX.XXX.XXX-XX`).
  * `email`: Obrigatório (formato e-mail válido).
  * `phone`: Obrigatório (formato telefone).
  * `birthDate`: Obrigatório (data AAAA-MM-DD).
  * `address`: Obrigatório (endereço residencial).
  * `status`: Padrão inicial `"Ativo"`.
* **Métricas Iniciais**:
  * `activeLoansCount`: Inicializado em `0`.
  * `totalLoansHistory`: Inicializado em `0`.

### 2.2. Bloqueio por Status Suspenso
* **Regra de Negócio**: Leitores com status `"Suspenso"` ou `"Inativo"` são impedidos de realizar novos empréstimos no formulário de concessão de livro.

---

## 3. Módulo de Empréstimos

### 3.1. Concessão de Novo Empréstimo
* **Rota**: `/emprestimos/novo`
* **Passos do Fluxo**:
  1. **Seleção de Membro**: Selecionar leitor ativo. Caso o leitor esteja suspenso ou tenha atingido o limite máximo de empréstimos simultâneos (`maxBooksPerMember` de 3 livros), o frontend exibe aviso.
  2. **Seleção de Livro**: Apenas livros com `availableCopies > 0` aparecem na lista de seleção.
  3. **Prazo de Devolução**: Calculado automaticamente adicionando o prazo padrão (`defaultLoanDays` = 14 dias) à data atual.
  4. **Confirmação**:
     * Cria registro `Loan` com status `"Ativo"`.
     * Decrementa `availableCopies` do livro em 1 unidade.
     * Incrementa `activeLoansCount` do leitor em 1 unidade.

### 3.2. Devolução de Empréstimo
* **Ação na UI**: Botão de devolução na tabela de empréstimos (`/emprestimos` e `/dashboard`).
* **Efeitos Esperados**:
  * O status do empréstimo muda para `"Devolvido"`.
  * Preenchimento do campo `returnDate` com o timestamp atual.
  * Incremento de `availableCopies` do livro associado em 1 unidade.
  * Decremento de `activeLoansCount` do leitor em 1 unidade.

### 3.3. Renovação de Empréstimo
* **Ação na UI**: Botão de renovação (`RotateCcw`).
* **Efeitos Esperados**:
  * Incrementa `renewalsCount` em 1 unidade.
  * Estende a data de vencimento (`dueDate`) em mais 14 dias corridos.
  * Altera o status para `"Renovado"`.
  * Limitado ao máximo de 2 renovações por empréstimo (`maxRenewals`).

### 3.4. Controle de Atrasos
* **Regra de Identificação**: Um empréstimo é considerado atrasado quando a data atual for maior que `dueDate` e o status for diferente de `"Devolvido"`.
* **Efeitos na UI**: Badge vermelho de `"Atrasado"` e destaque de cobrança no Dashboard e Relatórios.

---

## 4. Módulo de Reservas

### 4.1. Solicitação de Reserva
* **Rota**: `/reservas/nova`
* **Regra**: Destinada a obras que estejam atualmente com exemplares esgotados (`availableCopies === 0`) ou para assegurar fila de prioridade.
* **Campos**: Seleção de Livro, Seleção de Membro, Data de Validade da Reserva (`expirationDate` padrão 7 a 14 dias).
* **Posição de Prioridade**: Calculada sequencialmente (`priorityPosition = 1, 2, ...`).

### 4.2. Conclusão e Cancelamento
* **Conclusão**: Quando o livro reservado é devolvido, a reserva muda para `"Disponível"` (para retirada no balcão) e posteriormente `"Concluída"` quando convertida em empréstimo.
* **Cancelamento**: O operador pode cancelar a reserva a qualquer momento (`status = 'Cancelada'`).

---

## 5. Módulo de Autenticação e Usuários do Sistema

> **NOTA IMPORTANTE**: `AUTENTICAÇÃO ATUAL É MOCK DE FRONTEND`

* **Rota de Login**: `/login`
  * Credenciais de demonstração: `admin@biblioteca.com` / `admin123` (ou qualquer e-mail/senha preenchido).
  * O formulário armazena o token/flag `auth_authenticated` no `localStorage`.
* **Cadastro de Usuários do Sistema**:
  * **Rota**: `/configuracoes` (Aba *"Usuários do Sistema"*).
  * Permite ao Administrador cadastrar operadores do painel com:
    * `name`: Nome Completo
    * `email`: E-mail de Acesso
    * `password`: Senha
    * `role`: Perfil (`Administrador`, `Bibliotecário`, `Assistente`)
  * Persistência atual via `localStorage` na chave `system_users`.

---

## 6. Validações de Formulário (Zod Schemas Identificados)

### 6.1. Schema de Login (`loginSchema`)
```typescript
z.object({
  identifier: z.string().min(1, 'Informe seu usuário ou e-mail'),
  password: z.string().min(1, 'Informe sua senha'),
});
```

### 6.2. Schema de Cadastro de Livro (`bookSchema`)
```typescript
z.object({
  title: z.string().min(2, 'O título deve ter pelo menos 2 caracteres'),
  author: z.string().min(2, 'O autor deve ter pelo menos 2 caracteres'),
  isbn: z.string().min(10, 'ISBN inválido'),
  publisher: z.string().min(2, 'Informe a editora'),
  category: z.string().min(1, 'Selecione uma categoria'),
  year: z.number().min(1500).max(new Date().getFullYear()),
  shelf: z.string().min(1, 'Informe a prateleira/localização'),
  totalCopies: z.number().min(1, 'A quantidade deve ser de pelo menos 1 exemplar'),
});
```

### 6.3. Schema de Cadastro de Membro (`memberSchema`)
```typescript
z.object({
  name: z.string().min(3, 'Nome muito curto'),
  registrationNumber: z.string().min(3, 'Matrícula obrigatória'),
  cpf: z.string().min(11, 'CPF inválido'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(8, 'Telefone inválido'),
  birthDate: z.string().min(1, 'Data de nascimento obrigatória'),
  address: z.string().min(5, 'Endereço obrigatório'),
});
```
