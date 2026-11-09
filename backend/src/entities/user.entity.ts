export type UserRole = "client" | "artisan" | "admin";

export class UserEntity {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
  phone: string | null;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  craft: string | null;
  craftYears: string | null;
  quote: string | null;
  location: string | null;
  polo: string | null;
  region: string | null;
  totalWorks: number | null;

  constructor(data: Partial<UserEntity> = {}) {
    this.id = data.id ?? "";
    this.name = data.name ?? "";
    this.email = data.email ?? "";
    this.role = data.role ?? "client";
    this.avatarUrl = data.avatarUrl ?? null;
    this.phone = data.phone ?? null;
    this.password = data.password ?? "";
    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? new Date();
    this.craft = data.craft ?? null;
    this.craftYears = data.craftYears ?? null;
    this.quote = data.quote ?? null;
    this.location = data.location ?? null;
    this.polo = data.polo ?? null;
    this.region = data.region ?? null;
    this.totalWorks = data.totalWorks ?? null;
  }
}
