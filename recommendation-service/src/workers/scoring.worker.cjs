
const { parentPort } = require("node:worker_threads");
const {
  calculateRecommendations,
} = require("../recommendation-engine.cjs");

parentPort.on("message", ({ products, catalog }) => {
  try {
    const result = calculateRecommendations(
      products,
      catalog || products
    );

    parentPort.postMessage({ result });
  } catch (error) {
    parentPort.postMessage({
      error: error.message || "Erro ao calcular recomendações",
    });
  }
});
