# Manoa — Marketplace da Economia Criativa e do Artesanato de Pernambuco

Aplicação web full stack que conecta artesãos de Pernambuco a compradores de todo o Brasil. Tem três ambientes: **vitrine do comprador**, **painel do artesão** e **painel administrativo**, além de um módulo de recomendação de produtos. O pagamento é simulado e os dados são sintéticos ou representativos.

## Integrantes

<table width="100%">
  <tr>
    <td align="center" width="33%">
      <a href="https://github.com/emanoelhenrick">
        <img src="https://github.com/emanoelhenrick.png" width="90px" style="border-radius:50%;" alt="Emanoel Henrick"/><br />
        <b>Emanoel Henrick</b>
      </a>
    </td>
    <td align="center" width="33%">
      <a href="https://github.com/jenniferzeferino">
        <img src="https://github.com/jenniferzeferino.png" width="90px" style="border-radius:50%;" alt="Jennifer Zeferino"/><br />
        <b>Jennifer Zeferino</b>
      </a>
    </td>
    <td align="center" width="33%">
      <a href="https://github.com/RaieleLeite">
        <img src="https://github.com/RaieleLeite.png" width="90px" style="border-radius:50%;" alt="Raiele Leite"/><br />
        <b>Raiele Leite</b>
      </a>
    </td>
  </tr>
  <tr>
    <td align="center" width="33%">
      <a href="https://github.com/RayssaRR">
        <img src="https://github.com/RayssaRR.png" width="90px" style="border-radius:50%;" alt="Rayssa Santana"/><br />
        <b>Rayssa Santana</b>
      </a>
    </td>
    <td align="center" width="33%">
      <a href="https://github.com/FelipeLV12">
        <img src="https://github.com/FelipeLV12.png" width="90px" style="border-radius:50%;" alt="Felipe Lopes"/><br />
        <b>Felipe Lopes</b>
      </a>
    </td>
    <td align="center" width="33%">
      <a href="https://github.com/injuje">
        <img src="https://github.com/injuje.png" width="90px" style="border-radius:50%;" alt="José Leandro"/><br />
        <b>José Leandro</b>
      </a>
    </td>
  </tr>
</table>

## Stack

| Camada | Tecnologia | Uso |
| --- | --- | --- |
| Frontend | Next.js + Tailwind CSS + shadcn/ui | Vitrine e painéis (SPA nas áreas logadas) |
| Backend | Node.js + Express | API REST em camadas |
| ORM e banco | Prisma + PostgreSQL | Usuários, catálogo, estoque e pedidos (transações ACID) |
| Autenticação | JWT em cookies `httpOnly` | Access token curto + refresh token com rotação |
| Cache | Redis | Cache da vitrine e das recomendações, rate limit |
| Assíncrono | Fila sobre Redis (ex.: BullMQ) | Recomendações e indicadores fora do checkout |

Redis e fila só entram onde fazem sentido: o fluxo principal (busca, carrinho, checkout) depende apenas do PostgreSQL, e o checkout é sempre síncrono e transacional.

## Documentação visual

```mermaid
flowchart TB
    U(["Usuários<br/>Comprador · Artesão · Administrador"])

    subgraph FE["Frontend SPA — Next.js · Tailwind · shadcn/ui"]
        FE_UI["Páginas e componentes<br/>Vitrine · Painel do Artesão · Painel Admin"]
        FE_API["API Client<br/>fetch com cookies httpOnly"]
        FE_UI --> FE_API
    end

    subgraph BE["Backend API — Node.js · Express"]
        BE_HTTP["Presentation<br/>Rotas · Controllers · Middlewares"]
        BE_APP["Application<br/>Casos de uso"]
        BE_DOM["Domain<br/>Entidades · Regras · Ports"]
        BE_INFRA["Infra<br/>Prisma · Redis · JWT · Fila · Pagamento simulado"]
        BE_HTTP --> BE_APP
        BE_APP --> BE_DOM
        BE_INFRA -. implementa ports .-> BE_DOM
    end

    WK["Worker<br/>consome a fila"]
    DB[("PostgreSQL")]
    RD[("Redis")]

    U -->|HTTPS| FE_UI
    FE_API -->|"REST/JSON + cookies"| BE_HTTP
    BE_INFRA -->|Prisma| DB
    BE_INFRA --> RD
    RD -->|jobs| WK
    WK -->|Prisma| DB
```

A dependência aponta sempre para dentro (Presentation → Application → Domain). A Infra implementa os ports do domínio e só é ligada aos casos de uso em `config/container.ts`.

## Justificativa teórica

### Padrões GoF

