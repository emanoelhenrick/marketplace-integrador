import { prisma } from "../prisma";
import { OrderItemEntity } from "../entities/order-item.entity";

export type CreateOrderItemInput = Omit<
  OrderItemEntity,
  "id" | "createdAt" | "updatedAt"
> & {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type UpdateOrderItemInput = Partial<CreateOrderItemInput>;

export class OrderItemRepository {
  async findAll(client = prisma): Promise<OrderItemEntity[]> {
    const items = await client.orderItem.findMany({
      orderBy: { createdAt: "desc" },
    });

    return items.map(
      (item) =>
        new OrderItemEntity({
          ...item,
          artisanId: item.artisanId ?? null,
          unitPrice: Number(item.unitPrice),
        })
    );
  }

  async findById(id: string, client = prisma): Promise<OrderItemEntity | null> {
    const item = await client.orderItem.findUnique({ where: { id } });

    if (!item) {
      return null;
    }

    return new OrderItemEntity({
      ...item,
      artisanId: item.artisanId ?? null,
      unitPrice: Number(item.unitPrice),
    });
  }

  async findByOrderId(orderId: string, client = prisma): Promise<OrderItemEntity[]> {
    const items = await client.orderItem.findMany({
      where: { orderId },
      orderBy: { createdAt: "asc" },
    });

    return items.map(
      (item) =>
        new OrderItemEntity({
          ...item,
          artisanId: item.artisanId ?? null,
          unitPrice: Number(item.unitPrice),
        })
    );
  }

  async create(data: CreateOrderItemInput, client = prisma): Promise<OrderItemEntity> {
    const item = await client.orderItem.create({
      data: {
        id: data.id,
        orderId: data.orderId,
        productId: data.productId,
        artisanId: data.artisanId ?? null,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        packed: data.packed,
      },
    });

    return new OrderItemEntity({
      ...item,
      artisanId: item.artisanId ?? null,
      unitPrice: Number(item.unitPrice),
    });
  }

  async update(id: string, data: UpdateOrderItemInput, client = prisma): Promise<OrderItemEntity | null> {
    const item = await client.orderItem.update({
      where: { id },
      data: {
        orderId: data.orderId,
        productId: data.productId,
        artisanId: data.artisanId ?? undefined,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        packed: data.packed,
      },
    });

    return new OrderItemEntity({
      ...item,
      artisanId: item.artisanId ?? null,
      unitPrice: Number(item.unitPrice),
    });
  }

  async delete(id: string, client = prisma): Promise<void> {
    await client.orderItem.delete({ where: { id } });
  }
}
