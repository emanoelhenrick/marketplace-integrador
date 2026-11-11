import { ForbiddenError, NotFoundError } from "../errors/business-error";
import {
  OrderRepository,
  OrderWithArtisanItems,
} from "../repositories/order.repository";

export class ArtisanOrderService {
  constructor(private readonly orderRepository = new OrderRepository()) {}

  async list(artisan: { id: string; email: string; role: string }) {
    this.ensureArtisan(artisan.role);

    const orders = await this.orderRepository.findByArtisanId(artisan.id);
    return orders.map((order) => this.toResponse(order));
  }

  async getById(
    artisan: { id: string; email: string; role: string },
    orderId: string
  ) {
    this.ensureArtisan(artisan.role);

    const order = await this.orderRepository.findByIdForArtisan(orderId, artisan.id);

    if (order) {
      return this.toResponse(order);
    }

    const existingOrder = await this.orderRepository.findById(orderId);

    if (!existingOrder) {
      throw new NotFoundError("Pedido não encontrado.");
    }

    throw new ForbiddenError("Você não tem permissão para acessar este pedido.");
  }

  private ensureArtisan(role: string) {
    if (role !== "artisan") {
      throw new ForbiddenError(
        "Usuário sem permissão para consultar pedidos de artesão."
      );
    }
  }

  private toResponse(order: OrderWithArtisanItems) {
    return {
      id: order.id,
      status: order.status,
      customerName: order.customerName,
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        packed: item.packed,
      })),
      artisanSubtotal: order.items.reduce(
        (subtotal, item) => subtotal + Number(item.unitPrice) * item.quantity,
        0
      ),
    };
  }
}