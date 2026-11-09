import { prisma } from "../prisma";
import { UserEntity, UserRole } from "../entities/user.entity";

export type CreateUserInput = Omit<
  UserEntity,
  "id" | "createdAt" | "updatedAt"
> & {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type UpdateUserInput = Partial<CreateUserInput>;

export class UserRepository {
  async findAll(): Promise<UserEntity[]> {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });

    return users.map(
      (user) =>
        new UserEntity({
          ...user,
          role: user.role as UserRole,
          avatarUrl: user.avatarUrl ?? null,
          phone: user.phone ?? null,
          craft: user.craft ?? null,
          craftYears: user.craftYears ?? null,
          quote: user.quote ?? null,
          location: user.location ?? null,
          polo: user.polo ?? null,
          region: user.region ?? null,
          totalWorks: user.totalWorks ?? null,
        })
    );
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return null;
    }

    return new UserEntity({
      ...user,
      role: user.role as UserRole,
      avatarUrl: user.avatarUrl ?? null,
      phone: user.phone ?? null,
      craft: user.craft ?? null,
      craftYears: user.craftYears ?? null,
      quote: user.quote ?? null,
      location: user.location ?? null,
      polo: user.polo ?? null,
      region: user.region ?? null,
      totalWorks: user.totalWorks ?? null,
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return null;
    }

    return new UserEntity({
      ...user,
      role: user.role as UserRole,
      avatarUrl: user.avatarUrl ?? null,
      phone: user.phone ?? null,
      craft: user.craft ?? null,
      craftYears: user.craftYears ?? null,
      quote: user.quote ?? null,
      location: user.location ?? null,
      polo: user.polo ?? null,
      region: user.region ?? null,
      totalWorks: user.totalWorks ?? null,
    });
  }

  async create(data: CreateUserInput): Promise<UserEntity> {
    const user = await prisma.user.create({
      data: {
        id: data.id,
        name: data.name,
        email: data.email,
        role: (data.role ?? "client") as UserRole,
        avatarUrl: data.avatarUrl ?? null,
        phone: data.phone ?? null,
        password: data.password,
        craft: data.craft ?? null,
        craftYears: data.craftYears ?? null,
        quote: data.quote ?? null,
        location: data.location ?? null,
        polo: data.polo ?? null,
        region: data.region ?? null,
        totalWorks: data.totalWorks ?? null,
      },
    });

    return new UserEntity({
      ...user,
      role: user.role as UserRole,
      avatarUrl: user.avatarUrl ?? null,
      phone: user.phone ?? null,
      craft: user.craft ?? null,
      craftYears: user.craftYears ?? null,
      quote: user.quote ?? null,
      location: user.location ?? null,
      polo: user.polo ?? null,
      region: user.region ?? null,
      totalWorks: user.totalWorks ?? null,
    });
  }

  async update(id: string, data: UpdateUserInput): Promise<UserEntity | null> {
    const user = await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        role: data.role as UserRole | undefined,
        avatarUrl: data.avatarUrl ?? undefined,
        phone: data.phone ?? undefined,
        password: data.password,
        craft: data.craft ?? undefined,
        craftYears: data.craftYears ?? undefined,
        quote: data.quote ?? undefined,
        location: data.location ?? undefined,
        polo: data.polo ?? undefined,
        region: data.region ?? undefined,
        totalWorks: data.totalWorks ?? undefined,
      },
    });

    return new UserEntity({
      ...user,
      role: user.role as UserRole,
      avatarUrl: user.avatarUrl ?? null,
      phone: user.phone ?? null,
      craft: user.craft ?? null,
      craftYears: user.craftYears ?? null,
      quote: user.quote ?? null,
      location: user.location ?? null,
      polo: user.polo ?? null,
      region: user.region ?? null,
      totalWorks: user.totalWorks ?? null,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}
