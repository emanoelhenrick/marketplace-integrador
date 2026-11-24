const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { WorkerPool } = require("./worker-pool.cjs");

const PORT = Number(process.env.RECOMMENDATION_PORT || 4000);
const WORKER_FILE = path.join(__dirname, "workers", "scoring.worker.cjs");

const WORKER_COUNT = Math.min(os.availableParallelism(), 4);
const workerPool = new WorkerPool(WORKER_FILE, WORKER_COUNT);

async function parallel(products) {
  return workerPool.run(products);
}

function sendJson(response, status, data) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  });

  response.end(JSON.stringify(data));
}

const server = http.createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    return response.end();
  }

  if (request.method === "GET" && request.url === "/health") {
    return sendJson(response, 200, {
      status: "online",
      service: "manoa-recommendation-service",
    });
  }

  if (request.method !== "POST" || request.url !== "/recommendations") {
    return sendJson(response, 404, { error: "Endpoint não encontrado" });
  }

  try {
    let body = "";

    for await (const chunk of request) {
      body += chunk;

      if (body.length > 10 * 1024 * 1024) {
        return sendJson(response, 413, { error: "Payload muito grande" });
      }
    }

    const payload = JSON.parse(body || "{}");
    const products = payload.products;

    if (!Array.isArray(products)) {
      return sendJson(response, 400, {
        error: "O campo products deve ser uma lista",
      });
    }

    const startedAt = performance.now();
    const scoredProducts = await parallel(products);
    const elapsedMs = Number((performance.now() - startedAt).toFixed(3));

    scoredProducts.sort(
      (a, b) => b.recommendationScore - a.recommendationScore
    );

    const limit = Math.min(
      50,
      Math.max(1, Number(payload.limit) || 8)
    );

    console.log(
      `[RECOMMENDATIONS] ${products.length} produtos processados em ${elapsedMs} ms`
    );

    return sendJson(response, 200, {
      strategy: "content_based_tfidf",
      items: scoredProducts.slice(0, limit),
      metadata: {
        processed: products.length,
        workers: Math.min(WORKER_COUNT, products.length),
        elapsedMs,
      },
    });
  } catch (error) {
    console.error("[RECOMMENDATIONS ERROR]", error);

    return sendJson(response, 500, {
      error: "Erro ao processar recomendações",
    });
  }
});

server.listen(PORT, () => {
  console.log(
    `Recommendation Service rodando em http://localhost:${PORT}`
  );
  console.log(`Pool de Workers iniciado com ${WORKER_COUNT} Workers`);
});

async function shutdown() {
  console.log("Encerrando Recommendation Service...");

  server.close(async () => {
    await workerPool.close();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
