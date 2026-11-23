import type { PaymentMethod } from "@/types/order";

export const CATEGORIES = [
  "Cerâmica & Barro",
  "Rendas & Bordados",
  "Xilogravura & Cordel",
  "Escultura em Madeira",
  "Cestaria & Fibras Naturais",
  "Arte Sacra & Popular",
  "Tecelagem & Tapeçaria",
  "Joalheria & Biojoias",
] as const;

export const TECHNIQUES = [
  "Modelagem manual",
  "Torno de oleiro",
  "Queima a lenha",
  "Renda renascença",
  "Renda de bilro",
  "Bordado à mão",
  "Xilogravura",
  "Entalhe em madeira",
  "Trançado em palha e cipó",
  "Tecelagem manual",
  "Papel machê",
  "Pintura popular",
] as const;

export const REGIONS = [
  "Região Metropolitana do Recife",
  "Zona da Mata Norte",
  "Zona da Mata Sul",
  "Agreste Pernambucano",
  "Sertão Pernambucano",
  "Vale do São Francisco",
] as const;

export const BR_STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
] as const;

export const PAYMENT_METHODS: { value: PaymentMethod; label: string; hint: string }[] = [
  { value: "pix", label: "Pix", hint: "Aprovação imediata (simulada)" },
  { value: "credit_card", label: "Cartão de crédito", hint: "Pagamento simulado, nenhum dado de cartão é coletado" },
  { value: "boleto", label: "Boleto", hint: "Compensação simulada" },
];

export const ARTISAN_SHARE = 0.85;

export const MAX_QTY_PER_LINE = 99;

export const MAX_COMMENT_LENGTH = 500;
