# ADR-003: Padronização do fluxo unidirecional em camadas no Frontend (UI, Hooks e Services)

- **Status:** Proposta
- **Data:** 2026-11-23
- **Autora:** Raiele Leite da Silva (rls6@cesar.school)
- **Turma:** Embarque (segundas)
- **Projeto:** Origem · marketplace da economia criativa e do artesanato de Pernambuco

## 1. Problema e Contexto
O projeto consiste no desenvolvimento da interface do marketplace **Manoa**, voltado a clientes, artesãos e administradores. A base de código em **Next.js com App Router, React, TypeScript, Axios e Zustand** já apresenta uma organização inicial nas pastas `app/`, `components/`, `hooks/`, `services/`, `lib/`, `store/` e `types/`.

Contudo, a falta de um padrão arquitetural formalizado permitiu o surgimento de acoplamentos indevidos, a exemplo de componentes visuais que realizam chamadas HTTP diretamente e hooks que executam regras de filtragem de responsabilidade do servidor. Sem fronteiras bem definidas, ajustes simples nos contratos da API ou na autenticação tendem a gerar modificações espalhadas por diversas telas.

**Drivers Arquiteturais:** Modificabilidade, isolamento de UI, testabilidade de fluxos e velocidade de entrega.

## 2. Decisão Arquitetural
Estabelecer formalmente o **fluxo de dados unidirecional em camadas** para o frontend, proibindo saltos entre níveis e definindo fronteiras rígidas de responsabilidade:

```
app/ + components/  →  hooks/  →  services/  →  api.ts (Axios)  →  backend
        (UI)          (estado/fluxo)  (HTTP)      (token, 401)
types/, lib/ e store/ são usados por todas as camadas, sem depender delas.
```
* **Camada Visual (`app/` e `components/`):** Foca estritamente na renderização da interface, estilização (`theme.ts`) e captura de interações do usuário. É expressamente proibido importar clientes HTTP ou conhecer rotas da API nesta camada.
* **Camada de Orquestração (`hooks/`):** Gerencia o ciclo de vida assíncrono (`loading`, erros, estados de tela) e coordena ações complexas do usuário, atuando como ponte entre a tela e os serviços.
* **Camada de Integração (`services/`):** Encapsula a comunicação externa por domínio, utilizando o dicionário centralizado `endpoints.ts` para mapear requisições e respostas.
* **Infraestrutura HTTP (`services/api.ts`):** Única instância configurada do Axios na aplicação, centralizando a URL base, a injeção automática do cabeçalho `Authorization` e a interceptação global de erros `401` (sessão expirada).
* **Núcleo Compartilhado (`types/`, `lib/` e `store/`):** Módulos transversais de tipagem, utilitários e estado global. Podem ser consumidos por qualquer camada superior, mas não devem possuir dependências reversas com telas ou serviços.

## 3. Racional da Escolha
Isolar a camada visual das regras de transporte HTTP permite que a interface evolua de forma independente das mudanças de contrato do servidor. Caso um payload seja alterado ou a estratégia de autenticação mude, o impacto fica restrito a `services/` e `api.ts`, mantendo os componentes de UI intactos e reutilizáveis. O modelo aproveita a estrutura já existente no projeto, evitando retrabalho de migração dentro de um cronograma enxuto.

## 4. Impactos e Trade-offs

### Benefícios Esperados
* **Blindagem da UI:** Componentes genéricos (`components/ui`, `FilterPanel`) tornam-se agnósticos à origem dos dados, facilitando testes e reaproveitamento entre os perfis de cliente e artesão.
* **Ponto único de autenticação:** Políticas de segurança, tokens e redirecionamento por falha de autenticação (`401`) são mantidos em um só arquivo (`api.ts`).
* **Encapsulamento de fluxos críticos:** Operações sensíveis, como o processo de compra em `use-checkout` (validação, polling de estoque, idempotência e tratamento de conflito `409`), ficam isoladas e auditáveis.

