# Sistema de Gestão Bibliotecária — Frontend (Equipe 1)

Frontend oficial do **Sistema Bibliotecário**, desenvolvido e mantido pela **Equipe 1**.

A aplicação opera **exclusivamente integrada à API Orquestradora Java**, sem dados mockados, sem autenticação e sem chaveamento ou failover em tempo de execução no cliente.

---

## 1. Endereços e Comunicação

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **API Orquestradora Java**: [http://localhost:8080](http://localhost:8080)
- **Status da Orquestradora informado pela equipe**: `GET http://localhost:8080/backeds/health`

---

## 2. Arquitetura de Comunicação e Regras Oficiais

O frontend não depende das portas individuais dos backends. Toda comunicação de negócio ocorre exclusivamente pela API Orquestradora em http://localhost:8080. A identificação, disponibilidade, eleição do líder e failover entre os backends são responsabilidades da Orquestradora.

```
[ React Frontend (Equipe 1) :3000 ]
                │
                ▼ (HTTP REST via VITE_API_URL=http://localhost:8080)
[ API Orquestradora Java :8080 ]
                │
                ├──▶ [ Backend Líder Ativo (Python ou JavaScript) ]
                └──▶ [ Backend Réplica ]
```

### Regras de Isolamento e Segurança do Frontend:
- **Zero Mocks**: O frontend não possui mocks nem dados fictícios.
- **Zero Autenticação**: O projeto oficialmente não possui autenticação, login, tokens ou telas protegidas.
- **Zero Decisão de Failover no Frontend**: O frontend nunca decide quem é o backend líder nem altera a URL de destino das requisições. Ele continua chamando sempre a mesma Orquestradora em `http://localhost:8080`.
- **Zero Acesso Direto a Bancos ou APIs Internas**: O frontend nunca acessa diretamente MySQL, Postgres, strings de conexão ou as portas internas das APIs Python/Node.

---

## 3. Contrato Oficial do CRUD de Livros

Todas as operações de negócio utilizam exclusivamente a API Orquestradora em `http://localhost:8080`:

| Operação | Método | Endpoint Oficial | Payload / Descrição |
|---|---|---|---|
| **Listagem** | `GET` | `/livros` | Retorna o acervo cadastrado |
| **Detalhes** | `GET` | `/livros/{id_livro}` | Retorna os dados do livro correspondente |
| **Cadastro** | `POST` | `/livros` | `{ "titulo": "...", "isbn": "...", "autor": "...", "editora": "..." }` |
| **Edição** | `PUT` | `/livros/{id_livro}` | `{ "titulo": "...", "isbn": "...", "autor": "...", "editora": "..." }` |
| **Exclusão** | `DELETE` | `/livros/{id_livro}` | Remove o livro do acervo |

### Modelo Oficial de Livro:
- `id_livro`: identificador único numérico;
- `titulo`: título da obra;
- `isbn`: código ISBN do livro;
- `autor`: autor da obra;
- `editora`: editora responsável pela publicação;
- `data_cadastro`: data/hora de inserção do registro;
- `data_atualizacao`: data/hora da última atualização.

---

## 4. Status do Backend Ativo (`GET /backeds/health`)

A situação dos backends e a liderança são consultadas no endpoint público da Orquestradora:
`GET http://localhost:8080/backeds/health`

*(Atenção: a rota está literalmente escrita `/backeds/health` conforme contrato fornecido pela equipe responsável).*

O badge no frontend reflete a liderança informada pela Orquestradora:
- `leader: "api-python"` → **Ativo: Python**
- `leader: "api-javascript"` (ou `node`) → **Ativo: JavaScript**
- Orquestradora online, mas sem backend (`{ "erro": "Nenhum backend está disponível no momento" }`) → **Backend indisponível**
- Orquestradora desligada / inacessível em `localhost:8080` → **Orquestradora indisponível**

*(Nota: Java é a Orquestradora nesta arquitetura, logo não é tratada como um terceiro backend de CRUD).*

---

## 5. Variáveis de Ambiente

Arquivo `.env` centralizado:

```env
VITE_API_URL=http://localhost:8080
```

O arquivo `.env.example` contém esta mesma especificação. O `.env` real permanece ignorado pelo Git.

---

## 6. Estrutura de Rotas Internas do Frontend

| Rota | Descrição |
|---|---|
| `/` | Redireciona automaticamente para `/livros` |
| `/livros` | Listagem de livros, métricas reais do contrato e busca local |
| `/livros/novo` | Cadastro de novo livro |
| `/livros/:id` | Visualização detalhada do livro |
| `/livros/:id/editar` | Edição dos campos cadastrais do livro |
| `*` | Página 404 de rota não encontrada |

---

## 7. Como Testar a Aplicação

Siga este roteiro completo de validação:

1. Clonar o repositório:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   ```
2. Entrar na pasta clonada do repositório:
   ```bash
   cd <pasta-do-repositorio>
   ```
3. Instalar as dependências:
   ```bash
   npm install
   ```
4. Criar o arquivo `.env` a partir do `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *(Certifique-se de que `VITE_API_URL=http://localhost:8080`).*
5. Iniciar a API Orquestradora Java na porta 8080.
6. Iniciar a infraestrutura e os backends (Python e JavaScript) conforme orientação das equipes de backend.
7. Executar o frontend:
   ```bash
   npm run dev
   ```
8. Acessar a aplicação no navegador:
   [http://localhost:3000/livros](http://localhost:3000/livros)
9. Verificar o badge de status do backend ativo no topo da tela (`Ativo: Python` ou `Ativo: JavaScript`).
10. Testar o fluxo completo do CRUD:
    - **Listagem**: carregar os livros através de `GET /livros`;
    - **Cadastro**: clicar em *"Novo Livro"*, preencher os dados e salvar (`POST /livros`);
    - **Detalhes**: clicar no ícone de visualização para inspecionar os dados (`GET /livros/{id_livro}`);
    - **Edição**: clicar em editar, alterar os campos permitidos e salvar (`PUT /livros/{id_livro}`);
    - **Exclusão**: clicar no ícone de lixeira, confirmar a exclusão e verificar a remoção (`DELETE /livros/{id_livro}`).
11. **Demonstração de Failover Transparente**:
    - Identificar qual é o backend líder exibido no badge (ex: `Ativo: Python`).
    - Derrubar o processo ou container do backend líder.
    - **Sem alterar nenhuma linha ou configuração no frontend**, aguardar a Orquestradora promover o outro backend.
    - Observar a atualização automática do badge (ex: para `Ativo: JavaScript`).
    - Continuar utilizando as operações de CRUD normalmente contra a mesma URL (`http://localhost:8080`), comprovando o failover transparente.

---

## 8. Verificação de Tipos e Build

Para certificar a integridade estática do projeto:

```bash
npx tsc --noEmit    # Verificação estrita de tipos TypeScript
npm run lint        # Verificação do linter
npm run build       # Build de produção Vite
```


