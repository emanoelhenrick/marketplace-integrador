# Revisão Crítica de Código — `orderService.ts`

## 1. Code Smell Identificado

- **Tipo:** Mistura de Responsabilidades / Regra de Negócio no Cliente (*Feature Envy / Misplaced Business Logic*) e Coerção Defensiva Duplicada (`String(id)`).
- **Localização:** `src/services/orderService.ts` (métodos `getByArtisan`, linhas 19–24, e `markItemsPacked`, linhas 38–53).
- **Descrição:** O serviço HTTP realiza filtragem de pedidos em memória no front-end (`getByArtisan`), calcula transição de estado de domínio (`allPacked → "shipped"`) e repete conversões explícitas de tipo (`String(...)`) na comparação de `artisanId`.

## 2. Análise de Impacto

- **Coesão e Acoplamento:** O módulo concentra tanto o transporte HTTP quanto regras de domínio de pedidos. Caso o back-end passe a assumir essas regras, o serviço precisará ser alterado.
- **Legibilidade e Manutenibilidade:** Apesar da mistura de responsabilidades, o arquivo possui apenas 54 linhas, métodos curtos, tipagem estrita em TypeScript e documentação JSDoc clara.

## 3. Decisão Técnica: Não Refatorar

Optou-se por **manter a implementação atual** pelos seguintes motivos técnicos:

1. **Limitação da Arquitetura de Back-end (API Mock / REST Simples):** O endpoint `/orders` utilizado no Projeto Integrador não oferece suporte nativo a filtros por atributos dentro de arrays aninhados (`items[].artisanId`) nem endpoints transacionais de domínio (como `PATCH /orders/:id/pack`). Mover essa lógica para o servidor exigiria alterar o escopo da API, enquanto quebrar o arquivo atual em múltiplos submódulos no front-end apenas deslocaria o mesmo código de lugar sem resolver a limitação arquitetural.

2. **Tipagem Defensiva Necessária (`number | string`):** Em ambientes que alternam entre mocks JSON e bancos relacionais, IDs podem trafegar como número ou string. Manter `String(a) === String(b)` protege a aplicação contra falhas silenciosas de comparação estrita (`===`).

3. **Princípio YAGNI e Prevenção de Over-engineering:** Com apenas 7 métodos coesos em torno da entidade `Order`, fragmentar esse serviço em camadas extras (ex.: `orderMapper`, `orderDomain`, `orderRepository`) adicionaria complexidade acidental e indireção desnecessária para o porte atual do projeto.

## 4. Riscos e Limitações Reconhecidos

- **Escalabilidade:** O método `getByArtisan` trafega todos os pedidos na rede antes de filtrar. Em ambiente de produção com alto volume de dados, essa abordagem deverá ser substituída por paginação e filtragem no servidor.

---

# Revisão Crítica de Código — `order.repository.ts`

## 1. Code Smell Identificado

- **Tipo:** Código Duplicado (*Duplicate Code*) e Mapeamento Repetitivo de Persistência (*Repeated Entity Mapping*).
- **Localização:** `backend/src/repositories/order.repository.ts` (métodos `findAll`, `findByUserId`, `findByIdAndUserId`, `findById`, `create` e `update`).
- **Descrição:** A classe repete 6 vezes o mesmo bloco de instanciação de `OrderEntity` (`new OrderEntity({ ...order, status: order.status as OrderStatus, totalAmount: Number(order.totalAmount) })`), além de repetir a cláusula `include: { items: true }` em 6 consultas distintas.

## 2. Análise de Impacto

- **Manutenibilidade e Extensibilidade:** Qualquer alteração no construtor de `OrderEntity` ou a inclusão de um novo campo numérico (`Decimal` no Prisma) exige editar 6 pontos diferentes na classe, elevando o risco de bugs por esquecimento.
- **Coesão e Legibilidade:** A repetição do código de conversão polui os métodos de consulta, dificultando a leitura rápida de cada operação.

## 3. Decisão Técnica: Refatorar

Optou-se por **refatorar a classe** aplicando a técnica **Extract Method**:

1. **Extração de Mapeador Privado (`toEntity`):** Centralização da conversão entre o modelo retornado pelo Prisma e `OrderEntity` em um único método privado `toEntity`.
2. **Padronização da Cláusula de Inclusão (`ORDER_WITH_ITEMS_INCLUDE`):** Extração da configuração `include: { items: true }` tipada com `satisfies Prisma.OrderInclude`.
3. **Ajuste de Contrato de Retorno (`update`):** Remoção de `| null` inalcançável no tipo de retorno do método `update`, alinhando a assinatura TypeScript ao comportamento real do `prisma.order.update`.

## 4. Riscos e Limitações Reconhecidos

- **Risco:** Baixo. A refatoração é estritamente interna à classe e preserva integralmente as assinaturas públicas e o comportamento em tempo de execução.
- **Limitação:** Os métodos `findByArtisanId` e `findByIdForArtisan` continuam retornando o tipo projetado `OrderWithArtisanItems` (com `product.name` aninhado) em vez de `OrderEntity`, pois atendem à visão específica do painel do artesão sem quebrar os consumidores atuais.
