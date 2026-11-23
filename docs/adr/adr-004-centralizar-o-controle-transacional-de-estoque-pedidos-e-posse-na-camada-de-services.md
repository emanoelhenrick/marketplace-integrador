# ADR-004: Centralizar o controle transacional de estoque, pedidos e posse na camada de Services

- **Status:** Proposta
- **Data:** 2026-11-23
- **Autor:** JENNIFER ZEFERINO CRUZ DE LIMA (jzcl@cesar.school)
- **Turma:** Embarque (segundas)
- **Projeto:** Origem · marketplace da economia criativa e do artesanato de Pernambuco

## Contexto

O Manoa é um marketplace de artesanato com três perfis (comprador, artesão e administrador), desenvolvido por uma equipe pequena de estudantes no prazo de um semestre, utilizando Node.js, TypeScript, Express e Prisma. A arquitetura do backend segue a divisão em camadas (Routes -> Services -> Repositories). Como muitas peças artesanais são únicas (quantity = 1), o sistema precisa evitar vendas duplicadas em compras simultâneas, preservar o valor pago em pedidos antigos caso o preço do catálogo mude e impedir que usuários alterem registros de terceiros.

## Preocupações

integridade de dados, concorrência, consistência transacional, controle de acesso, prazo

## Decisão

Centralizar as regras de validação de perfil, consolidação de itens, congelamento de preço histórico (unitPrice), verificação de posse (artisanId) e baixa atômica de estoque (decrementStock) na camada de Services (PurchaseService, OrderService e ProductService), utilizando transações ACID do Prisma (prisma.$transaction) no fechamento da compra e mantendo as rotas restritas à borda HTTP/autenticação.

## Justificativa

Ao concentrar as validações e a baixa de estoque dentro de uma única transação no PurchaseService, o banco de dados garante o isolamento da operação. Isso atende diretamente ao cenário da etapa 2: diante de duas finalizações simultâneas para a última unidade em estoque (quantity = 1), apenas a primeira transação efetiva o decremento e cria o pedido com o unitPrice vigente, enquanto a segunda é bloqueada por saldo insuficiente, garantindo 0 pedidos duplicados e estoque sempre maior ou igual a zero, sem exigir infraestrutura extra.

## Consequências

Ganhamos: consistência imediata (ACID) na baixa de estoque e criação de pedidos; preservação do histórico financeiro por meio do campo unitPrice em OrderItemEntity; dupla trava de posse no ProductService (findOwnedProduct e updateByIdAndArtisanId); e aderência total à stack acordada sem custos adicionais de hospedagem.

Perdemos: acúmulo de responsabilidades e maior volume de código no PurchaseService, latência marginal devido ao bloqueio transacional no banco durante compras simultâneas sobre o mesmo item e dependência de disciplina em code review, já que a divisão em camadas não impede chamadas diretas ao Prisma dentro dos serviços, como ocorre na leitura e limpeza do carrinho (prisma.cart.findUnique e tx.cart.deleteMany) no PurchaseService.

## Alternativas consideradas

Orientado a Eventos (filas/mensageria): descartado porque opera com consistência eventual, o que poderia permitir vender duas vezes a última peça única (quantity = 1) antes do processamento assíncrono do evento, além de exigir brokers incompatíveis com nossa hospedagem gratuita e prazo curto.
Validação de estoque nas Routes ou no Front-end: descartada porque dispersaria regras críticas em múltiplos endpoints, abrindo brechas para condições de corrida e manipulação indevida de parâmetros.
CQRS (separação entre modelos de leitura e escrita): descartado pela duplicação de modelos e complexidade de sincronização desnecessárias para o porte da equipe e do projeto semestral.

## Rastreabilidade

**Atributo de qualidade:** Segurança (security) · Integridade

**Cenário que originou a decisão:**

> Em operação normal de produção, durante uma campanha promocional com 500 sessões ativas, dois compradores autenticados submetem simultaneamente a finalização de pedido para a última unidade em estoque (quantity = 1) de uma mesma peça artesanal na camada de serviços (OrderService e módulo de produtos) e no banco de dados. O sistema processa a operação de forma atômica, confirma apenas o primeiro pedido com o preço vigente (unitPrice), atualiza o estoque para zero e bloqueia a segunda tentativa com aviso de indisponibilidade, em 100% das requisições concorrentes, garantindo 0 pedidos duplicados para a mesma peça e estoque sempre maior ou igual a zero.

**Padrão arquitetural adotado:** Camadas

**Táticas empacotadas:** Encapsular responsabilidades por faixa; Restringir dependências a uma direção

Módulos: PurchaseService (finalizePurchase), OrderService, ProductService, ProductRepository (decrementStock), OrderRepository, OrderItemRepository; Entidades: OrderEntity, OrderItemEntity, ProductEntity (campos quantity, unitPrice e artisanId).

## Verificação

- **Teste do cenário:** Teste manual controlado utilizando duas sessões autenticadas com compradores distintos (em dois navegadores ou duas requisições disparadas simultaneamente via Insomnia/Postman) tentando finalizar a compra de um mesmo produto cadastrado previamente com quantity = 1. Após a execução, confere-se nas respostas da API e diretamente no banco de dados (via Prisma Studio) que apenas 1 pedido foi confirmado (201 Created) com o unitPrice vigente preservado, a segunda tentativa foi bloqueada com erro de estoque insuficiente (400 Bad Request), existe apenas 1 registro na tabela OrderItem para o item e o campo quantity do produto permanece igual a 0.

---

_Gerado pelo estudo dirigido de Arquitetura de Software · ADS020 · 2026.2._
