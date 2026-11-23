import type { Id, ModerationStatus } from "./common";

/**
 * Perfil PÚBLICO do artesão. Não herda de User de propósito: e-mail, telefone
 * e senha nunca devem trafegar nas telas públicas.
 */
export interface Artisan {
  id: Id;
  name: string;
  avatarUrl?: string;
  craft: string;
  craftYears: string;
  quote: string;
  location: string;
  polo?: string;
  region?: string;
  totalWorks: number;
  /** Biografia e dados culturais (editáveis pelo próprio artesão). */
  bio?: string;
  culturalHistory?: string;
  techniques?: string[];
  materials?: string[];
  moderationStatus?: ModerationStatus;
}

export interface ArtisanProfileInput {
  bio: string;
  culturalHistory: string;
  quote: string;
  craft: string;
  craftYears: string;
  location: string;
  polo: string;
  region: string;
  techniques: string[];
  materials: string[];
}
