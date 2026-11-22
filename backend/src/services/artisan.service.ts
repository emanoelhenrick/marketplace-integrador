import { prisma } from "../prisma";
import { NotFoundError } from "../errors/business-error";

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
}