### Limitações e Dívidas Técnicas Identificadas
* **Custo de indireção:** Aumento no volume de arquivos e código estrutural (atualmente ~25 hooks e ~10 services) para fluxos relativamente simples.
* **Concentração de complexidade em hooks:** Risco de criação de *God Hooks* (como o `use-checkout` acumulando múltiplas responsabilidades) caso não sejam quebrados em hooks menores.
* **Vazamentos existentes a corrigir:** A divisão de pastas por si só não bloqueia importações indevidas via linter, e duas violações atuais precisam ser saneadas:
  1. **Acoplamento direto à API:** O componente `reviewer-name.tsx` importa `api` diretamente, declara a rota `/users/${id}` de forma literal fora de `ENDPOINTS` e tenta ler `response.name` em vez de `response.data.name` (fazendo o nome do avaliador falhar e exibir sempre o valor padrão).
  2. **Duplicação de regra de servidor:** O hook `use-catalog` manipula estados de estoque localmente (forçando `stock >= 1` e convertendo `out_of_stock` para `in_stock`) e reaplica filtros no navegador que já são processados pelo backend.

## 5. Alternativas Descartadas
* **Chamadas HTTP diretas nas páginas/componentes:** Embora acelere a prototipação inicial, gera duplicação de requisições, espalha URLs pela interface e dificulta o tratamento padronizado de erros.
* **Adoção imediata de TanStack Query ou SWR:** Eliminaria a necessidade de hooks manuais de controle assíncrono (`useAsync`) e traria cache nativo, mas introduziria uma nova dependência e curva de aprendizado no momento. Permanece como evolução natural futura, pois aproveitará intacta a camada `services/`.
* **Arquitetura orientada a domínios (*Feature-Sliced / Feature-based*):** Proporcionaria maior coesão ao agrupar telas, hooks e serviços por funcionalidade (ex.: `features/catalog`), porém exigiria uma reestruturação profunda dos diretórios atuais incompatível com o prazo da entrega.

## 6. Rastreabilidade e Cenário de Qualidade
* **Atributo de Qualidade:** Manutenibilidade e Modificabilidade de Interface.
* **Táticas Arquiteturais:** Separação de interesses por camada; controle de dependência unidirecional; fachada de acesso remoto (`services/api.ts`).
* **Cenário de Modificabilidade (Catálogo):** Ao demandar a inclusão de um novo filtro por **material** na vitrine de produtos (`GET /products`), a evolução deve ser concluída sem tocar na camada de `services/`, nos componentes visuais genéricos (`components/ui`) ou nos domínios de carrinho, pedidos e avaliações, restringindo-se a **4 arquivos** em `src/`:
  1. `types/product.ts` — inclusão do atributo opcional em `ProductQuery`;
  2. `lib/constants.ts` — definição do domínio de opções de materiais;
  3. `hooks/use-catalog.ts` — atualização do estado reativo dos filtros;
  4. `app/products/page.tsx` — renderização da nova seção no `FilterPanel` *(aproveitando o repasse dinâmico já existente em `productService.list`)*.

## 7. Critérios de Validação
* **Auditoria de impacto via Git:** Implementar o filtro por material em branch dedicada e confirmar via `git diff --stat` que a alteração se limita aos 4 arquivos previstos em `src/`.
* **Validação de rede e interface (`/products`):** Selecionar um material na interface e verificar via DevTools (*Network*) o disparo de `?material=...` com retorno filtrado, testando também a composição simultânea com *técnica* e *região* e a limpeza total dos parâmetros.
* **Varredura estática de dependências:** Executar `grep -rn "@/services/api" src/components src/app` (que deverá retornar zero ocorrências após a refatoração de `reviewer-name.tsx`) e garantir aprovação limpa no `npm run lint`.

---

_Gerado pelo estudo dirigido de Arquitetura de Software · ADS020 · 2026.2._