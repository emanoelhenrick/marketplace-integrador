# Manoa Marketplace - Backend

API REST do marketplace de artesanato pernambucano, desenvolvida com Node.js,
TypeScript, Express, Prisma e PostgreSQL.

## Tecnologias

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- JSON Web Token
- Multer
- Swagger UI e OpenAPI

## Requisitos

- Node.js 20 ou superior
- PostgreSQL
- npm

## Instalação

```bash
cd backend
npm install
cp .env.example .env
```

Configure `.env`:

```env
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/marketplace_integrador?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
```

O `JWT_SECRET` é obrigatório.

## Banco de dados

Gerar o Prisma Client:

```bash
npm run prisma:generate
```

Aplicar as migrations:

```bash
npx prisma migrate deploy
npx prisma migrate status
```

Popular dados de demonstração:

```bash
npm run db:seed
```

Abrir o Prisma Studio:

```bash
npm run prisma:studio
```

## Executar

Desenvolvimento:

```bash
npm run dev
```

Build e execução em produção:

```bash
npm run build
npm start
```

API:

- Servidor: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/docs`
- OpenAPI JSON: `http://localhost:3000/docs/swagger.json`
- Health check: `GET http://localhost:3000/`

## Autenticação

Rotas protegidas usam:

```http
Authorization: Bearer <token>
```

Perfis disponíveis:

- `client`
- `artisan`
- `admin`

### Autenticação

| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/register` | Cadastro de comprador ou artesão |
| POST | `/auth/login` | Login e geração do token JWT |
| GET | `/auth/me` | Dados do usuário autenticado |

O cadastro público aceita somente os perfis `client` e `artisan`.

## Produtos

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/products` | Público | Lista produtos ativos |
| GET | `/products/:id` | Público | Consulta detalhes de um produto |
| POST | `/products` | Artesão | Cadastra produto |
| PUT | `/products/:id` | Artesão proprietário | Atualiza produto |
| PATCH | `/products/:id/status` | Artesão proprietário | Ativa ou desativa produto |
| GET | `/products/mine` | Artesão | Lista produtos do artesão |
| GET | `/products/:id/stock` | Artesão proprietário | Consulta estoque |
| PATCH | `/products/:id/stock` | Artesão proprietário | Atualiza estoque |

Filtros públicos suportados em `GET /products`:

- `category`
- `location`
- `technique`

Exemplo:

```http
GET /products?category=Cerâmica&location=Caruaru&technique=Barro
```

O cadastro suporta JSON com URL de imagem ou `multipart/form-data`
no campo `image`. A imagem deve ser PNG ou JPEG e ter no máximo 5 MB.

## Artesãos

| Método | Rota | Descrição |
|---|---|---|
| GET | `/artisans` | Lista artesãos ativos |
| GET | `/artisans/:id` | Consulta perfil público |
| GET | `/artisans/:id/products?page=1&limit=12` | Lista produtos ativos do artesão |
| GET | `/users/:id/profile?page=1&limit=12` | Perfil público e catálogo paginado |
| PATCH | `/users/me/profile` | Atualiza o perfil do artesão autenticado |

Filtros disponíveis em `GET /artisans`:

- `craft`
- `location`
- `region`

## Carrinho

| Método | Rota | Descrição |
|---|---|---|
| GET | `/cart` | Consulta carrinho do comprador |
| POST | `/cart/items` | Adiciona item |
| PUT | `/cart/items/:productId` | Atualiza quantidade |
| DELETE | `/cart/items/:productId` | Remove item |
| DELETE | `/cart` | Limpa carrinho |

O cadastro do item usa:

```json
{
  "productId": 1,
  "quantity": 2
}
```

## Compras e pedidos

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/purchases/finalize` | Comprador | Finaliza compra simulada |
| GET | `/orders` | Comprador | Lista pedidos do comprador |
| GET | `/orders/:id` | Comprador | Consulta pedido próprio |

O checkout pode utilizar o carrinho persistido ou receber diretamente:

```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    }
  ]
}
```

O pedido recebe um ID público numérico único de seis dígitos.

## Pedidos do artesão

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/artisan/orders` | Artesão | Lista pedidos relacionados aos produtos |
| GET | `/artisan/orders/:id` | Artesão proprietário | Consulta pedido relacionado |
| PATCH | `/artisan/orders/:id/status` | Artesão proprietário | Atualiza status |

Status permitidos:

- `pending`
- `processing`
- `shipped`

## Avaliações

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/reviews` | Comprador | Cria avaliação |
| GET | `/reviews/product/:productId` | Público | Lista avaliações |
| POST | `/products/:id/reviews` | Comprador | Avalia produto comprado |
| GET | `/products/:id/reviews` | Público | Lista avaliações e média |

Regras:

- Nota inteira de 1 a 5.
- Comentário obrigatório.
- Compra aprovada obrigatória.
- Cada usuário só avalia o mesmo produto uma vez.
- Média recalculada após o registro.

## Administração

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/users` | Administrador | Lista usuários |
| PATCH | `/users/:id/status` | Administrador | Ativa ou desativa conta |
| GET | `/admin/dashboard` | Administrador | Indicadores e vendas |

Exemplo de filtro do dashboard:

```http
GET /admin/dashboard?startDate=2026-01-01&endDate=2026-12-31
```

O dashboard retorna vendas simuladas, pedidos realizados, artesãos ativos,
produtos mais vendidos e pedidos por status.

## Respostas de erro

O backend usa um formato padronizado:

```json
{
  "error": "Mensagem do erro"
}
```

Códigos principais:

- `400` — dados inválidos ou regra de negócio.
- `401` — token ausente ou inválido.
- `403` — usuário sem permissão ou conta desativada.
- `404` — recurso não encontrado.
- `500` — erro interno.

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor com hot reload |
| `npm run build` | Compila TypeScript |
| `npm start` | Executa a aplicação compilada |
| `npm run db:seed` | Executa seed do banco |
| `npm run prisma:generate` | Gera Prisma Client |
| `npm run prisma:migrate` | Executa migrations em desenvolvimento |
| `npm run prisma:studio` | Abre Prisma Studio |