| Padrão | Onde | Para quê |
| --- | --- | --- |
| **Strategy** | `domain/recommendation/` e `infra/recommendation/` | Alternar entre recomendação por atributos e por popularidade (fallback sem histórico) |
| **State** | `domain/orders/state/` | Cada estado do pedido só permite as transições autorizadas |
| **Decorator** | `infra/cache/CachedProductRepository` | Cache Redis sobre o repositório Prisma, com a mesma interface |
| **Adapter** | `infra/payment/SimulatedPaymentGateway` | Isolar o pagamento (simulado hoje, real no futuro) atrás de um port |
| **Observer** | `shared/events/DomainEventBus` | Efeitos do pedido confirmado (indicadores, notificação) sem acoplar ao checkout |
| **Chain of Responsibility** | `presentation/http/middlewares/` | `authenticate` → `authorize` → `validate` → controller |

### SOLID

| Princípio | Aplicação |
| --- | --- |
| **S** | Controller só trata HTTP; cada caso de uso faz uma coisa; repositório só persiste |
| **O** | Nova estratégia de recomendação ou novo estado de pedido é uma nova classe, sem editar o caso de uso |
| **L** | `PrismaProductRepository`, `CachedProductRepository` e a versão em memória (testes) seguem o mesmo contrato |
| **I** | Ports pequenos: `ProductReader` (comprador), `ProductWriter` (artesão), `PaymentGateway` (só `authorize`) |
| **D** | Casos de uso recebem ports pelo construtor; o domínio não importa Express, Prisma nem Redis |

### GRASP

| Padrão | Aplicação |
| --- | --- |
| **Information Expert** | `Cart.total()`, `Order.calculateTotal()` e `Product.hasStock()` ficam nas entidades que têm os dados |
| **Creator** | `Order` cria seus `OrderItem`; `Cart` cria seus `CartItem` |
| **Controller** | Controllers HTTP delegam; o caso de uso coordena o fluxo |
| **Low Coupling / High Cohesion** | Módulos por contexto (catálogo, carrinho, pedidos, recomendação), ligados por ports e eventos |
| **Polymorphism** | `OrderState` e `RecommendationStrategy` no lugar de `if` por tipo |
| **Pure Fabrication** | `PasswordHasher`, `DomainEventBus`, repositórios (não existem no domínio, mas mantêm as classes coesas) |
| **Protected Variations** | Ports protegem o sistema da troca de gateway (W01), do ORM e dos modelos de IA (W04) |

## Executando localmente

```bash
git clone <url-do-repositorio> && cd manoa
cp .env.example .env            # altere senhas e segredos
docker compose up --build
```

- Frontend: http://localhost:3000
- API: http://localhost:4000 (saúde em `/health`)

Sem container para as aplicações: `docker compose up -d manoa-db manoa-redis`, depois:

```bash
cd backend  && npm ci && npx prisma migrate dev && npx prisma db seed && npm run dev
cd backend  && npm run worker    # em outro terminal
cd frontend && npm ci && npm run dev
```

Testes: `npm test` em `backend/` e `frontend/`.

Variáveis principais do `.env`: `DATABASE_URL`, `REDIS_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `CORS_ORIGIN`, `PORT` e `NEXT_PUBLIC_API_URL`. O `.env` nunca vai para o Git.

## Integração futura com o backend

Hoje o frontend consome dados de uma **fake API** (`json-server` sobre `backend/db.json` local ao repositório do frontend), acessada por uma instância Axios única em `src/services/api.tsx` (`baseURL: http://localhost:3001`). Os serviços (`productService`, `artisansService`, `orderService`, `authService`) chamam rotas REST-like geradas automaticamente pelo `json-server` (`/products`, `/users`, `/orders`). Essa etapa existe apenas para permitir o desenvolvimento das telas antes do backend real estar pronto.

Quando o backend em Node.js + Express (ver seção **Stack**) estiver disponível, a troca será feita **sem alterar a assinatura dos serviços consumidos pelos componentes**, apenas a camada de infraestrutura de acesso HTTP:

