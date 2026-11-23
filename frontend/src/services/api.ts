import axios from "axios";

let accessToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

export const SKIP_AUTH_HEADER = "X-Skip-Auth";

export function setAuthToken(token: string | null): void {
  accessToken = token;
}

export function getAuthToken(): string | null {
  return accessToken;
}

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (config.headers.has(SKIP_AUTH_HEADER)) {
    config.headers.delete(SKIP_AUTH_HEADER);
    return config;
  }
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401 && accessToken) {
      setAuthToken(null);
      onUnauthorized?.();
    }
    return Promise.reject(error);
  },
);
