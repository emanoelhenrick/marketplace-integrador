
const os = require("node:os");
const path = require("node:path");
const fs = require("node:fs");
const { performance } = require("node:perf_hooks");

const { WorkerPool } = require("./worker-pool.cjs");
const {
  calculateRecommendations,
} = require("./recommendation-engine.cjs");

const WORKER_FILE = path.join(
  __dirname,
  "workers",
  "scoring.worker.cjs"
);

const WORKER_COUNT = Math.min(os.availableParallelism(), 4);
const REPETITIONS = 5;

// Começamos com volumes moderados porque o cálculo de
// similaridade compara cada produto com o catálogo.
const DATASET_SIZES = [500, 1000, 2000, 5000];

const CATEGORIES = [
  "Ceramica",
  "Madeira",
  "Tecelagem",
  "Joalheria",
  "Decoracao",
];

const TECHNIQUES = [
  "Pintura manual",
  "Escultura artesanal",
  "Trabalho em madeira",
  "Trico e bordado",
  "Modelagem artistica",
];

const DESCRIPTIONS = [
  "Peca artesanal feita a mao com acabamento detalhado",
  "Produto decorativo produzido com materiais naturais",
  "Criacao artistica com tecnica tradicional brasileira",
  "Objeto exclusivo para decoracao de ambientes",
  "Trabalho manual com identidade cultural e regional",
];

function generateProducts(amount) {
  return Array.from({ length: amount }, (_, index) => ({
    id: index + 1,
    name: `Produto artesanal ${index + 1} ${CATEGORIES[index % CATEGORIES.length]}`,
    category: CATEGORIES[index % CATEGORIES.length],
    technique: TECHNIQUES[index % TECHNIQUES.length],
    description: DESCRIPTIONS[index % DESCRIPTIONS.length],
    stars: 3 + (index % 21) / 10,
    quantity: index % 15,
    price: 20 + (index % 980),
  }));
}

function sequential(products) {
  return calculateRecommendations(products, products);
}

function validateResults(sequentialResults, parallelResults) {
  if (sequentialResults.length !== parallelResults.length) {
    throw new Error("Os resultados possuem quantidades diferentes.");
  }

  for (let i = 0; i < sequentialResults.length; i++) {
    const sequentialItem = sequentialResults[i];
    const parallelItem = parallelResults[i];

    if (
      String(sequentialItem.id) !== String(parallelItem.id) ||
      sequentialItem.recommendationScore !==
        parallelItem.recommendationScore ||
      JSON.stringify(sequentialItem.recommendationDetails) !==
        JSON.stringify(parallelItem.recommendationDetails)
    ) {
      throw new Error(
        `Resultados diferentes no produto ${sequentialItem.id}`
      );
    }
  }

  return true;
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function mean(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function calculateMetrics(times, amount) {
  const averageMs = mean(times);
  const medianMs = median(times);

  return {
    medianMs: Number(medianMs.toFixed(3)),
    meanMs: Number(averageMs.toFixed(3)),
    throughputProductsPerSecond: Number(
      (amount / (medianMs / 1000)).toFixed(2)
    ),
    repetitions: times.length,
  };
}

async function measure(fn, products) {
  const start = performance.now();
  await fn(products);
  return performance.now() - start;
}

async function benchmarkSize(size, parallel) {
  console.log(`\nExecutando benchmark com ${size} produtos...`);

  const products = generateProducts(size);

  // Verifica se os dois modos produzem os mesmos resultados.
  const sequentialCheck = sequential(products);
  const parallelCheck = await parallel(products);

  validateResults(sequentialCheck, parallelCheck);

  // Aquecimento antes das medições.
  await sequential(products);
  await parallel(products);

  const sequentialTimes = [];
  const parallelTimes = [];

  // Alterna a ordem para reduzir o efeito da ordem de execução.
  for (let i = 0; i < REPETITIONS; i++) {
    let sequentialTime;
    let parallelTime;

    if (i % 2 === 0) {
      sequentialTime = await measure(sequential, products);
      parallelTime = await measure(parallel, products);
    } else {
      parallelTime = await measure(parallel, products);
      sequentialTime = await measure(sequential, products);
    }

    sequentialTimes.push(sequentialTime);
    parallelTimes.push(parallelTime);

    console.log(
      `Repetição ${i + 1}/${REPETITIONS} concluída.`
    );
  }

  const sequentialMetrics = calculateMetrics(
    sequentialTimes,
    size
  );

  const parallelMetrics = calculateMetrics(
    parallelTimes,
    size
  );

  const speedup =
    sequentialMetrics.medianMs / parallelMetrics.medianMs;

  const improvementPercent = (1 - 1 / speedup) * 100;
  
  return {
    datasetSize: size,
    workers: Math.min(WORKER_COUNT, size),
    sequential: sequentialMetrics,
    parallel: parallelMetrics,
    speedup: Number(speedup.toFixed(3)),
    improvementPercent: Number(improvementPercent.toFixed(2)),
    fasterStrategy:
      speedup > 1
        ? "parallel"
        : speedup < 1
          ? "sequential"
          : "equivalent",
    equivalentResults: true,
  };
}

async function main() {
  const pool = new WorkerPool(WORKER_FILE, WORKER_COUNT);

  try {
    const parallel = (products) => pool.run(products);
    const results = [];

    console.log("======================================");
    console.log("BENCHMARK DE RECOMENDAÇÃO TF-IDF");
    console.log("======================================");
    console.log(`Sistema operacional: ${os.platform()}`);
    console.log(`Arquitetura: ${os.arch()}`);
    console.log(`Processadores disponíveis: ${os.availableParallelism()}`);
    console.log(`Workers utilizados: ${WORKER_COUNT}`);
    console.log(`Repetições por volume: ${REPETITIONS}`);
    console.log("Algoritmo: content-based TF-IDF");

    for (const size of DATASET_SIZES) {
      const result = await benchmarkSize(size, parallel);
      results.push(result);

      console.log("\nResultado:");
      console.log(JSON.stringify(result, null, 2));
    }

   const outputDirectory = path.join(
  __dirname,
  "..",
  "benchmarks",
  "results"
  );

    fs.mkdirSync(outputDirectory, { recursive: true });

    const outputFile = path.join(
      outputDirectory,
      "benchmark-tfidf.json"
    );

    const report = {
      generatedAt: new Date().toISOString(),
      environment: {
        platform: os.platform(),
        architecture: os.arch(),
        processors: os.availableParallelism(),
        workers: WORKER_COUNT,
        nodeVersion: process.version,
      },
      algorithm: "content_based_tfidf",
      repetitions: REPETITIONS,
      results,
    };

    fs.writeFileSync(
      outputFile,
      JSON.stringify(report, null, 2)
    );

    console.log("\n======================================");
    console.log("BENCHMARK FINALIZADO");
    console.log(`Arquivo salvo em: ${outputFile}`);
    console.log("======================================");
  } finally {
    await pool.close();
  }
}

main().catch((error) => {
  console.error("Erro durante o benchmark:", error);
  process.exitCode = 1;
});
