# ADR-001: Integrar a validação do carrinho ao backend e padronizar o feedback ao usuário

- **Status:** Proposta
- **Data:** 2026-11-23
- **Autor:** RAYSSA SANTANA RIBEIRO (rsr3@cesar.school)
- **Turma:** Embarque (segundas)
- **Projeto:** Origem · marketplace da economia criativa e do artesanato de Pernambuco

## Contexto

O Manoa é um marketplace que atende compradores, artesãos e administradores. O projeto possui frontend desenvolvido em Next.js e backend desenvolvido em Node.js com Express. Atualmente, o frontend utiliza gerenciamento de estado local com Zustand para as operações do carrinho, enquanto o backend possui uma implementação própria para o gerenciamento do carrinho e validações de regras de negócio, incluindo disponibilidade de produtos e quantidade em estoque. Diante dessa separação, existe a necessidade de estabelecer um fluxo integrado entre frontend e backend, permitindo que as regras de negócio sejam validadas no servidor e que os resultados das operações sejam comunicados adequadamente ao usuário. Essa integração busca melhorar a assistência oferecida ao comprador durante a utilização do marketplace.

## Preocupações

Assistência ao usuário, clareza das mensagens, consistência das regras de negócio, tempo de resposta, comunicação entre frontend e backend, testabilidade, custo de implementação e manutenibilidade.

## Decisão

Estabelecer a integração entre o frontend Next.js e o backend Express por meio do padrão cliente-servidor, utilizando requisições HTTP para as operações do carrinho. O backend será responsável por validar as condições de negócio, como disponibilidade e quantidade em estoque, e retornar respostas estruturadas com o resultado da operação. O frontend deverá interpretar essas respostas e apresentar mensagens claras e compreensíveis ao comprador, orientando-o quando uma operação não puder ser concluída.

## Justificativa

A decisão foi tomada porque a centralização das regras de negócio no backend permite que as validações do carrinho sejam realizadas com base nos dados mantidos pelo servidor, evitando que o frontend dependa exclusivamente de informações locais para determinar a disponibilidade dos produtos. A comunicação cliente-servidor permite que o frontend solicite a operação e receba diretamente o resultado da validação, possibilitando apresentar feedback adequado ao comprador. Essa abordagem atende ao atributo de capacidade de interação, especificamente à assistência ao usuário, sem exigir a adoção de uma arquitetura mais complexa para o cenário identificado.

## Consequências

Como benefícios, a decisão centraliza as validações de disponibilidade e quantidade no backend, aumenta a consistência das regras de negócio e permite que o frontend apresente mensagens claras sobre o resultado das operações. Também facilita os testes das validações e do feedback apresentado ao comprador. Como consequências negativas, será necessário modificar o fluxo atual do carrinho no frontend e integrá-lo à API Express. A operação passará a depender da disponibilidade do backend e da comunicação de rede, podendo sofrer atrasos ou falhas quando a API estiver indisponível. Além disso, será necessário implementar o tratamento das respostas e dos erros retornados pelo servidor.

## Alternativas consideradas

Foi considerada a manutenção do gerenciamento do carrinho exclusivamente no frontend, utilizando o estado local para controlar as operações. Essa alternativa foi descartada porque as validações realizadas apenas na interface não garantem que a disponibilidade e a quantidade dos produtos correspondam aos dados atualizados do servidor. Isso poderia gerar inconsistências entre o carrinho apresentado ao comprador e o estoque real. A integração com o backend foi considerada mais adequada por permitir que as regras de negócio sejam verificadas no servidor e que o resultado seja comunicado ao frontend. A arquitetura em camadas pode coexistir com essa abordagem, pois representa a organização interna do backend.

## Rastreabilidade

**Atributo de qualidade:** Capacidade de interação · Assistência ao usuário

**Cenário que originou a decisão:**

> Quando um comprador tenta adicionar ao carrinho um produto indisponível ou uma quantidade superior ao estoque disponível, durante a operação normal do marketplace, a API de gerenciamento do carrinho deve identificar a condição inválida e retornar uma resposta com o motivo da rejeição. A interface do frontend deve interpretar essa resposta e apresentar uma mensagem clara e compreensível, orientando o comprador sobre o problema encontrado. O feedback deve ser exibido em até 1 segundo após o recebimento da resposta da API, em 100% dos casos previstos nos testes funcionais dessa situação.

**Padrão arquitetural adotado:** Cliente-servidor

**Táticas empacotadas:** Centralizar regra e dado no servidor

Fluxo relacionado: integração entre o frontend Next.js e a API Express para realizar operações de inclusão de produtos no carrinho. O frontend envia a solicitação, o backend executa as validações de disponibilidade e quantidade por meio do serviço de carrinho e retorna o resultado da operação.

Artefatos envolvidos: frontend/src/hooks/use-add-to-cart.ts, frontend/src/store/cardStore.ts, frontend/src/services/api.tsx, backend/src/routes/cart.routes.ts e backend/src/services/cart.service.ts.

Casos de teste: inclusão de produto disponível; tentativa de inclusão de produto indisponível; tentativa de inclusão de quantidade superior ao estoque; e falha de comunicação com a API.

## Verificação

- **Teste do cenário:** Executar testes de integração entre o frontend e a API Express, simulando a tentativa de adicionar ao carrinho um produto indisponível e uma quantidade superior ao estoque disponível. Verificar se o backend rejeita corretamente as operações e retorna respostas que identifiquem o motivo da rejeição. Em seguida, confirmar se o frontend interpreta essas respostas e apresenta mensagens claras e compreensíveis, orientando o comprador sobre como proceder. Medir o intervalo entre o recebimento da resposta da API e a exibição da mensagem na interface, verificando se o feedback ocorre em até 1 segundo em 100% dos casos de teste previstos para esse cenário.

---

_Gerado pelo estudo dirigido de Arquitetura de Software · ADS020 · 2026.2._
