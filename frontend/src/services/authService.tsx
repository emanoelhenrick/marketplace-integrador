import { api } from "./api";
import { LoginCredentials, User } from "@/types/user";


export const authService = {
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
