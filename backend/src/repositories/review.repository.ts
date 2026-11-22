import { prisma } from "../prisma";
import { ReviewEntity } from "../entities/review.entity";

export class ReviewRepository {
  async findByProductId(productId: number, client = prisma) {
    const reviews = await client.review.findMany({
      where: { productId },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return reviews.map((review) => ({
      ...new ReviewEntity(review),
      user: review.user,
    }));
  }

  async findByUserAndProduct(userId: string, productId: number, client = prisma) {
    const review = await client.review.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    return review ? new ReviewEntity(review) : null;
  }

  async findEligibleOrder(
    userId: string,
    productId: number,
    orderId?: string,
    client = prisma
  ) {
    return client.order.findFirst({
      where: {
        userId,
        ...(orderId ? { id: orderId } : {}),
        status: { in: ["paid", "processing", "shipped", "delivered"] },
        items: { some: { productId } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(data: {
    rating: number;
    comment: string;
    userId: string;
    productId: number;
    orderId: string;
  }, client = prisma) {
    const review = await client.review.create({
      data,
      include: { user: { select: { id: true, name: true } } },
    });

    return {
      ...new ReviewEntity(review),
      user: review.user,
    };
  }

  async recalculateProductAverage(productId: number, client = prisma) {
    const aggregate = await client.review.aggregate({
      where: { productId },
      _avg: { rating: true },
    });

    const average = aggregate._avg.rating ?? 0;

    await client.product.update({
      where: { id: productId },
      data: { stars: average },
    });

    return average;
  }
}
