import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";
import { ProductEntity } from "../entities/product.entity";

export type CreateProductInput = Omit<
  ProductEntity,
  "id" | "createdAt" | "updatedAt"
> & {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type UpdateProductInput = Partial<CreateProductInput>;

export class ProductRepository {
  async findAll(client = prisma): Promise<ProductEntity[]> {
    const products = await client.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    return products.map(
      (product) =>
        new ProductEntity({
          ...product,
          price: Number(product.price),
          stars: Number(product.stars),
          artisanId: product.artisanId ?? null,
          image: product.image ?? null,
          description: product.description ?? null,
          quantity: product.quantity,
          active: product.active,
        })
    );
  }

  async findActive(
    filters: { category?: string },
    client = prisma
  ): Promise<ProductEntity[]> {
    const where: Prisma.ProductWhereInput = { active: true };

    if (filters.category) {
      where.category = {
        contains: filters.category,
        mode: "insensitive",
      };
    }

    const products = await client.product.findMany({
      where,
      orderBy: { id: "asc" },
    });

    return products.map(
      (product) =>
        new ProductEntity({
          ...product,
          price: Number(product.price),
          stars: Number(product.stars),
          artisanId: product.artisanId ?? null,
          image: product.image ?? null,
          description: product.description ?? null,
          quantity: product.quantity,
          active: product.active,
        })
    );
  }

  async findById(id: number, client = prisma): Promise<ProductEntity | null> {
    const product = await client.product.findUnique({ where: { id } });

    if (!product) {
      return null;
    }

    return new ProductEntity({
      ...product,
      price: Number(product.price),
      stars: Number(product.stars),
      artisanId: product.artisanId ?? null,
      image: product.image ?? null,
      description: product.description ?? null,
      quantity: product.quantity,
      active: product.active,
    });
  }

  async findByArtisanId(artisanId: string, client = prisma): Promise<ProductEntity[]> {
    const products = await client.product.findMany({
      where: { artisanId },
      orderBy: { createdAt: "desc" },
    });

    return products.map(
      (product) =>
        new ProductEntity({
          ...product,
          price: Number(product.price),
          stars: Number(product.stars),
          artisanId: product.artisanId ?? null,
          image: product.image ?? null,
          description: product.description ?? null,
          quantity: product.quantity,
          active: product.active,
        })
    );
  }

  async decrementStock(
    id: number,
    quantity: number,
    client = prisma
  ): Promise<boolean> {
    const result = await client.product.updateMany({
      where: { id, active: true, quantity: { gte: quantity } },
      data: { quantity: { decrement: quantity } },
    });

    return result.count === 1;
  }

  async create(data: CreateProductInput, client = prisma): Promise<ProductEntity> {
    const product = await client.product.create({
      data: {
        name: data.name,
        price: data.price,
        stars: data.stars,
        category: data.category,
        artisan: data.artisan,
        artisanId: data.artisanId ?? null,
        location: data.location,
        image: data.image ?? null,
        description: data.description ?? null,
        quantity: data.quantity ?? 0,
        active: data.active ?? true,
      },
    });

    return new ProductEntity({
      ...product,
      price: Number(product.price),
      stars: Number(product.stars),
      artisanId: product.artisanId ?? null,
      image: product.image ?? null,
      description: product.description ?? null,
      quantity: product.quantity,
      active: product.active,
    });
  }

  async update(id: number, data: UpdateProductInput, client = prisma): Promise<ProductEntity | null> {
    const product = await client.product.update({
      where: { id },
      data: {
        name: data.name,
        price: data.price,
        stars: data.stars,
        category: data.category,
        artisan: data.artisan,
        artisanId: data.artisanId ?? undefined,
        location: data.location,
        image: data.image ?? undefined,
        description: data.description ?? undefined,
        quantity: data.quantity ?? undefined,
        active: data.active ?? undefined,
      },
    });

    return new ProductEntity({
      ...product,
      price: Number(product.price),
      stars: Number(product.stars),
      artisanId: product.artisanId ?? null,
      image: product.image ?? null,
      description: product.description ?? null,
      quantity: product.quantity,
      active: product.active,
    });
  }

  async updateByIdAndArtisanId(
    id: number,
    artisanId: string,
    data: UpdateProductInput,
    client = prisma
  ): Promise<ProductEntity | null> {
    const result = await client.product.updateMany({
      where: { id, artisanId },
      data: {
        name: data.name,
        price: data.price,
        category: data.category,
        location: data.location,
        image: data.image,
        description: data.description,
        active: data.active,
        quantity: data.quantity,
      },
    });

    if (result.count !== 1) {
      return null;
    }

    return this.findById(id, client);
  }

  async delete(id: number, client = prisma): Promise<void> {
    await client.product.delete({ where: { id } });
  }
}
