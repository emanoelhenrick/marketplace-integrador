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
