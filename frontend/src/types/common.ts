export type Id = number | string;

export type ModerationStatus = "pending" | "approved" | "rejected";

/** Erro normalizado vindo da API (ver lib/api-error.ts). */
export interface ApiErrorInfo {
  status: number | null;
  code: string;
  message: string;
  fieldErrors?: Record<string, string>;
  /** Preenchido em 409 de estoque: o que ainda está disponível por produto. */
  stockItems?: { productId: Id; available: number }[];
}
