import { CreateProductDto } from "../dto/product.dto";
import { BusinessError } from "../errors/business-error";

export interface ValidatedCreateProductData {
  name: string;
  category: string;
  price: number;
  location: string;
  description: string | null;
  image: string | null;
  quantity: number;
}

const MAX_PRICE = 99999999.99;

export function validateCreateProduct(
  data: CreateProductDto
): ValidatedCreateProductData {
  const missingFields: string[] = [];

  if (isBlank(data.name)) {
    missingFields.push("nome");
  }

  if (isBlank(data.category)) {
    missingFields.push("categoria");
  }

  if (data.price === undefined || data.price === null || isBlank(data.price)) {
    missingFields.push("preço");
  }

  if (missingFields.length > 0) {
    throw new BusinessError(
      `Campos obrigatórios não preenchidos: ${missingFields.join(", ")}.`
    );
  }

  const price = parsePrice(data.price as number | string);
  const quantity = parseQuantity(data.quantity);

  return {
    name: data.name!.trim(),
    category: data.category!.trim(),
    price,
    location: data.location?.trim() ?? "",
    description: data.description?.trim() || null,
    image: data.image?.trim() || null,
    quantity,
  };
}

function isBlank(value: unknown): boolean {
  return value === undefined || value === null || (typeof value === "string" && value.trim() === "");
}

function parsePrice(value: number | string): number {
  const normalizedValue = typeof value === "string" ? value.trim().replace(",", ".") : String(value);

  if (!isNumericPrice(normalizedValue)) {
    throw new BusinessError("Preço inválido.");
  }

  const price = Number(normalizedValue);

  if (!Number.isFinite(price)) {
    throw new BusinessError("Preço inválido.");
  }

  if (price <= 0) {
    throw new BusinessError("O preço deve ser maior que zero.");
  }

  if (getDecimalPlaces(normalizedValue) > 2) {
    throw new BusinessError("O preço deve ter no máximo 2 casas decimais.");
  }

  if (price > MAX_PRICE) {
    throw new BusinessError("O preço informado excede o valor máximo permitido.");
  }

  return price;
}

function isNumericPrice(value: string): boolean {
  return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value);
}

function getDecimalPlaces(value: string): number {
  const [coefficient, exponentText] = value.toLowerCase().split("e");
  const decimalPlaces = coefficient.split(".")[1]?.length ?? 0;
  const exponent = exponentText ? Number(exponentText) : 0;

  return Math.max(0, decimalPlaces - exponent);
}

function parseQuantity(value: CreateProductDto["quantity"]): number {
  if (value === undefined || value === null || value === "") {
    return 0;
  }

  const quantity = typeof value === "string" ? Number(value.trim()) : value;

  if (!Number.isInteger(quantity) || quantity < 0) {
    throw new BusinessError(
      "A quantidade deve ser um número inteiro maior ou igual a zero."
    );
  }

  return quantity;
}