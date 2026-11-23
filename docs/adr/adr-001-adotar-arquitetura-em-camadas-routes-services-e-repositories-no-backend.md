# ADR-001: Adotar arquitetura em camadas (Routes, Services e Repositories) no backend

- **Status:** Proposta
- **Data:** 2026-11-23
- **Autor:** EMANOEL HENRICK ALVES DA SILVA (ehas2@cesar.school)
- **Turma:** Embarque (segundas)
- **Projeto:** Origem · marketplace da economia criativa e do artesanato de Pernambuco

## Contexto

O Manoa é um marketplace de artesanato com três perfis (cliente, artesão e administrador). A equipe é pequena, o prazo é curto e algumas pessoas alteram o mesmo código. O backend usa Node.js, TypeScript, Express e Prisma, e já está organizado em pastas de rotas, services e repositories, mas essa regra nunca foi formalizada, e alguns pontos a violam.

## Preocupações

modificabilidade, modularidade, custo de mudança, testabilidade, prazo

## Decisão

Adotar e formalizar a arquitetura em camadas, com dependências em uma única direção: as rotas tratam só de HTTP e autorização, os services concentram as regras de negócio e os repositories são o único ponto de acesso ao banco.

## Justificativa

Com cada responsabilidade em uma camada e dependências em uma só direção, a regra de negócio fica em um lugar e o acesso a dados em outro. Isso mantém a mudança localizada. O padrão é simples e adequado à experiência e ao prazo da equipe.

## Consequências

Ganhamos: mudanças de regra concentradas nos services, ajustes de consulta restritos aos repositories, padrão fácil de explicar e de revisar em pull requests e transações (como a compra com baixa de estoque) em um único lugar. 

Perdemos: mais arquivos e código repetitivo (o mapeamento de produto aparece em vários services), risco de services inchados (como o PurchaseService) e dependência de disciplina em code review. A estrutura por camada também não impede um módulo de acessar as tabelas de outro, e hoje carrinho, avaliações acessam produtos diretamente, compra faz do mesmo jeito com o carrinho. A correção do filtro de técnica exigiu 5 arquivos, porque o campo se repete em mais de um service.

## Alternativas consideradas

Tudo nas rotas: mais rápido no início, mas mistura HTTP, regra de negócio e acesso a dados e leva a código duplicado.
Arquitetura hexagonal: isola melhor o domínio, mas exige interfaces e mapeamentos demais para uma equipe pequena e um prazo curto.
Microsserviços: a escalabilidade independente não é necessária agora e traria complexidade de deploy e de consistência de dados, como a transação que baixa o estoque e cria o pedido ao mesmo tempo.

## Rastreabilidade

**Atributo de qualidade:** Manutenibilidade · Modificabilidade

**Cenário que originou a decisão:**

> Um desenvolvedor da equipe recebe a demanda de acrescentar o filtro por técnica ao catálogo de produtos. Em ambiente de desenvolvimento, a alteração é concluída sem modificar as rotas nem os módulos de pedidos, carrinho e avaliações, alterando no máximo 5 arquivos de src/.

**Padrão arquitetural adotado:** Camadas

**Táticas empacotadas:** Encapsular responsabilidades por faixa; Restringir dependências a uma direção; Usar intermediário entre camadas

Módulos: produtos (product.validator.ts, product.service.ts, product.repository.ts).
Funcionalidade: filtro de catálogo por técnica (GET /products?technique=).
Migration: backfill_product_technique.

## Verificação

- **Teste do cenário:** Um teste manual em GET /products?technique=Barro que confirma que só voltam produtos com essa técnica e que a combinação com category e location funciona.

---

_Gerado pelo estudo dirigido de Arquitetura de Software · ADS020 · 2026.2._
