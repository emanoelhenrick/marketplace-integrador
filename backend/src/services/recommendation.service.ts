
import { ProductRepository } from "../repositories/product.repository";

const RECOMMENDATION_SERVICE_URL =
  process.env.RECOMMENDATION_SERVICE_URL || "http://localhost:4000";

export class RecommendationService {
  private productRepository = new ProductRepository();

  async getRecommendations(limit = 8) {
    const products = await this.productRepository.findActive({});

    const response = await fetch(
      `${RECOMMENDATION_SERVICE_URL}/recommendations`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          products,
          limit,
        }),
        signal: AbortSignal.timeout(15000),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Recommendation Service retornou HTTP ${response.status}`
      );
    }

    return response.json();
  }
}
