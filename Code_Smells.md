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