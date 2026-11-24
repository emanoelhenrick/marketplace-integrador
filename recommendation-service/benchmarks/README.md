# Avaliação de Desempenho — Manoa Recommendation Service

## 1. Objetivo

Esta avaliação tem como objetivo comparar duas estratégias de processamento utilizadas no serviço de recomendação do Manoa:

- **Processamento sequencial:** os produtos são avaliados em uma única sequência de execução, utilizando uma única thread principal.
- **Processamento paralelo:** os produtos são divididos em partes e distribuídos entre Workers, utilizando a API `worker_threads` do Node.js.

O objetivo é analisar o impacto da execução paralela sobre o tempo de processamento, verificar a equivalência dos resultados e identificar em quais volumes de dados a distribuição da carga proporciona ganhos de desempenho.

## 2. Algoritmo de recomendação

A implementação atual utiliza uma estratégia de recomendação baseada em conteúdo (*Content-Based Filtering*), com TF-IDF e similaridade de cosseno.

O algoritmo considera as características textuais dos produtos, utilizando informações como nome, categoria, técnica e descrição.

O processamento ocorre nas seguintes etapas:

1. **Representação textual:** os atributos textuais dos produtos são utilizados para construir vetores TF-IDF.
2. **Similaridade:** é calculada a similaridade de cosseno entre os produtos do catálogo.
3. **Seleção de similares:** para cada produto, são selecionados os cinco produtos com maiores valores de similaridade.
4. **Pontuação final:** a pontuação considera três componentes:
   - Similaridade de conteúdo: 70%.
   - Avaliação do produto: 20%.
   - Disponibilidade em estoque: 10%.

O resultado é uma pontuação de recomendação entre 0 e 100.

## 3. Ambiente de execução

Os experimentos foram realizados no seguinte ambiente:

| Característica | Configuração |
|---|---|
| Sistema operacional | Windows (win32 x64) |
| Runtime | Node.js v22.16.0 |
| Processador | Intel Core i5-1135G7, 11ª geração |
| Núcleos físicos | 4 |
| Processadores lógicos | 8 |
| Memória RAM | 7,73 GB |
| Estratégia paralela | Worker Threads |
| Quantidade máxima de Workers | 4 |
| Repetições por estratégia | 5 |

## 4. Metodologia

Foram utilizados conjuntos sintéticos de produtos com quatro tamanhos diferentes:

- 500 produtos;
- 1.000 produtos;
- 2.000 produtos;
- 5.000 produtos.

Os dados foram gerados de maneira determinística, contendo identificadores, nome, categoria, técnica, descrição, avaliação, quantidade disponível e preço.

Para cada tamanho de conjunto, foram realizadas cinco repetições de cada estratégia. Também foi executado um aquecimento inicial (*warm-up*) antes das medições.

A ordem de execução das estratégias foi alternada durante os experimentos, buscando reduzir possíveis efeitos da ordem de execução sobre os resultados.

O tempo de processamento foi medido em milissegundos. Para a comparação, foi utilizada a mediana dos tempos registrados em cada estratégia.

A implementação paralela utiliza um pool de Workers, que distribui os produtos em partes e envia cada conjunto para processamento. Cada Worker executa o mesmo algoritmo utilizado na estratégia sequencial.

Ao final, os resultados das duas estratégias são comparados para verificar a equivalência dos identificadores, das pontuações e dos detalhes de recomendação.

### 4.1. Métricas utilizadas

Foram utilizadas as seguintes métricas:

- **Tempo de execução:** duração do processamento em milissegundos.
- **Speedup:** relação entre o tempo sequencial e o tempo paralelo.
- **Redução do tempo:** percentual de redução do tempo de execução paralela em relação à sequencial.
- **Throughput:** quantidade de produtos processados por segundo.
- **Equivalência:** verificação de que as duas estratégias produzem resultados iguais.

O speedup é calculado pela fórmula:

`Speedup = Tempo sequencial / Tempo paralelo`

A redução percentual do tempo é calculada por:

`Redução (%) = (1 - Tempo paralelo / Tempo sequencial) × 100`

## 5. Resultados

Os resultados da execução mais recente do benchmark foram:

| Produtos | Sequencial (ms) | Paralelo (ms) | Speedup | Redução do tempo |
|---:|---:|---:|---:|---:|
| 500 | 64,576 | 36,438 | 1,772x | 43,57% |
| 1.000 | 274,687 | 139,434 | 1,970x | 49,24% |
| 2.000 | 999,444 | 454,792 | 2,198x | 54,50% |
| 5.000 | 6.186,984 | 3.144,125 | 1,968x | 49,18% |

