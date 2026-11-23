import axios from "axios";

export type AuthErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "NETWORK_ERROR"
  | "SERVER_ERROR"
  | "UNKNOWN_ERROR";

interface BackendErrorResponse {
  error?: string;
}

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly code: AuthErrorCode,
    public readonly status?: number
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export function mapAuthError(error: unknown): AuthError {
  if (!axios.isAxiosError<BackendErrorResponse>(error)) {
    return new AuthError(
      "Ocorreu um erro inesperado na autenticação.",
      "UNKNOWN_ERROR"
    );
  }

  if (!error.response) {
    return new AuthError(
      "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
      "NETWORK_ERROR"
    );
  }

  const { status, data } = error.response;
  const backendMessage = data?.error;

  if (status === 400) {
    return new AuthError(
      backendMessage || "Dados inválidos. Verifique os campos preenchidos.",
      "VALIDATION_ERROR",
      status
    );
  }

  if (status === 401) {
    return new AuthError(
      backendMessage || "E-mail ou senha inválidos.",
      "UNAUTHORIZED",
      status
    );
  }

  if (status >= 500) {
    return new AuthError(
      backendMessage || "Erro interno no servidor. Tente novamente em instantes.",
      "SERVER_ERROR",
      status
    );
  }

  return new AuthError(
    backendMessage || "Não foi possível concluir a operação.",
    "UNKNOWN_ERROR",
    status
  );
}