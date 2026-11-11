export class ProductEntity {
  id: number;
  name: string;
  price: number;
  stars: number;
  category: string;
  artisan: string;
  artisanId: string | null;
  location: string;
  image: string | null;
  description: string | null;
  quantity: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<ProductEntity> = {}) {
    this.id = data.id ?? 0;
    this.name = data.name ?? "";
    this.price = data.price ?? 0;
    this.stars = data.stars ?? 0;
    this.category = data.category ?? "";
    this.artisan = data.artisan ?? "";
    this.artisanId = data.artisanId ?? null;
    this.location = data.location ?? "";
    this.image = data.image ?? null;
    this.description = data.description ?? null;
    this.quantity = data.quantity ?? 0;
    this.active = data.active ?? true;
    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? new Date();
  }
}
