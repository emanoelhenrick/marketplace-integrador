import { prisma } from "../prisma";
import { OrderEntity, OrderStatus } from "../entities/order.entity";

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
  async findAll(client = prisma): Promise<OrderEntity[]> {
    const orders = await client.order.findMany({
      include: {
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return orders.map(
      (order) =>
        new OrderEntity({
          ...order,
          status: order.status as OrderStatus,
          totalAmount: Number(order.totalAmount),
        })
    );
  }

  async findById(id: string, client = prisma): Promise<OrderEntity | null> {
    const order = await client.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      return null;
    }

    return new OrderEntity({
      ...order,
      status: order.status as OrderStatus,
      totalAmount: Number(order.totalAmount),
    });
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
      include: { items: true },
    });

    return new OrderEntity({
      ...order,
      status: order.status as OrderStatus,
      totalAmount: Number(order.totalAmount),
    });
  }

  async update(id: string, data: UpdateOrderInput, client = prisma): Promise<OrderEntity | null> {
    const order = await client.order.update({
      where: { id },
      data: {
        userId: data.userId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        status: data.status as OrderStatus | undefined,
        totalAmount: data.totalAmount,
      },
      include: { items: true },
    });

    return new OrderEntity({
      ...order,
      status: order.status as OrderStatus,
      totalAmount: Number(order.totalAmount),
    });
  }

  async delete(id: string, client = prisma): Promise<void> {
    await client.order.delete({ where: { id } });
  }
}
