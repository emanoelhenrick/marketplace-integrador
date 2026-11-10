import { ForbiddenError, NotFoundError } from "../errors/business-error";
import { OrderEntity } from "../entities/order.entity";
import { OrderItemEntity } from "../entities/order-item.entity";
import { OrderRepository } from "../repositories/order.repository";

export class OrderService {
  constructor(private readonly orderRepository = new OrderRepository()) {}

  async listByBuyer(buyer: { id: string; email: string; role: string }) {
    this.ensureClient(buyer.role);

    const orders = await this.orderRepository.findByUserId(buyer.id);
    return orders.map((order) => this.toResponse(order));
  }

  async getByIdForBuyer(
    buyer: { id: string; email: string; role: string },
    orderId: string
  ) {
    this.ensureClient(buyer.role);

    const order = await this.orderRepository.findByIdAndUserId(orderId, buyer.id);

    if (!order) {
      throw new NotFoundError("Pedido não encontrado.");
    }

    return this.toResponse(order);
  }

  private ensureClient(role: string) {
    if (role !== "client") {
      throw new ForbiddenError("Usuário sem permissão para consultar pedidos.");
    }
  }

  private toResponse(order: OrderEntity) {
    const items = (order as OrderEntity & { items: OrderItemEntity[] }).items ?? [];

    return {
      id: order.id,
      status: order.status,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
      })),
    };
  }
}