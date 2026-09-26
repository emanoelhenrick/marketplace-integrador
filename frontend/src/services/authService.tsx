import { api } from "./api";
import { User } from "@/types/user";

export interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {
  /**
   * Autentica o usuário contra a fake API (json-server + db.json).
   * Como o json-server não possui um endpoint de autenticação de
   * verdade, buscamos o usuário pelo e-mail e comparamos a senha
   * manualmente no cliente — suficiente para fins de demonstração.
   */
  async login({ email, password }: LoginCredentials): Promise<User> {
    const response = await api.get<User[]>("/users", {
      params: { email },
    });

    const account = response.data[0];

    if (!account || account.password !== password) {
      throw new Error("E-mail ou senha inválidos.");
    }

    return account;
  },
};
