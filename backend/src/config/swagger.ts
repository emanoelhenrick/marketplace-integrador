import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Manoa Marketplace API",
      version: "1.0.0",
      description:
        "API do marketplace de artesanato pernambucano, incluindo vitrine, catálogo, carrinho, pedidos e avaliações.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", format: "password" },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string", format: "password" },
            role: { type: "string", enum: ["client", "artisan"] },
            avatarUrl: { type: "string", nullable: true },
            phone: { type: "string", nullable: true },
            craft: { type: "string", nullable: true },
            craftYears: { type: "string", nullable: true },
            quote: { type: "string", nullable: true },
            location: { type: "string", nullable: true },
            polo: { type: "string", nullable: true },
            region: { type: "string", nullable: true },
            totalWorks: { type: "integer", nullable: true },
          },
        },
        Product: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            price: { type: "number" },
            category: { type: "string" },
            technique: { type: "string", nullable: true },
            location: { type: "string" },
            municipality: { type: "string" },
            image: { type: "string", nullable: true },
            description: { type: "string", nullable: true },
            quantity: { type: "integer" },
            active: { type: "boolean" },
            available: { type: "boolean" },
          },
        },
        CreateProductRequest: {
          type: "object",
          required: ["name", "category", "technique", "municipality", "price", "quantity"],
          properties: {
            name: { type: "string" },
            category: { type: "string" },
            technique: { type: "string" },
            municipality: { type: "string" },
            price: { type: "number" },
            quantity: { type: "integer", minimum: 0 },
            description: { type: "string" },
            image: { type: "string", format: "binary" },
          },
        },
        StockUpdateRequest: {
          type: "object",
          required: ["quantity"],
          properties: {
            quantity: { type: "integer", minimum: 0 },
          },
        },
        CartItemRequest: {
          type: "object",
          required: ["productId", "quantity"],
          properties: {
            productId: { type: "integer" },
            quantity: { type: "integer", minimum: 1 },
          },
        },
        PurchaseRequest: {
          type: "object",
          properties: {
            items: {
              type: "array",
              items: {
                type: "object",
                required: ["productId", "quantity"],
                properties: {
                  productId: { type: "integer" },
                  quantity: { type: "integer", minimum: 1 },
                },
              },
            },
          },
        },
        ReviewRequest: {
          type: "object",
          required: ["productId", "rating", "comment"],
          properties: {
            productId: { type: "integer" },
            orderId: { type: "string", nullable: true },
            rating: { type: "integer", minimum: 1, maximum: 5 },
            comment: { type: "string" },
          },
        },
        ArtisanOrderStatusRequest: {
          type: "object",
          required: ["status"],
          properties: {
            status: {
              type: "string",
              enum: ["Pendente", "Em Produção", "Enviado", "pending", "processing", "shipped"],
            },
          },
        },
      },
    },
    tags: [
      { name: "Autenticação" },
      { name: "Produtos" },
      { name: "Artesãos" },
      { name: "Carrinho" },
      { name: "Pedidos" },
      { name: "Avaliações" },
      { name: "Administração" },
    ],
    paths: {
      "/auth/register": {
        post: {
          tags: ["Autenticação"],
          summary: "Cadastrar usuário",
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/RegisterRequest" } } } },
          responses: { 201: { description: "Usuário criado" }, 400: { description: "Dados inválidos" } },
        },
      },
      "/auth/login": {
        post: {
          tags: ["Autenticação"],
          summary: "Autenticar usuário",
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/LoginRequest" } } } },
          responses: { 200: { description: "Token JWT" }, 401: { description: "Credenciais inválidas" } },
        },
      },
      "/auth/me": {
        get: {
          tags: ["Autenticação"],
          summary: "Consultar usuário autenticado",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Usuário autenticado" }, 401: { description: "Não autenticado" } },
        },
      },
      "/products": {
        get: {
          tags: ["Produtos"],
          summary: "Listar vitrine",
          parameters: [
            { name: "category", in: "query", schema: { type: "string" } },
            { name: "municipality", in: "query", schema: { type: "string" } },
            { name: "technique", in: "query", schema: { type: "string" } },
          ],
          responses: { 200: { description: "Lista de produtos", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Product" } } } } } },
        },
        post: {
          tags: ["Produtos"],
          summary: "Cadastrar produto",
          security: [{ bearerAuth: [] }],
          requestBody: { required: true, content: { "multipart/form-data": { schema: { $ref: "#/components/schemas/CreateProductRequest" } } } },
          responses: { 201: { description: "Produto criado" }, 400: { description: "Dados inválidos" }, 403: { description: "Sem permissão" } },
        },
      },
      "/products/{id}": {
        get: {
          tags: ["Produtos"],
          summary: "Consultar detalhes do produto",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: { 200: { description: "Detalhes do produto" }, 404: { description: "Produto não encontrado" } },
        },
      },
      "/products/{id}/stock": {
        patch: {
          tags: ["Produtos"],
          summary: "Atualizar estoque",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/StockUpdateRequest" } } } },
          responses: { 200: { description: "Estoque atualizado" }, 400: { description: "Quantidade inválida" }, 403: { description: "Sem permissão" }, 404: { description: "Produto não encontrado" } },
        },
      },
      "/users/{id}/profile": {
        get: {
          tags: ["Artesãos"],
          summary: "Consultar perfil público do artesão",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
            { name: "page", in: "query", schema: { type: "integer", minimum: 1, default: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 24, default: 12 } },
          ],
          responses: { 200: { description: "Perfil e catálogo paginado" }, 404: { description: "Artesão não encontrado" } },
        },
      },
      "/users/me/profile": {
        patch: {
          tags: ["Artesãos"],
          summary: "Atualizar perfil do artesão",
          security: [{ bearerAuth: [] }],
          requestBody: { required: true, content: { "multipart/form-data": { schema: { type: "object", properties: { avatar: { type: "string", format: "binary" }, quote: { type: "string" }, location: { type: "string" }, culturalSeal: { type: "boolean" } } } } } },
          responses: { 200: { description: "Perfil atualizado" }, 403: { description: "Sem permissão" } },
        },
      },
      "/cart": {
        get: {
          tags: ["Carrinho"],
          summary: "Consultar carrinho",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Carrinho atual" } },
        },
        delete: {
          tags: ["Carrinho"],
          summary: "Limpar carrinho",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Carrinho vazio" } },
        },
      },
      "/cart/items": {
        post: {
          tags: ["Carrinho"],
          summary: "Adicionar item ao carrinho",
          security: [{ bearerAuth: [] }],
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CartItemRequest" } } } },
          responses: { 201: { description: "Item adicionado" }, 400: { description: "Quantidade ou estoque inválido" } },
        },
      },
      "/purchases/finalize": {
        post: {
          tags: ["Pedidos"],
          summary: "Finalizar compra simulada",
          security: [{ bearerAuth: [] }],
          requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/PurchaseRequest" } } } },
          responses: { 201: { description: "Pedido aprovado" }, 400: { description: "Carrinho ou estoque inválido" } },
        },
      },
      "/orders": {
        get: {
          tags: ["Pedidos"],
          summary: "Listar pedidos do comprador",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Pedidos do usuário autenticado" } },
        },
      },
      "/orders/{id}": {
        get: {
          tags: ["Pedidos"],
          summary: "Consultar pedido do comprador",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Pedido encontrado" }, 404: { description: "Pedido não encontrado" } },
        },
      },
      "/artisan/orders": {
        get: {
          tags: ["Pedidos"],
          summary: "Listar pedidos recebidos pelo artesão",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Pedidos relacionados ao artesão" } },
        },
      },
      "/artisan/orders/{id}/status": {
        patch: {
          tags: ["Pedidos"],
          summary: "Atualizar status do pedido",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ArtisanOrderStatusRequest" } } } },
          responses: { 200: { description: "Status atualizado" }, 400: { description: "Status inválido" }, 403: { description: "Sem permissão" } },
        },
      },
      "/reviews": {
        post: {
          tags: ["Avaliações"],
          summary: "Criar avaliação",
          security: [{ bearerAuth: [] }],
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ReviewRequest" } } } },
          responses: { 201: { description: "Avaliação criada" }, 403: { description: "Compra não autorizada" } },
        },
      },
      "/products/{id}/reviews": {
        get: {
          tags: ["Avaliações"],
          summary: "Listar avaliações do produto",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: { 200: { description: "Avaliações e média" }, 404: { description: "Produto não encontrado" } },
        },
      },
      "/admin/dashboard": {
        get: {
          tags: ["Administração"],
          summary: "Consultar indicadores globais",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "startDate", in: "query", schema: { type: "string", format: "date" } },
            { name: "endDate", in: "query", schema: { type: "string", format: "date" } },
          ],
          responses: { 200: { description: "KPIs e produtos mais vendidos" }, 403: { description: "Somente administradores" } },
        },
      },
    },
  },
  apis: [],
});
