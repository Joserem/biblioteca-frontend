# Sistema de Gestão Bibliotecária — Frontend (Equipe 1)

Frontend oficial do **Sistema Bibliotecário**, desenvolvido e mantido pela **Equipe 1** conforme as diretrizes acadêmicas.

---

## 1. Responsabilidade do Frontend

O escopo desta aplicação concentra-se estritamente na interface e no ciclo completo de gestão do acervo:

- **Listagem de Livros**: Visualização tabular com busca integrada (por título, autor e ISBN), filtros por categoria e status, paginação e métricas de acervo;
- **Cadastro de Novo Livro**: Formulário validado com React Hook Form e Zod;
- **Edição de Livro**: Atualização dos dados cadastrais com validação;
- **Exclusão de Livro**: Operação com confirmação modal explícita;
- **Indicador do Backend Ativo**: Badge visível em tempo real informando qual nó de processamento está atendendo as requisições (`Ativo: Python` ou `Ativo: JavaScript`).

---

## 2. Arquitetura do Sistema

A comunicação do sistema segue o fluxo arquitetural estrito:

```
[ React Frontend (Equipe 1) ]
              │
              ▼ (Exclusivamente HTTP REST via VITE_API_URL)
[ API Orquestradora Java (Equipe Orquestradora) ]
              ├──▶ [ Backend Python ]
              └──▶ [ Backend JavaScript ]
```

### Regras Arquiteturais Obrigatórias:

> **O frontend nunca chama diretamente as APIs Python ou JavaScript.**
> Toda e qualquer requisição transita unicamente pela **API Orquestradora Java**.

> **A lógica de failover é responsabilidade exclusiva da API Orquestradora.**
> O frontend não decide quando usar Python ou JavaScript, não monitora a saúde das APIs secundárias e não realiza troca de rotas. O frontend apenas exibe o indicador visual do backend que processou a requisição com base no contrato retornado pela Orquestradora.

---

## 3. Integração com Backend e Uso de Mocks

- O frontend está preparado para consumir **exclusivamente** a API Orquestradora Java.
- **Para desenvolvimento e testes isolados do frontend**, utilizar:
  ```env
  VITE_USE_MOCKS=true
  ```
- **Para integração com a API Orquestradora Java**, utilizar:
  ```env
  VITE_USE_MOCKS=false
  VITE_API_URL=http://localhost:8080/api
  ```
- Os mocks existem **somente para desenvolvimento/testes do frontend** e **não devem ser utilizados na demonstração oficial integrada**.
- Com `VITE_USE_MOCKS=false`, todas as operações do CRUD de livros devem ser realizadas exclusivamente através da API Orquestradora Java.
- O frontend **nunca deve chamar diretamente as APIs Python ou JavaScript**.
- A decisão de failover é **responsabilidade exclusiva da API Orquestradora**.

---

## 4. Estrutura de Rotas

O sistema inicia diretamente no módulo de livros:

| Rota | Descrição |
|---|---|
| `/` | Redireciona automaticamente para `/livros` |
| `/livros` | Listagem geral de livros, busca integrada e ações do CRUD |
| `/livros/novo` | Cadastro de novo livro |
| `/livros/:id` | Detalhes do exemplar no acervo |
| `/livros/:id/editar` | Edição de livro cadastrado |

---

## 5. Resiliência e Tratamento de Estados

- **Loading**: Skeleton tables e spinners informativos durante consultas assíncronas;
- **Timeout**: Timeout configurado em 10 segundos no Axios para absorver transições e respostas lentas. Quando o tempo limite expira, é apresentada a mensagem: *"A resposta está demorando mais que o esperado. Tente novamente."*;
- **Retry Controlado**: `retry: 1` gerenciado via TanStack Query;
- **Feedback de Erro**: Tratamento amigável com opção de repetição manual (*"Tentar novamente"*).

---

## 6. Como Executar Localmente

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou bun

### Passo a Passo

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente**:
   Crie um arquivo `.env` a partir do `.env.example`:
   ```bash
   cp .env.example .env
   ```

   Configure a URL da API Orquestradora Java:
   ```env
   VITE_API_URL=http://localhost:8080/api
   ```

3. **Iniciar o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

   Acesse em: [http://localhost:3000](http://localhost:3000)

4. **Validação de Código e Build**:
   ```bash
   npm run lint     # Verificação de tipos TypeScript (tsc --noEmit)
   npm run build    # Build de produção com Vite
   ```
