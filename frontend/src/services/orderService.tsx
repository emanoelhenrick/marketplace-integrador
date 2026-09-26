import { api } from "./api";
import { Order, OrderStatus } from "@/types/order";

export const orderService = {
  /**
   * Retorna todos os pedidos cadastrados
   */
  async getAll(): Promise<Order[]> {
    const response = await api.get<Order[]>("/orders");
    return response.data;
  },

  /**
   * Busca um pedido específico pelo seu ID
   */
  async getById(id: number | string): Promise<Order> {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  /**
   * Busca todos os pedidos referentes a um cliente específico (userId)
   */
  async getByUserId(userId: number): Promise<Order[]> {
    const response = await api.get<Order[]>(`/orders?userId=${userId}`);
    return response.data;
  },

  /**
   * Cria/finaliza um novo pedido
   */
  async create(orderData: Omit<Order, "id" | "createdAt">): Promise<Order> {
    const payload = {
      ...orderData,
      createdAt: new Date().toISOString(),
    };
    const response = await api.post<Order>("/orders", payload);
    return response.data;
  },

  /**
   * Atualiza o status do pedido (ex: de 'paid' para 'shipped')
   */
  async updateStatus(id: number | string, status: OrderStatus): Promise<Order> {
    const response = await api.patch<Order>(`/orders/${id}`, { status });
    return response.data;
  },
};