import { api } from "./api";
import { Order, OrderStatus } from "@/types/order";

export const orderService = {
  /** Todos os pedidos — uso restrito ao perfil administrador. */
  async getAll(): Promise<Order[]> {
    const response = await api.get<Order[]>("/orders");
    return response.data;
  },

  async getById(id: number | string): Promise<Order> {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  /** Pedidos de um cliente específico (userId). */
  async getByUserId(userId: number | string): Promise<Order[]> {
    const response = await api.get<Order[]>("/orders", { params: { userId } });
    return response.data;
  },

  /**
   * Pedidos que contêm peças de um artesão. O json-server não filtra dentro de
   * arrays aninhados de forma confiável, então o filtro final é feito aqui.
   */
  async getByArtisan(artisanId: number | string): Promise<Order[]> {
    const response = await api.get<Order[]>("/orders");
    return response.data.filter((order) =>
      order.items?.some((item) => String(item.artisanId) === String(artisanId)),
    );
  },

  async create(orderData: Omit<Order, "id" | "createdAt">): Promise<Order> {
    const payload = { ...orderData, createdAt: new Date().toISOString() };
    const response = await api.post<Order>("/orders", payload);
    return response.data;
  },

  async updateStatus(id: number | string, status: OrderStatus): Promise<Order> {
    const response = await api.patch<Order>(`/orders/${id}`, { status });
    return response.data;
  },

  /**
   * Artesão confirma que embalou as peças dele no pedido. Quando todas as
   * peças do pedido estiverem embaladas, o pedido passa para "enviado".
   */
  async markItemsPacked(
    order: Order,
    artisanId: number | string,
  ): Promise<Order> {
    const items = order.items.map((item) =>
      String(item.artisanId) === String(artisanId)
        ? { ...item, packed: true }
        : item,
    );
    const allPacked = items.every((item) => item.packed);
    const response = await api.patch<Order>(`/orders/${order.id}`, {
      items,
      ...(allPacked ? { status: "shipped" as OrderStatus } : {}),
    });
    return response.data;
  },
};
