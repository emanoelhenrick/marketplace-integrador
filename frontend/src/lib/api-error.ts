import axios from "axios";
import type { ApiErrorInfo } from "@/types/common";

interface BackendBody {
  error?: string;
  message?: string;
  code?: string;
  errors?: Record<string, string>;
  items?: { productId: number | string; available: number }[];
}

export function parseApiError(error: unknown, fallback = "Não foi possível concluir a operação."): ApiErrorInfo {
  if (!axios.isAxiosError<BackendBody>(error)) {
    return { status: null, code: "UNKNOWN", message: fallback };
  }
  if (!error.response) {
    return {
      status: null,
      code: "NETWORK_ERROR",
      message: "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
    };
  }

  const { status, data } = error.response;
  const backendMessage = data?.error ?? data?.message;

  const defaults: Record<number, [string, string]> = {
    400: ["VALIDATION_ERROR", "Dados inválidos. Verifique os campos preenchidos."],
    401: ["UNAUTHORIZED", "Sua sessão expirou. Entre novamente."],
    403: ["FORBIDDEN", "Você não tem permissão para esta ação."],
    404: ["NOT_FOUND", "Não encontramos o que você procura."],
    409: ["CONFLICT", "A operação entrou em conflito com o estado atual."],
    422: ["VALIDATION_ERROR", "Dados inválidos. Verifique os campos preenchidos."],
  };
  const [defaultCode, defaultMessage] =
    defaults[status] ?? (status >= 500 ? ["SERVER_ERROR", "Erro interno no servidor. Tente novamente em instantes."] : ["UNKNOWN", fallback]);

  return {
    status,
    code: data?.code ?? defaultCode,
    message: backendMessage || defaultMessage,
    fieldErrors: data?.errors,
    stockItems: data?.items,
  };
}

export const isStockConflict = (e: ApiErrorInfo) =>
  e.status === 409 && (e.code === "INSUFFICIENT_STOCK" || e.code === "OUT_OF_STOCK" || !!e.stockItems);

export const isForbiddenOrMissing = (e: ApiErrorInfo) => e.status === 403 || e.status === 404;
