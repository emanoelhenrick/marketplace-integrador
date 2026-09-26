export type UserRole = "client" | "artisan" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  createdAt?: string;
  /**
   * Usado apenas pela fake API (db.json / json-server) para simular o
   * login. Nunca deve ser persistido no estado da aplicação após a
   * autenticação — veja `authService.login`.
   */
  password?: string;
}