1. **Trocar o `baseURL`**: `src/services/api.tsx` passa a apontar para a variável de ambiente `NEXT_PUBLIC_API_URL` (ex.: `http://localhost:4000/api`) em vez do endereço fixo do `json-server`.
2. **Remover a fake API**: `db.json`, a dependência `json-server` e os scripts `api` e `dev:full` do `package.json` são removidos assim que o backend passa a rodar via `docker compose` (conforme já documentado em **Executando localmente**).
3. **Autenticação real**: `authService.login`, que hoje busca o usuário por e-mail e compara a senha no cliente, passa a chamar `POST /api/auth/login` no Express. O backend valida a senha (hash) e devolve os tokens (access + refresh) em cookies `httpOnly`, conforme a Chain of Responsibility de middlewares (`authenticate → authorize → validate`). O `authStore` deixa de ser a única fonte de verdade da sessão e passa a hidratar o usuário a partir de um `GET /api/auth/me`, além de existir um `authService.logout` que invalida o refresh token no servidor.
4. **Endpoints equivalentes**: os métodos dos serviços mantêm o mesmo nome e contrato de retorno, apenas trocando a rota chamada:

   | Serviço | Rota hoje (fake API) | Rota futura (Express) |
   | --- | --- | --- |
   | `productService.getAll` | `GET /products` | `GET /api/products` |
   | `productService.getByCategory` | `GET /products?category=` | `GET /api/products?category=` |
   | `productService.getByArtisan` | `GET /products?artisanId=` | `GET /api/products?artisanId=` |
   | `productService.create` | `POST /products` | `POST /api/products` (autenticado, painel do artesão) |
   | `artesiansService.getAll` | `GET /users?role=artisan` | `GET /api/artisans` |
   | `artesiansService.getById` | `GET /users/:id` | `GET /api/artisans/:id` |
   | `authService.login` | `GET /users?email=` (comparação no cliente) | `POST /api/auth/login` (validação no servidor) |
   | `orderService.getAll` / `getById` / `getByUserId` | `GET /orders`, `/orders/:id`, `/orders?userId=` | `GET /api/orders`, `/api/orders/:id`, `/api/orders?userId=` |
   | `orderService.create` | `POST /orders` | `POST /api/orders` (transacional, dispara o `DomainEventBus`) |
   | `orderService.updateStatus` | `PATCH /orders/:id` | `PATCH /api/orders/:id/status` (respeita as transições do `OrderState`) |

5. **Erros e sessão expirada**: a instância Axios ganha um interceptor de resposta para tratar `401` acionando o fluxo de refresh token (rotação) antes de repetir a requisição original, hoje inexistente por não haver JWT na fake API.
6. **Tipos**: `types/user.ts`, `types/product.ts`, `types/order.ts` e `types/artisan.ts` são revisados para refletir exatamente o formato retornado pelo Express/Prisma (ex.: remoção do campo `password` da resposta, IDs no formato definitivo), evitando que o frontend dependa de um shape específico do `json-server`.

Enquanto o backend não está pronto, a fake API continua sendo a única dependência de dados do frontend; a migração é incremental, serviço por serviço, sem exigir mudanças nas páginas ou componentes que os consomem.

## Estrutura do repositório

Organização alvo, a ser construída conforme os módulos forem implementados.

```text
manoa/
├── docker-compose.yml
├── docs/                    # ficha e backlog SMART/MoSCoW
├── backend/
│   ├── prisma/              # schema, migrations, seed
│   └── src/
│       ├── config/          # env e container (injeção de dependências)
│       ├── shared/          # erros e event bus
│       ├── domain/          # entidades, estados, ports
│       ├── application/     # casos de uso e event handlers
│       ├── infra/           # prisma, cache, fila, auth, pagamento, recomendação
│       └── presentation/    # rotas, controllers, middlewares
└── frontend/src/
    ├── app/                 # rotas: (public), (buyer), (artisan), (admin)
    ├── components/          # ui/ (shadcn) e compartilhados
    ├── features/            # catalog, cart, orders, recommendations
    └── lib/                 # api-client e utilidades
```

## Convenções

- **Branches:** `main` (produção), `develop` (integração), `feature/...`, `fix/...`, `hotfix/...`.
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`).
- **Pull Requests:** partem de `develop`, citam a história (ex.: `HU-C05`), têm pelo menos uma revisão e CI verde.

## Estado atual

Em fase de definição: ficha, backlog e arquitetura especificados. Próximas entregas: autenticação, catálogo, pedidos e recomendação, começando pelas histórias Must Have.

## Fluxos do Sistema Implementados

A aplicação web full-stack abrange o ciclo completo de exposição, venda e gestão do artesanato, dividida em fluxos de experiência adaptados para cada perfil de usuário:

---

### 1. Fluxo do Artesão (Gestão e Catálogo)
* **Cadastro e Perfil:** Criação de conta e gerenciamento do perfil do artesão com dados institucionais, biografia e localização.
* **Gestão de Produtos:** Cadastro detalhado das peças, incluindo adição de imagens, preço e a técnica artesanal utilizada.
* **Painel de Controle:** Visualização e acompanhamento dos pedidos recebidos e atualização do status dos itens disponíveis no catálogo.

---

### 2. Fluxo do Comprador (Navegação e Compra)
* **Vitrine e Busca:** Acesso à página principal de produtos com mecanismos de busca e filtros por categorias, técnicas e regiões.
* **Perfil do Artesão e Detalhes:** Navegação dedicada para conhecer a história do artesão e ver o catálogo completo do produtor.
* **Carrinho de Compras:** Adição, alteração de quantidades e remoção de produtos em tempo real.
* **Checkout:** Finalização da compra.
