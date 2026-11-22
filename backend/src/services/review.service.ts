import { prisma } from "../prisma";
import { CreateReviewDto } from "../dto/review.dto";
import { BusinessError, ForbiddenError, NotFoundError } from "../errors/business-error";
import { ReviewRepository } from "../repositories/review.repository";

export class ReviewService {
  constructor(private readonly reviewRepository = new ReviewRepository()) {}

  async create(
    buyer: { id: string; email: string; role: string },
    productId: number,
    data: CreateReviewDto
  ) {
    if (buyer.role !== "client") {
      throw new ForbiddenError("Somente compradores podem avaliar produtos.");
    }

    const rating = this.validateRating(data.rating);
    const comment = this.validateComment(data.comment);

    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!product) {
      throw new NotFoundError("Produto não encontrado.");
    }

    const existingReview = await this.reviewRepository.findByUserAndProduct(
      buyer.id,
      productId
    );

    if (existingReview) {
      throw new BusinessError("Você já avaliou este produto.");
    }

    const eligibleOrder = await this.reviewRepository.findEligibleOrder(
      buyer.id,
      productId,
      data.orderId
    );

    if (!eligibleOrder) {
      throw new ForbiddenError(
        "Você só pode avaliar produtos incluídos em uma compra aprovada."
      );
    }

    return prisma.$transaction(async (tx) => {
      const review = await this.reviewRepository.create(
        {
          rating,
          comment,
          userId: buyer.id,
          productId,
          orderId: eligibleOrder.id,
        },
        tx as typeof prisma
      );

      const average = await this.reviewRepository.recalculateProductAverage(
        productId,
        tx as typeof prisma
      );

      return {
        review,
        averageRating: Number(average.toFixed(1)),
      };
    });
  }

  async listByProduct(productId: number) {
    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!product) {
      throw new NotFoundError("Produto não encontrado.");
    }

    const reviews = await this.reviewRepository.findByProductId(productId);
    const averageRating = reviews.length
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    return {
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews: reviews.length,
      reviews: reviews.map((review) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        user: review.user,
      })),
    };
  }

  private validateRating(value: unknown) {
    const rating = typeof value === "string" ? Number(value) : value;

    if (
      typeof rating !== "number" ||
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      throw new BusinessError("A nota deve ser um número inteiro entre 1 e 5.");
    }

    return rating;
  }

  private validateComment(value: unknown) {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new BusinessError("O comentário é obrigatório.");
    }

    return value.trim();
  }
}
