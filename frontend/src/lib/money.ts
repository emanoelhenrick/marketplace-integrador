/** Todo cálculo monetário é feito em centavos inteiros para evitar erro de ponto flutuante. */
export const toCents = (value: number): number => Math.round((value || 0) * 100);
export const fromCents = (cents: number): number => cents / 100;

export const lineTotalCents = (unitPrice: number, quantity: number): number =>
  toCents(unitPrice) * quantity;

/**
 * Converte o texto digitado em preço. Aceita "150", "150,5", "150.50" e
 * "1.234,56". Retorna null para qualquer coisa inválida (negativo, 3 casas, texto).
 */
export function parsePrice(raw: string): number | null {
  const text = raw.trim().replace(/^R\$\s*/i, "");
  if (!text) return null;

  let normalized = text;
  if (text.includes(",")) {
    normalized = text.replace(/\./g, "").replace(",", ".");
  } else if ((text.match(/\./g) ?? []).length > 1) {
    return null;
  }

  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}
