import { prisma } from "../prisma";
import { UpdateArtisanProfileDto } from "../dto/artisan-profile.dto";
import { BusinessError, ForbiddenError, NotFoundError } from "../errors/business-error";

export class ArtisanProfileService {
  async getPublicProfile(artisanId: string, pageValue?: string, limitValue?: string) {
    const artisan = await prisma.user.findUnique({
      where: { id: artisanId },
      select: {
        id: true,
        name: true,
        role: true,
        active: true,
        avatarUrl: true,
        quote: true,
        location: true,
        culturalSeal: true,
        craft: true,
        region: true,
        polo: true,
      },
    });

    if (!artisan || artisan.role !== "artisan" || !artisan.active) {
      throw new NotFoundError("Artesão não encontrado.");
    }

    const page = this.parsePositiveInteger(pageValue, 1);
    const limit = this.parsePositiveInteger(limitValue, 12);
    const boundedLimit = Math.min(limit, 24);
    const skip = (page - 1) * boundedLimit;

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where: { artisanId, active: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: boundedLimit,
      }),
      prisma.product.count({
        where: { artisanId, active: true },
      }),
    ]);

    return {
      artisan: {
        id: artisan.id,
        name: artisan.name,
        photo: artisan.avatarUrl,
        biography: artisan.quote,
        location: artisan.location,
        culturalSeal: artisan.culturalSeal,
        craft: artisan.craft,
        region: artisan.region,
        polo: artisan.polo,
      },
      products: products.map((product) => ({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        stars: Number(product.stars),
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
        limit: boundedLimit,
        total,
        totalPages: Math.ceil(total / boundedLimit),
      },
    };
  }

  async updateProfile(
    user: { id: string; role: string },
    data: UpdateArtisanProfileDto,
    avatarFile?: Express.Multer.File
  ) {
    if (user.role !== "artisan") {
      throw new ForbiddenError("Somente artesãos podem editar este perfil.");
    }

    const updates: {
      avatarUrl?: string;
      quote?: string;
      location?: string;
      culturalSeal?: boolean;
    } = {};

    if (data.quote !== undefined) {
      const quote = data.quote.trim();

      if (this.countWords(quote) > 300) {
        throw new BusinessError("A biografia deve ter no máximo 300 palavras.");
      }

      updates.quote = quote;
    }

    if (data.location !== undefined) {
      const location = data.location.trim();

      if (location.length > 150) {
        throw new BusinessError("A localidade deve ter no máximo 150 caracteres.");
      }

      updates.location = location;
    }

    if (data.culturalSeal !== undefined) {
      const culturalSeal =
        typeof data.culturalSeal === "string"
          ? data.culturalSeal.trim().toLowerCase()
          : data.culturalSeal;

      if (culturalSeal !== true && culturalSeal !== false && culturalSeal !== "true" && culturalSeal !== "false") {
        throw new BusinessError("O selo de autoria cultural deve ser verdadeiro ou falso.");
      }

      updates.culturalSeal =
        culturalSeal === true || culturalSeal === "true";
    }

    if (avatarFile) {
      if (avatarFile.size > 5 * 1024 * 1024) {
        throw new BusinessError("A imagem deve ter no máximo 5 MB.");
      }

      if (!this.isSupportedImage(avatarFile)) {
        throw new BusinessError("A imagem deve estar no formato PNG ou JPEG.");
      }

      updates.avatarUrl =
        `data:${avatarFile.mimetype};base64,${avatarFile.buffer.toString("base64")}`;
    } else if (data.avatarUrl !== undefined) {
      const avatarUrl = data.avatarUrl.trim();

      if (
        avatarUrl &&
        !/^https?:\/\//i.test(avatarUrl) &&
        !/^data:image\/(?:png|jpeg);base64,/i.test(avatarUrl)
      ) {
        throw new BusinessError("Informe uma URL HTTP(S) válida ou envie uma imagem PNG/JPEG.");
      }

      updates.avatarUrl = avatarUrl;
    }

    const artisan = await prisma.user.update({
      where: { id: user.id },
      data: {
        avatarUrl: updates.avatarUrl,
        quote: updates.quote,
        location: updates.location,
        culturalSeal: updates.culturalSeal,
      },
    });

    return {
      id: artisan.id,
      photo: artisan.avatarUrl,
      biography: artisan.quote,
      location: artisan.location,
      culturalSeal: artisan.culturalSeal,
    };
  }

  private parsePositiveInteger(value: string | undefined, fallback: number) {
    if (!value) {
      return fallback;
    }

    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed < 1) {
      throw new BusinessError("Página e limite devem ser números inteiros positivos.");
    }

    return parsed;
  }

  private countWords(value: string) {
    if (!value) return 0;
    return value.trim().split(/\s+/).length;
  }

  private isSupportedImage(file: Express.Multer.File) {
    if (file.mimetype === "image/png") {
      return (
        file.buffer.length >= 8 &&
        file.buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      );
    }

    if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") {
      return (
        file.buffer.length >= 3 &&
        file.buffer[0] === 255 &&
        file.buffer[1] === 216 &&
        file.buffer[2] === 255
      );
    }

    return false;
  }
}
