import { api } from "./api";
import { ENDPOINTS } from "./endpoints";
import type { Id } from "@/types/common";
import type { CreateOrderPayload, Order, OrderStatus } from "@/types/order";

export const orderService = {
  /** Pedidos do cliente logado. O servidor filtra pelo token, nunca por um userId enviado. */
  async listMine(): Promise<Order[]> {
    const { data } = await api.get<Order[]>(ENDPOINTS.orders.mine);
    return data;
  },

  /** Pedidos que contêm peças do artesão logado. */
  async listForArtisan(): Promise<Order[]> {
    const { data } = await api.get<Order[]>(ENDPOINTS.orders.artisan);
    return data;
  },

  /** Todos os pedidos (somente administrador). */
  async listAll(): Promise<Order[]> {
    const { data } = await api.get<Order[]>(ENDPOINTS.admin.orders);
    return data;
  },

  /** 403/404 quando o pedido não pertence a quem pergunta. */
  async getById(id: Id): Promise<Order> {
    const { data } = await api.get<Order>(ENDPOINTS.orders.byId(id));
    return data;
  },

  /**
   * Cria o pedido. A baixa de estoque é atômica no servidor; 409 indica estoque
   * insuficiente. A Idempotency-Key evita pedido duplicado em duplo clique/retry.
   */
  async create(payload: CreateOrderPayload, idempotencyKey: string): Promise<Order> {
    const { data } = await api.post<Order>(ENDPOINTS.orders.create, payload, {
      headers: { "Idempotency-Key": idempotencyKey },
    });
    return data;
  },

  async cancel(id: Id): Promise<Order> {
    const { data } = await api.patch<Order>(ENDPOINTS.orders.cancel(id));
    return data;
  },

  /** Artesão confirma a embalagem das peças dele; o servidor decide se o pedido passa a "enviado". */
  async markPacked(id: Id): Promise<Order> {
    const { data } = await api.patch<Order>(ENDPOINTS.orders.pack(id));
    return data;
  },

  async updateStatus(id: Id, status: OrderStatus): Promise<Order> {
    const { data } = await api.patch<Order>(ENDPOINTS.orders.status(id), { status });
    return data;
  },
};
