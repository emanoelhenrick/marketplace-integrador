import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";
import { OrderEntity, OrderStatus } from "../entities/order.entity";

const ORDER_WITH_ITEMS_INCLUDE = {
  items: true,
} satisfies Prisma.OrderInclude;

type PrismaOrderWithItems = Prisma.OrderGetPayload<{
  include: typeof ORDER_WITH_ITEMS_INCLUDE;
}>;

export type OrderWithArtisanItems = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: { product: { select: { name: true } } };
    };
  };
}>;

export type CreateOrderInput = Omit<
  OrderEntity,
  "id" | "createdAt" | "updatedAt"
> & {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type UpdateOrderInput = Partial<CreateOrderInput>;

export class OrderRepository {
  private toEntity(order: PrismaOrderWithItems): OrderEntity {
    return new OrderEntity({
      ...order,
      status: order.status as OrderStatus,
      totalAmount: Number(order.totalAmount),
    });
  }

  async findByArtisanId(
    artisanId: string,
    client = prisma
  ): Promise<OrderWithArtisanItems[]> {
    return client.order.findMany({
      where: { items: { some: { artisanId } } },
      include: {
        items: {
          where: { artisanId },
          include: { product: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findByIdForArtisan(
    id: string,
    artisanId: string,
    client = prisma
  ): Promise<OrderWithArtisanItems | null> {
    return client.order.findFirst({
      where: { id, items: { some: { artisanId } } },
      include: {
        items: {
          where: { artisanId },
          include: { product: { select: { name: true } } },
        },
      },
    });
  }

  async findAll(client = prisma): Promise<OrderEntity[]> {
    const orders = await client.order.findMany({
      include: ORDER_WITH_ITEMS_INCLUDE,
      orderBy: { createdAt: "desc" },
    });

    return orders.map((order) => this.toEntity(order));
  }

  async findByUserId(userId: string, client = prisma): Promise<OrderEntity[]> {
    const orders = await client.order.findMany({
      where: { userId },
      include: ORDER_WITH_ITEMS_INCLUDE,
      orderBy: { createdAt: "desc" },
    });

    return orders.map((order) => this.toEntity(order));
  }

  async findByIdAndUserId(
    id: string,
    userId: string,
    client = prisma
  ): Promise<OrderEntity | null> {
    const order = await client.order.findFirst({
      where: { id, userId },
      include: ORDER_WITH_ITEMS_INCLUDE,
    });

    return order ? this.toEntity(order) : null;
  }

  async findById(id: string, client = prisma): Promise<OrderEntity | null> {
    const order = await client.order.findUnique({
      where: { id },
      include: ORDER_WITH_ITEMS_INCLUDE,
    });

    return order ? this.toEntity(order) : null;
  }

  async create(data: CreateOrderInput, client = prisma): Promise<OrderEntity> {
    const order = await client.order.create({
      data: {
        id: data.id,
        userId: data.userId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        status: (data.status ?? "paid") as OrderStatus,
        totalAmount: data.totalAmount,
      },
      include: ORDER_WITH_ITEMS_INCLUDE,
    });

    return this.toEntity(order);
  }

  async update(id: string, data: UpdateOrderInput, client = prisma): Promise<OrderEntity> {
    const order = await client.order.update({
      where: { id },
      data: {
        userId: data.userId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        status: data.status as OrderStatus | undefined,
        totalAmount: data.totalAmount,
      },
      include: ORDER_WITH_ITEMS_INCLUDE,
    });

    return this.toEntity(order);
  }

  async delete(id: string, client = prisma): Promise<void> {
    await client.order.delete({ where: { id } });
  }
}
