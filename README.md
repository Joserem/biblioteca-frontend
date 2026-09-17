# Sistema de Gestão Bibliotecária — Frontend (Equipe 1)

Frontend oficial do **Sistema Bibliotecário**, desenvolvido e mantido pela **Equipe 1**.

A aplicação opera **exclusivamente integrada à API Orquestradora Java**, sem dados mockados e sem chaveamento em tempo de execução.

---

## 1. Endereços e Comunicação

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **API Orquestradora Java**: [http://localhost:8080](http://localhost:8080)
- **Health Check da Orquestradora**: `GET http://localhost:8080/backeds/health`

---

## 2. Arquitetura de Comunicação

O fluxo arquitetural do sistema é estritamente centralizado na Orquestradora:

```
[ React Frontend (Equipe 1) :3000 ]
                │
                ▼ (HTTP REST via VITE_API_URL=http://localhost:8080)
[ API Orquestradora Java :8080 ]
                │
                ├──▶ [ Backend disponível ]
                └──▶ [ Backend disponível ]
```

> **Regra Central de Comunicação:**
> O frontend não depende das portas individuais dos backends. Toda comunicação ocorre exclusivamente pela API Orquestradora em http://localhost:8080. A identificação, disponibilidade, eleição do líder e failover entre os backends são responsabilidades da Orquestradora.

### Regras Arquiteturais Obrigatórias:

- **O frontend nunca acessa diretamente os backends individuais.**
  Toda e qualquer requisição transita unicamente pela **API Orquestradora Java** através de `VITE_API_URL=http://localhost:8080`.
- **Endpoint Oficial de Health**:
  O endpoint oficial informado pela equipe para verificar a situação dos backends é:
  `GET http://localhost:8080/backeds/health`
  *(ATENÇÃO: a rota correta é literalmente `/backeds/health`. NÃO corrigir para `/backends/health`).*
- **A lógica de failover e eleição de líder é responsabilidade exclusiva da API Orquestradora.**
  O frontend apenas consome o endpoint `GET /backeds/health` e reflete o status do líder retornado no badge (`Ativo: Python`, `Ativo: Java`, `Ativo: JavaScript`, `Backend indisponível` ou `Orquestradora indisponível`).
- **Operações de Livros**:
  Todas as operações de acervo são realizadas exclusivamente através da Orquestradora:
  - `GET /books` (listagem e filtros de busca)
  - `GET /books/:id` (detalhes do livro)
  - `POST /books` (cadastro de novo livro)
  - `PUT /books/:id` (edição de livro)
  - `DELETE /books/:id` (exclusão de livro)
- **Zero Mocks**:
  A aplicação opera exclusivamente com dados reais. Em caso de indisponibilidade da Orquestradora ou dos backends, o frontend apresenta estados visuais de erro amigáveis com botão *"Tentar novamente"*, sem exibir dados fictícios ou simular sucesso.

---

## 3. Variáveis de Ambiente

O arquivo `.env` deve conter exclusivamente a URL da API Orquestradora:

```env
VITE_API_URL=http://localhost:8080
```

> **Nota:** O arquivo `.env.example` serve como referência idêntica. A aplicação opera exclusivamente com a API Orquestradora real.

---

## 4. Estrutura de Rotas

| Rota | Descrição |
|---|---|
| `/` | Redireciona automaticamente para `/livros` |
| `/livros` | Listagem de livros, métricas reais do acervo, filtros e ações CRUD |
| `/livros/novo` | Formulário de cadastro de novo livro via API |
| `/livros/:id` | Detalhes e informações completas do livro |
| `/livros/:id/editar` | Edição dos dados cadastrais do livro via API |

---

## 5. Como Testar a Aplicação

Siga o passo a passo abaixo para validar a integração completa:

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Configurar o arquivo `.env`**:
   ```bash
   cp .env.example .env
   ```
   Certifique-se de que `VITE_API_URL=http://localhost:8080`.

3. **Iniciar a API Orquestradora Java**:
   Execute a Orquestradora na porta `8080`.

4. **Iniciar pelo menos um backend**:
   Inicie pelo menos um nó de backend (Python ou JavaScript).

5. **Iniciar o frontend**:
   ```bash
   npm run dev
   ```

6. **Acessar o sistema**:
   Abra no navegador: [http://localhost:3000/livros](http://localhost:3000/livros)

7. **Verificar o status do backend**:
   Observe o badge no topo da página:
   - `Ativo: Python` — quando o backend líder for o Python;
   - `Ativo: Java` — quando o backend líder for Java;
   - `Ativo: JavaScript` — quando o backend líder for JavaScript;
   - `Backend indisponível` — quando a Orquestradora estiver online, mas nenhum backend responder;
   - `Orquestradora indisponível` — quando a Orquestradora (`localhost:8080`) estiver inacessível.

8. **Testar listagem e operações do CRUD**:
   - **Listagem**: Os dados exibidos virão diretamente do backend através da Orquestradora (`GET /books`);
   - **Cadastro**: Clicar em *"Novo Livro"*, preencher os dados e salvar (`POST /books`);
   - **Edição**: Selecionar um livro, alterar dados e salvar (`PUT /books/:id`);
   - **Exclusão**: Clicar no ícone de lixeira, confirmar a exclusão e verificar a remoção (`DELETE /books/:id`).

---

## 6. Validação e Qualidade de Código

Execute os comandos abaixo para certificar que o código está estritamente tipado e sem falhas de build:

```bash
npx tsc --noEmit    # Verificação estrita de tipos TypeScript
npm run lint        # Verificação via linter
npm run build       # Build de produção com Vite
```

