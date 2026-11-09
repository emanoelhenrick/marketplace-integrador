import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/auth";
import { UserRepository } from "../repositories/user.repository";

export class AuthService {
  private userRepository = new UserRepository();

  async register(data: {
    name: string;
    email: string;
    password: string;
    role?: "client" | "artisan" | "admin";
    avatarUrl?: string | null;
    phone?: string | null;
    craft?: string | null;
    craftYears?: string | null;
    quote?: string | null;
    location?: string | null;
    polo?: string | null;
    region?: string | null;
    totalWorks?: number | null;
  }) {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new Error("Usuário já cadastrado.");
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password: passwordHash,
      role: data.role ?? "client",
      avatarUrl: data.avatarUrl ?? null,
      phone: data.phone ?? null,
      craft: data.craft ?? null,
      craftYears: data.craftYears ?? null,
      quote: data.quote ?? null,
      location: data.location ?? null,
      polo: data.polo ?? null,
      region: data.region ?? null,
      totalWorks: data.totalWorks ?? null,
    });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        phone: user.phone,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  async login(data: { email: string; password: string }) {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new Error("Credenciais inválidas.");
    }

    const validPassword = await bcrypt.compare(data.password, user.password);

    if (!validPassword) {
      throw new Error("Credenciais inválidas.");
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        phone: user.phone,
        createdAt: user.createdAt,
      },
      token,
    };
  }
}
