# Meu Projeto

API REST com Node.js, TypeScript, Express e Prisma.

## Estrutura

```
meu-projeto/
├── prisma/
│   └── schema.prisma     # Modelos do banco de dados
├── src/
│   ├── routes/
│   │   └── user.routes.ts
│   ├── app.ts             # Configuração do Express
│   ├── prisma.ts          # Cliente Prisma
│   └── server.ts          # Ponto de entrada
├── .env.example
├── package.json
└── tsconfig.json
```

## Como rodar

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Copie o arquivo de variáveis de ambiente e configure sua URL do banco:
   ```bash
   cp .env.example .env
   ```

3. Rode a primeira migration (cria as tabelas no banco):
   ```bash
   npx prisma migrate dev --name init
   ```

4. Inicie o servidor em modo desenvolvimento:
   ```bash
   npm run dev
   ```

O servidor sobe em `http://localhost:3000`.

## Rotas de exemplo (`/users`)

| Método | Rota         | Descrição              |
|--------|--------------|-------------------------|
| GET    | /users       | Lista todos os usuários |
| GET    | /users/:id   | Busca um usuário por id |
| POST   | /users       | Cria um usuário         |
| PUT    | /users/:id   | Atualiza um usuário     |
| DELETE | /users/:id   | Remove um usuário       |

## Rotas de pedidos (`/orders`)

| Método | Rota        | Descrição                         |
|--------|-------------|-----------------------------------|
| GET    | /orders     | Lista os pedidos do usuário       |
| GET    | /orders/:id | Busca um pedido do usuário por id |

## Rotas de pedidos do artesão (`/artisan/orders`)

| Método | Rota                | Descrição                             |
|--------|---------------------|---------------------------------------|
| GET    | /artisan/orders     | Lista pedidos dos produtos do artesão |
| GET    | /artisan/orders/:id | Busca um pedido do artesão por id     |

## Rotas de produtos (`/products`)

| Método | Rota      | Descrição              |
|--------|-----------|------------------------|
| POST   | /products | Cadastra um produto    |

## Rota de catálogo (`GET /products?category=`)

| Método | Rota                         | Descrição                                      |
|--------|------------------------------|------------------------------------------------|
| GET    | /products                    | Lista produtos ativos                           |
| GET    | /products?category=<texto>   | Filtra produtos ativos por categoria            |
| GET    | /products/:id                | Busca um produto ativo por id                   |

Os filtros de técnica e região ainda não estão implementados.

## Rotas de estoque (`/products/mine`, `/products/:id/stock`)

| Método | Rota               | Descrição                         |
|--------|--------------------|-----------------------------------|
| GET    | /products/mine     | Lista o estoque do artesão        |
| GET    | /products/:id/stock | Consulta o estoque de um produto  |

O catálogo do artesão em `/products/mine` também retorna `stars`, `location`, `image` e `description`.

As respostas de produto que incluem `quantity` também incluem `available`, calculado como `quantity > 0 && active`. Estoque zero torna o produto indisponível sem alterar `active`.

Quantidade aceita apenas inteiros maiores ou iguais a zero, incluindo `0`, com limite máximo de `2147483647`. Valores negativos, decimais, texto e notação científica são rejeitados.

## Rotas de alteração de produto (`/products/:id`, `/products/:id/status`, `/products/:id/stock`)

| Método | Rota                 | Descrição                    |
|--------|----------------------|------------------------------|
| PUT    | /products/:id        | Edita um produto             |
| PATCH  | /products/:id/status | Atualiza o status do produto |
| PATCH  | /products/:id/stock  | Atualiza o estoque do produto |

## Scripts

- `npm run dev` — inicia com hot reload
- `npm run build` — compila TypeScript para `dist/`
- `npm start` — roda a versão compilada
- `npm run prisma:generate` — gera o Prisma Client
- `npm run prisma:migrate` — cria/aplica migrations
- `npm run prisma:studio` — abre interface visual do banco

## Próximos passos sugeridos

- Adicionar validação de dados (ex: Zod)
- Adicionar autenticação (ex: JWT)
- Separar lógica em controllers/services
- Adicionar testes (ex: Jest ou Vitest)
