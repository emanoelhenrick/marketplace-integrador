# ADR-005: Adotar arquitetura em camadas no back-end com isolamento transacional na camada de serviços

- **Status:** Aceita
- **Data:** 2026-11-23
- **Autor:** FELIPE LOPES DE VASCONCELOS (flv@cesar.school)
- **Turma:** Embarque (segundas)
- **Projeto:** Origem · marketplace da economia criativa e do artesanato de Pernambuco

## Contexto

O Projeto Origem é um marketplace de artesanato desenvolvido por uma equipe pequena de estudantes no prazo de um semestre letivo, com orçamento zero de infraestrutura (hospedagem gratuita) e stack acordada com as disciplinas de Desenvolvimento Web e Banco de Dados (Node.js/Express, TypeScript, Prisma ORM e banco relacional). Como as peças artesanais possuem estoque limitado ou único e um mesmo carrinho pode reunir produtos de diferentes artesãos, a prioridade arquitetural é garantir confiabilidade e consistência atômica de estoque durante o checkout.

## Preocupações

confiabilidade, consistência transacional, tolerância a falhas, prazo, custo de infraestrutura, manutenibilidade, testabilidade

## Decisão

Adotar o padrão arquitetural em Camadas no back-end (Rotas HTTP, Serviços de Domínio, Repositórios de Persistência e ORM Prisma), concentrando a orquestração do checkout e o controle de transações atômicas na camada de serviços.

## Justificativa

A separação em camadas permite que o serviço de compras (PurchaseService) coordene múltiplas operações nos repositórios (OrderRepository, OrderItemRepository e ProductRepository) dentro de uma única transação atômica do banco de dados (prisma.$transaction). Diante de compras simultâneas da última unidade de uma peça ou falhas intermediárias, o banco garante consistência imediata com rollback integral em menos de 1 segundo, impedindo estoque negativo ou vendas duplicadas sem exigir infraestrutura externa complexa.

## Consequências

Positivas: Clareza na divisão de responsabilidades, facilidade de onboarding para a equipe estudantil, baixo custo de infraestrutura e garantia forte de integridade transacional nas vendas.
Negativas: Latência marginal devido à passagem das requisições por múltiplas camadas e risco de código burocrático ("sumidouro") em operações simples de CRUD, onde o serviço apenas repassa chamadas ao repositório sem lógica de domínio adicional.

## Alternativas consideradas

Orientado a Eventos e CQRS: Descartados porque introduzem consistência eventual — incompatível com a necessidade de bloquear imediatamente a venda duplicada de peças únicas — e exigem mensageria/filas adicionais que ultrapassam o orçamento zero de infraestrutura e o prazo de um semestre da equipe.
Portas e Adaptadores (Hexagonal): Descartado por adicionar sobrecarga inicial de interfaces, adaptadores e mapeamentos extras desnecessários para o escopo e o cronograma do projeto.

## Rastreabilidade

**Atributo de qualidade:** Confiabilidade · Tolerância a falhas

**Cenário que originou a decisão:**

> Durante a operação normal do marketplace em produção, dois compradores submetem simultaneamente o checkout da última unidade disponível de uma mesma peça artesanal no serviço de compras (PurchaseService). O sistema executa a operação dentro de uma transação atômica, confirma o pedido do primeiro comprador, realiza o rollback integral da segunda requisição sem alterar o estoque e informa a indisponibilidade ao segundo usuário em até 1 segundo, garantindo 100% de consistência entre pedidos e saldo de estoque (zero vendas duplicadas ou estoque negativo).

**Padrão arquitetural adotado:** Camadas

**Táticas empacotadas:** Encapsular responsabilidades por faixa; Restringir dependências a uma direção; Usar intermediário entre camadas

Módulos afetados: backend/src/routes/purchase.routes.ts, backend/src/services/purchase.service.ts, backend/src/repositories/order.repository.ts, backend/src/repositories/order-item.repository.ts e backend/src/repositories/product.repository.ts.

## Verificação

- **Teste do cenário:** Teste automatizado de integração / concorrência sobre o endpoint POST /purchases disparando duas requisições simultâneas (Promise.all) para compra da última unidade (stock = 1) de um mesmo produto: verifica-se que exatamente uma requisição retorna status HTTP 201 Created reduzindo o estoque para 0, enquanto a segunda recebe erro de negócio (400/409) em menos de 1 segundo, mantendo stock = 0 e apenas 1 registro persistido nas tabelas Order e OrderItem.

---

_Gerado pelo estudo dirigido de Arquitetura de Software · ADS020 · 2026.2._
