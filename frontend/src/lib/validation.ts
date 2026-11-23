import { BR_STATES, MAX_COMMENT_LENGTH } from "@/lib/constants";
import { parsePrice } from "@/lib/money";
import { onlyDigits } from "@/lib/text";
import type { ArtisanProfileInput } from "@/types/artisan";
import type { ProductFormValues, ProductInput } from "@/types/product";
import type { ReviewInput } from "@/types/review";
import type { ShippingAddress } from "@/types/order";

export type FieldErrors<T> = Partial<Record<keyof T, string>>;
export type Validation<TValue, TForm> =
  | { ok: true; value: TValue; errors: Record<string, never> }
  | { ok: false; errors: FieldErrors<TForm> };

const REQUIRED = "Campo obrigatório.";

// ---------- Endereço de entrega ----------

export function validateAddress(a: ShippingAddress): FieldErrors<ShippingAddress> {
  const errors: FieldErrors<ShippingAddress> = {};
  if (a.recipientName.trim().length < 3) errors.recipientName = "Informe o nome completo de quem vai receber.";
  const phone = onlyDigits(a.phone);
  if (phone.length < 10 || phone.length > 11) errors.phone = "Telefone inválido. Use DDD + número.";
  if (onlyDigits(a.zipCode).length !== 8) errors.zipCode = "CEP inválido. Use 8 dígitos.";
  if (!a.street.trim()) errors.street = REQUIRED;
  if (!a.number.trim()) errors.number = "Informe o número ou S/N.";
  if (!a.neighborhood.trim()) errors.neighborhood = REQUIRED;
  if (!a.city.trim()) errors.city = REQUIRED;
  if (!(BR_STATES as readonly string[]).includes(a.state.trim().toUpperCase())) errors.state = "Selecione o estado.";
  return errors;
}

/** Remove máscaras e espaços antes de enviar. */
export function normalizeAddress(a: ShippingAddress): ShippingAddress {
  return {
    recipientName: a.recipientName.trim(),
    phone: onlyDigits(a.phone),
    zipCode: onlyDigits(a.zipCode),
    street: a.street.trim(),
    number: a.number.trim(),
    complement: a.complement?.trim() || undefined,
    neighborhood: a.neighborhood.trim(),
    city: a.city.trim(),
    state: a.state.trim().toUpperCase(),
  };
}

export const EMPTY_ADDRESS: ShippingAddress = {
  recipientName: "",
  phone: "",
  zipCode: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
};

// ---------- Estoque ----------

/** Estoque manual: inteiro >= 0. Negativo, decimal ou texto são recusados. */
export function parseStock(raw: string | number): { ok: true; value: number } | { ok: false; error: string } {
  const text = String(raw).trim();
  if (text === "") return { ok: false, error: "Informe o estoque." };
  if (!/^-?\d+$/.test(text)) return { ok: false, error: "O estoque deve ser um número inteiro." };
  const value = Number(text);
  if (value < 0) return { ok: false, error: "O estoque não pode ser negativo." };
  if (value > 100000) return { ok: false, error: "Valor de estoque muito alto." };
  return { ok: true, value };
}

// ---------- Produto ----------

export const EMPTY_PRODUCT_FORM: ProductFormValues = {
  name: "",
  description: "",
  story: "",
  price: "",
  stock: "1",
  image: "",
  category: "",
  technique: "",
  region: "",
  location: "",
};

const isHttpUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export function validateProductForm(form: ProductFormValues): Validation<ProductInput, ProductFormValues> {
  const errors: FieldErrors<ProductFormValues> = {};

  if (!form.name.trim()) errors.name = REQUIRED;
  else if (form.name.trim().length > 120) errors.name = "Máximo de 120 caracteres.";
  if (!form.description.trim()) errors.description = REQUIRED;
  if (!form.story.trim()) errors.story = "Conte a história da peça.";
  if (!form.category) errors.category = "Selecione a categoria.";
  if (!form.technique) errors.technique = "Selecione a técnica.";
  if (!form.region) errors.region = "Selecione a região.";

  const price = parsePrice(form.price);
  if (price === null) errors.price = "Preço inválido. Use números, com até 2 casas decimais.";
  else if (price <= 0) errors.price = "O preço deve ser maior que zero.";

  const stock = parseStock(form.stock);
  if (!stock.ok) errors.stock = stock.error;

  if (!form.image.trim()) errors.image = REQUIRED;
  else if (!isHttpUrl(form.image.trim())) errors.image = "Informe uma URL válida (http ou https).";

  if (Object.keys(errors).length > 0 || price === null || !stock.ok) return { ok: false, errors };

  return {
    ok: true,
    errors: {},
    value: {
      name: form.name.trim(),
      description: form.description.trim(),
      story: form.story.trim(),
      price,
      stock: stock.value,
      image: form.image.trim(),
      category: form.category,
      technique: form.technique,
      region: form.region,
      location: form.location.trim(),
    },
  };
}

// ---------- Avaliação ----------

export function validateReview(input: { rating: number; comment: string }): Validation<ReviewInput, ReviewInput> {
  const errors: FieldErrors<ReviewInput> = {};
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
    errors.rating = "Escolha uma nota de 1 a 5.";
  }
  if (input.comment.length > MAX_COMMENT_LENGTH) {
    errors.comment = `O comentário pode ter no máximo ${MAX_COMMENT_LENGTH} caracteres.`;
  }
  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, errors: {}, value: { rating: input.rating, comment: input.comment.trim() } };
}

// ---------- Perfil do artesão ----------

export interface ArtisanProfileFormValues {
  bio: string;
  culturalHistory: string;
  quote: string;
  craft: string;
  craftYears: string;
  location: string;
  polo: string;
  region: string;
  techniques: string;
  materials: string;
}

const splitList = (value: string) =>
  Array.from(new Set(value.split(/[,;\n]/).map((s) => s.trim()).filter(Boolean)));

export function validateArtisanProfile(
  form: ArtisanProfileFormValues,
): Validation<ArtisanProfileInput, ArtisanProfileFormValues> {
  const errors: FieldErrors<ArtisanProfileFormValues> = {};
  if (form.bio.trim().length < 20) errors.bio = "Conte um pouco mais: mínimo de 20 caracteres.";
  if (form.bio.length > 2000) errors.bio = "Máximo de 2000 caracteres.";
  if (form.culturalHistory.length > 4000) errors.culturalHistory = "Máximo de 4000 caracteres.";
  if (!form.craft.trim()) errors.craft = REQUIRED;
  if (!form.location.trim()) errors.location = REQUIRED;
  if (form.quote.length > 240) errors.quote = "Máximo de 240 caracteres.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    errors: {},
    value: {
      bio: form.bio.trim(),
      culturalHistory: form.culturalHistory.trim(),
      quote: form.quote.trim(),
      craft: form.craft.trim(),
      craftYears: form.craftYears.trim(),
      location: form.location.trim(),
      polo: form.polo.trim(),
      region: form.region.trim(),
      techniques: splitList(form.techniques),
      materials: splitList(form.materials),
    },
  };
}
