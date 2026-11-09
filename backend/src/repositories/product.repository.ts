import { prisma } from "../prisma";
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
  async findAll(): Promise<ProductEntity[]> {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    return products.map(
      (product) =>
        new ProductEntity({
          ...product,
          price: Number(product.price),
          stars: Number(product.stars),
          image: product.image ?? null,
          description: product.description ?? null,
          quantity: product.quantity,
          active: product.active,
        })
    );
  }

  async findById(id: number): Promise<ProductEntity | null> {
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      return null;
    }

    return new ProductEntity({
      ...product,
      price: Number(product.price),
      stars: Number(product.stars),
      image: product.image ?? null,
      description: product.description ?? null,
      quantity: product.quantity,
      active: product.active,
    });
  }

  async create(data: CreateProductInput): Promise<ProductEntity> {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        price: data.price,
        stars: data.stars,
        category: data.category,
        artisan: data.artisan,
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
      image: product.image ?? null,
      description: product.description ?? null,
      quantity: product.quantity,
      active: product.active,
    });
  }

  async update(id: number, data: UpdateProductInput): Promise<ProductEntity | null> {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        price: data.price,
        stars: data.stars,
        category: data.category,
        artisan: data.artisan,
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
      image: product.image ?? null,
      description: product.description ?? null,
      quantity: product.quantity,
      active: product.active,
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.product.delete({ where: { id } });
  }
}
