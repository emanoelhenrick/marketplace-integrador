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
  async findAll(): Promise<OrderEntity[]> {
    const orders = await prisma.order.findMany({
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

  async findById(id: string): Promise<OrderEntity | null> {
    const order = await prisma.order.findUnique({
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

  async create(data: CreateOrderInput): Promise<OrderEntity> {
    const order = await prisma.order.create({
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

  async update(id: string, data: UpdateOrderInput): Promise<OrderEntity | null> {
    const order = await prisma.order.update({
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

  async delete(id: string): Promise<void> {
    await prisma.order.delete({ where: { id } });
  }
}
