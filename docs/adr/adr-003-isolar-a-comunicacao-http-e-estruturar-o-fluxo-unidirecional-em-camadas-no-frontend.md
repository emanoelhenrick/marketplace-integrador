# ADR-003: Isolar a comunicação HTTP e estruturar o fluxo unidirecional em camadas no frontend

- **Status:** Proposta
- **Data:** 2026-11-23
- **Autor:** RAIELE LEITE DA SILVA (rls6@cesar.school)
- **Turma:** Embarque (segundas)
- **Projeto:** Origem · marketplace da economia criativa e do artesanato de Pernambuco

## Contexto

O projeto consiste no desenvolvimento da interface do marketplace Manoa, voltado a clientes, artesãos e administradores, dentro do prazo de um semestre por uma equipe pequena de estudantes que cursam outras disciplinas em paralelo. Seguindo a stack acordada com Desenvolvimento Web em Next.js com App Router, React, TypeScript, Axios e Zustand, a base de código já apresenta uma organização inicial nas pastas app, components, hooks, services, lib, store e types. Contudo, a falta de um padrão arquitetural formalizado permitiu o surgimento de acoplamentos indevidos, a exemplo de componentes visuais que realizam chamadas HTTP diretamente e hooks que executam regras de filtragem de responsabilidade do servidor.

## Preocupações

modificabilidade, modularidade, custo de mudança, testabilidade, prazo

## Decisão

Estabelecer formalmente a arquitetura em camadas com fluxo de dependência unidirecional no frontend, onde app e components cuidam exclusivamente da interface visual, hooks gerenciam o estado e o fluxo de cada tela, services encapsulam as chamadas HTTP por domínio e o arquivo services/api.ts centraliza a instância do Axios, o token de autorização e o tratamento global de erro 401.

## Justificativa

Ao separar a camada visual das regras de transporte HTTP e restringir as dependências a uma única direção, mudanças nos parâmetros de busca ou nos contratos da API ficam isoladas nas camadas inferiores sem afetar os componentes visuais genéricos ou domínios vizinhos. Isso permite atender diretamente ao cenário de evolução do catálogo tocando no máximo 4 arquivos e aproveita a estrutura de pastas já existente no projeto dentro do prazo curto do semestre.

## Consequências

Ganhamos a blindagem da interface visual contra mudanças de endpoints concentradas em endpoints.ts e nos arquivos de services, o tratamento unificado de autenticação e expiração de sessão em api.ts, o reaproveitamento seguro de componentes como FilterPanel e o isolamento de fluxos críticos como o fechamento de pedido no hook use-checkout. Perdemos com o aumento do número de arquivos e código repetitivo, totalizando cerca de 25 hooks e 10 services para um sistema pequeno, além do risco de criação de hooks excessivamente grandes e da dependência de disciplina nas revisões de código para evitar saltos de camada, como ocorre hoje no componente reviewer-name.tsx que importa api diretamente fora de endpoints.ts e no hook use-catalog que duplica regras de filtragem de estoque do servidor.

## Alternativas consideradas

Chamadas HTTP diretas nas páginas e componentes foram descartadas porque misturam interface, estado e rede, gerando duplicação de código e URLs espalhadas. A arquitetura de Portas e Adaptadores foi descartada porque, embora ofereça maior isolamento de domínio, exige interfaces e mapeamentos extras que violam as restrições de prazo de um semestre e equipe reduzida. A reorganização completa por funcionalidade em pastas de domínio foi descartada pelo alto custo de refatoração no cronograma atual, e a adoção de bibliotecas como TanStack Query ficou registrada apenas como evolução futura para não adicionar nova curva de aprendizado agora.

## Rastreabilidade

**Atributo de qualidade:** Manutenibilidade · Modificabilidade

**Cenário que originou a decisão:**

> Em ambiente de desenvolvimento, fora de operação, um desenvolvedor da equipe recebe a demanda de acrescentar o filtro por material ao catálogo de produtos nos módulos de tipagem, constantes, estado e vitrine do frontend. O sistema conclui a implementação do filtro sem modificar a camada de serviços HTTP, os componentes visuais genéricos nem os módulos de pedidos, carrinho e avaliações, alterando no máximo 4 arquivos dentro da pasta src e passando na verificação estática de camadas sem nenhuma importação direta de serviços nas telas dentro de um ciclo de sprint.

**Padrão arquitetural adotado:** Camadas

**Táticas empacotadas:** Encapsular responsabilidades por faixa; Restringir dependências a uma direção; Usar intermediário entre camadas

Módulos de catálogo envolvidos: app/products/page.tsx, product-filters.tsx, hooks/use-catalog.ts, services/productService.ts, lib/constants.ts e types/product.ts. Funcionalidade de busca e filtragem na vitrine pelo endpoint GET /products.

## Verificação

- **Teste do cenário:** Implementar o filtro por material em uma branch isolada de desenvolvimento e conferir pelo comando git diff --stat que no máximo 4 arquivos dentro de src foram modificados, sem alterações em services, components/ui, orders, cart ou reviews. Em seguida, realizar o teste manual na rota /products selecionando um material e confirmando na aba de rede do navegador o envio do parâmetro material na URL, o retorno exclusivo de produtos compatíveis, a combinação simultânea com técnica e região e a limpeza completa dos filtros.

---

_Gerado pelo estudo dirigido de Arquitetura de Software · ADS020 · 2026.2._
