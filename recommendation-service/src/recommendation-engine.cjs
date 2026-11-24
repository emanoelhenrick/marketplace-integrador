
const STOP_WORDS = new Set([
  "a", "as", "o", "os", "um", "uma", "uns", "umas",
  "de", "da", "do", "das", "dos", "em", "no", "na",
  "nos", "nas", "por", "para", "com", "sem", "e", "ou",
  "que", "se", "ao", "aos", "mais", "muito", "sua",
  "seu", "suas", "seus", "produto", "artesanal",
]);

function tokenize(product) {
  const text = [
    product.name,
    product.category,
    product.technique,
    product.description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ");

  return text
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

function buildVectors(products) {
  const documents = products.map(tokenize);
  const documentFrequency = new Map();

  for (const words of documents) {
    for (const word of new Set(words)) {
      documentFrequency.set(
        word,
        (documentFrequency.get(word) || 0) + 1
      );
    }
  }

  return documents.map((words) => {
    const frequencies = new Map();

    for (const word of words) {
      frequencies.set(word, (frequencies.get(word) || 0) + 1);
    }

    const vector = new Map();
    let magnitudeSquared = 0;

    for (const [word, frequency] of frequencies) {
      const tf = frequency / words.length;
      const idf =
        Math.log(
          (products.length + 1) /
          ((documentFrequency.get(word) || 0) + 1)
        ) + 1;

      const weight = tf * idf;
      vector.set(word, weight);
      magnitudeSquared += weight * weight;
    }

    return {
      vector,
      magnitude: Math.sqrt(magnitudeSquared),
    };
  });
}

function cosineSimilarity(first, second) {
  if (!first.magnitude || !second.magnitude) return 0;

  let dotProduct = 0;

  for (const [word, weight] of first.vector) {
    dotProduct += weight * (second.vector.get(word) || 0);
  }

  return dotProduct / (first.magnitude * second.magnitude);
}

function calculateRecommendations(products, catalog = products) {
  const vectors = buildVectors(catalog);

  const catalogIndex = new Map(
    catalog.map((product, index) => [String(product.id), index])
  );

  return products.map((product) => {
    const currentIndex = catalogIndex.get(String(product.id));

    if (currentIndex === undefined) {
      throw new Error(
        `Produto ${product.id} não encontrado no catálogo`
      );
    }

    const currentVector = vectors[currentIndex];
    const similarities = [];

    for (let i = 0; i < catalog.length; i++) {
      if (i === currentIndex) continue;

      const similarity = cosineSimilarity(
        currentVector,
        vectors[i]
      );

      similarities.push(similarity);
    }

    similarities.sort((a, b) => b - a);

    const topSimilarities = similarities.slice(0, 5);

    const contentScore = topSimilarities.length
      ? topSimilarities.reduce((sum, value) => sum + value, 0) /
        topSimilarities.length
      : 0;

    const stars = Math.max(
      0,
      Math.min(5, Number(product.stars) || 0)
    );

    const quantity = Math.max(
      0,
      Number(product.quantity) || 0
    );

    const ratingScore = stars / 5;
    const availabilityScore = quantity > 0 ? 1 : 0;

    const finalScore =
      contentScore * 70 +
      ratingScore * 20 +
      availabilityScore * 10;

    return {
      ...product,
      recommendationScore: Number(finalScore.toFixed(4)),
      recommendationDetails: {
        contentSimilarity: Number(contentScore.toFixed(4)),
        rating: Number(ratingScore.toFixed(4)),
        available: quantity > 0,
      },
    };
  });
}

module.exports = { calculateRecommendations };
