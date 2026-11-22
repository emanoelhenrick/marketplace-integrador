import { prisma } from "../prisma";
import { BusinessError, NotFoundError } from "../errors/business-error";
import { ProductRepository } from "../repositories/product.repository";

export interface ArtisanFilters {
  craft?: string;
  location?: string;
  region?: string;
}

const PUBLIC_ARTISAN_SELECT = {
  id: true,
  name: true,
  role: true,
  active: true,
  avatarUrl: true,
  craft: true,
  craftYears: true,
  quote: true,
  location: true,
  polo: true,
  region: true,
  totalWorks: true,
  culturalSeal: true,
  createdAt: true,
} as const;

export class ArtisanService {
  constructor(private readonly productRepository = new ProductRepository()) {}

  async list(filters: ArtisanFilters = {}) {
    return prisma.user.findMany({
      where: {
        role: "artisan",
        active: true,
        ...(filters.craft
          ? { craft: { contains: filters.craft, mode: "insensitive" as const } }
          : {}),
        ...(filters.location
          ? { location: { contains: filters.location, mode: "insensitive" as const } }
          : {}),
        ...(filters.region
          ? { region: { contains: filters.region, mode: "insensitive" as const } }
          : {}),
      },
      select: PUBLIC_ARTISAN_SELECT,
      orderBy: { name: "asc" },
    });
  }

  async getById(artisanId: string) {
    const artisan = await prisma.user.findFirst({
      where: {
        id: artisanId,
        role: "artisan",
        active: true,
      },
      select: PUBLIC_ARTISAN_SELECT,
    });

    if (!artisan) {
      throw new NotFoundError("Artesão não encontrado.");
    }

    return artisan;
  }

  async getProducts(
    artisanId: string,
    pageValue?: string,
    limitValue?: string
  ) {
    await this.getById(artisanId);

    const page = this.parsePositiveInteger(pageValue, 1);
    const limit = Math.min(this.parsePositiveInteger(limitValue, 12), 24);
    const skip = (page - 1) * limit;
    const { products, total } =
      await this.productRepository.findActiveByArtisanId(
        artisanId,
        skip,
        limit
      );

    return {
      products: products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        stars: product.stars,
        category: product.category,
        technique: product.technique,
        location: product.location,
        image: product.image,
        description: product.description,
        quantity: product.quantity,
        active: product.active,
        available: product.active && product.quantity > 0,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private parsePositiveInteger(value: string | undefined, fallback: number) {
    if (!value) {
      return fallback;
    }

    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 1) {
      throw new BusinessError(
        "Página e limite devem ser números inteiros positivos."
      );
    }

    return parsed;
  }
}