### 5.1. Análise dos resultados

Nos quatro cenários avaliados, o processamento paralelo apresentou menor tempo de execução em comparação com o processamento sequencial.

O maior speedup foi observado no conjunto de 2.000 produtos, com aproximadamente 2,198 vezes de aceleração e redução de 54,50% no tempo de processamento.

No conjunto de 5.000 produtos, o processamento paralelo também apresentou ganho, com redução de aproximadamente 49,18% no tempo.

Os resultados indicam que, para a carga computacional utilizada neste experimento, a divisão do processamento entre Workers proporcionou ganhos mensuráveis.

Entretanto, o ganho não aumentou continuamente com o tamanho do conjunto. Isso demonstra que o desempenho também depende dos custos de distribuição, comunicação entre threads e processamento adicional realizado por cada Worker.

### 5.2. Equivalência dos resultados

Além da medição de desempenho, o benchmark verifica se as duas estratégias produzem resultados equivalentes.

A validação foi bem-sucedida nos quatro tamanhos de conjunto:

- 500 produtos: resultados equivalentes.
- 1.000 produtos: resultados equivalentes.
- 2.000 produtos: resultados equivalentes.
- 5.000 produtos: resultados equivalentes.

A comparação considera os identificadores, as pontuações finais e os detalhes utilizados no cálculo das recomendações.

Essa validação é importante porque o ganho de desempenho não deve comprometer a lógica funcional do algoritmo.

### 5.3. Interpretação geral

Os experimentos demonstraram que a execução paralela foi mais eficiente nos cenários avaliados.

Uma possível explicação está no custo computacional do algoritmo: cada produto precisa ser comparado com os demais produtos do catálogo para calcular as similaridades. Assim, o volume de operações cresce significativamente conforme o catálogo aumenta.

A distribuição dos produtos entre os Workers permite executar partes desse processamento simultaneamente.

Entretanto, a implementação paralela também possui custos. Cada Worker recebe o catálogo para calcular as similaridades e realiza seu próprio processamento dos vetores TF-IDF. Isso implica transferência de dados e repetição de parte do trabalho de preparação.

Portanto, os resultados representam o desempenho da implementação atual, incluindo esses custos, e não uma medição isolada da capacidade teórica das threads.

## 6. Conclusão

Os experimentos demonstraram que a utilização de Workers Threads proporcionou ganhos de desempenho para o algoritmo atual de recomendação nos quatro tamanhos de conjunto avaliados.

O melhor resultado foi observado com 2.000 produtos, alcançando speedup de 2,198x e redução de 54,50% no tempo de execução.

A avaliação também confirmou que a implementação paralela preserva os resultados produzidos pela estratégia sequencial.

Conclui-se que a execução paralela é uma alternativa adequada para essa carga de processamento, embora seu benefício dependa do volume de dados e dos custos envolvidos na distribuição do trabalho.

Como possibilidade de evolução, pode-se investigar o compartilhamento ou reaproveitamento dos vetores TF-IDF entre os Workers, reduzindo o trabalho repetido de preparação do catálogo e os custos de transferência de dados.

## 7. Limitações da avaliação

Os resultados foram obtidos com dados sintéticos e em uma única configuração de hardware.

Dessa forma, os tempos registrados não devem ser interpretados como garantia de desempenho em ambiente de produção.

Além disso, o benchmark mede o processamento do algoritmo de recomendação, não incluindo todo o tempo de comunicação HTTP entre o backend e o serviço de recomendação, consultas ao banco de dados ou renderização no frontend.

As conclusões se restringem às condições e aos conjuntos de dados utilizados no experimento.

## 8. Reprodutibilidade

O benchmark pode ser executado a partir da pasta `recommendation-service`:

```bash
node src/benchmark.cjs
```

O resultado da execução é registrado em:

`benchmarks/results/benchmark-tfidf.json`

Os principais arquivos envolvidos na implementação são:

- `src/benchmark.cjs`: execução e comparação dos benchmarks.
- `src/recommendation-engine.cjs`: implementação do algoritmo TF-IDF.
- `src/worker-pool.cjs`: distribuição das tarefas entre os Workers.
- `src/workers/scoring.worker.cjs`: processamento executado por cada Worker.
- `src/server.cjs`: servidor HTTP do serviço de recomendação.