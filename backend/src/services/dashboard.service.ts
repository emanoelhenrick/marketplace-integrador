import { prisma } from "../prisma";
import { BusinessError } from "../errors/business-error";

export class DashboardService {
  async getIndicators(period?: { startDate?: string; endDate?: string }) {
    const { start, end } = this.validatePeriod(period);

    const orderWhere = {
      status: { not: "cancelled" as const },
      createdAt:
        start || end
          ? {
              ...(start ? { gte: start } : {}),
              ...(end ? { lte: end } : {}),
            }
          : undefined,
    };

    const [
      salesAggregate,
      ordersCount,
      activeArtisans,
      topProducts,
      statusCounts,
    ] = await Promise.all([
      prisma.order.aggregate({
        where: orderWhere,
        _sum: { totalAmount: true },
      }),
      prisma.order.count({ where: orderWhere }),
      prisma.user.count({
        where: { role: "artisan" },
      }),
      prisma.orderItem.groupBy({
        by: ["productId"],
        where: {
          order: orderWhere,
        },
        _sum: { quantity: true },
        orderBy: {
          _sum: { quantity: "desc" },
        },
        take: 5,
      }),
      prisma.order.groupBy({
        by: ["status"],
        where: orderWhere,
        _count: { _all: true },
      }),
    ]);

    const productIds = topProducts.map((item) => item.productId);
    const products = productIds.length
      ? await prisma.product.findMany({
          where: { id: { in: productIds } },
          select: {
            id: true,
            name: true,
            category: true,
            image: true,
            artisan: true,
          },
        })
      : [];
    const productsById = new Map(products.map((product) => [product.id, product]));

    return {
      period: {
        startDate: start?.toISOString() ?? null,
        endDate: end?.toISOString() ?? null,
      },
      kpis: {
        simulatedSales: Number(salesAggregate._sum.totalAmount ?? 0),
        ordersCount,
        activeArtisans,
      },
      topProducts: topProducts.map((item) => ({
        productId: item.productId,
        name: productsById.get(item.productId)?.name ?? "Produto",
        category: productsById.get(item.productId)?.category ?? null,
        image: productsById.get(item.productId)?.image ?? null,
        artisan: productsById.get(item.productId)?.artisan ?? null,
        quantitySold: item._sum.quantity ?? 0,
      })),
      statusCounts: statusCounts.map((item) => ({
        status: item.status,
        count: item._count._all,
      })),
    };
  }

  private validatePeriod(period?: { startDate?: string; endDate?: string }) {
    if (!period) {
      return { start: undefined, end: undefined };
    }

    const start = period.startDate ? this.parseDate(period.startDate, "startDate") : undefined;
    const end = period.endDate ? this.parseDate(period.endDate, "endDate", true) : undefined;

    if (start && end && start > end) {
      throw new BusinessError("A data inicial não pode ser posterior à data final.");
    }

    return { start, end };
  }

  private parseDate(value: string, field: "startDate" | "endDate", endOfDay = false) {
    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      throw new BusinessError(
        `O parâmetro ${field} deve ser uma data ISO válida.`
      );
    }

    if (endOfDay && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      parsed.setUTCHours(23, 59, 59, 999);
    }

    if (!endOfDay && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      parsed.setUTCHours(0, 0, 0, 0);
    }

    return parsed;
  }
}
