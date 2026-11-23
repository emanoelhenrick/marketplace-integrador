import { eventService } from "@/services/eventService";
import type { TrackedEvent, TrackedEventType } from "@/types/recommendation";

const FLUSH_INTERVAL_MS = 5000;
const MAX_BATCH = 20;
const SESSION_KEY = "manoa-anon-session";

let queue: TrackedEvent[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;
let listenersAttached = false;
const seenImpressions = new Set<string>();

/** UUID aleatório por aba. Não deriva de usuário, e-mail ou token. */
export function getAnonymousSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    let id = window.sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      window.sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "anonymous";
  }
}

/**
 * Whitelist explícita: mesmo que alguém passe campos extras (nome, e-mail, id do
 * usuário), só os campos abaixo saem do navegador.
 */
export function sanitizeEvent(input: {
  type: TrackedEventType;
  productId: number | string;
  surface: string;
  position?: number;
}): TrackedEvent {
  return {
    type: input.type === "click" ? "click" : "impression",
    productId: String(input.productId),
    surface: String(input.surface).slice(0, 40),
    ...(Number.isInteger(input.position) ? { position: input.position } : {}),
    sessionId: getAnonymousSessionId(),
    timestamp: new Date().toISOString(),
  };
}

async function flush(): Promise<void> {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  if (queue.length === 0) return;
  const batch = queue;
  queue = [];
  try {
    await eventService.sendBatch(batch);
  } catch {
    // Métrica é "melhor esforço": falha de rede nunca atrapalha a navegação.
  }
}

function attachListeners() {
  if (listenersAttached || typeof document === "undefined") return;
  listenersAttached = true;
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") void flush();
  });
  window.addEventListener("pagehide", () => void flush());
}

function enqueue(event: TrackedEvent) {
  attachListeners();
  queue.push(event);
  if (queue.length >= MAX_BATCH) {
    void flush();
    return;
  }
  if (!timer) timer = setTimeout(() => void flush(), FLUSH_INTERVAL_MS);
}

/** Uma exibição por produto/superfície por sessão (evita inflar a métrica ao rolar a página). */
export function trackImpression(productId: number | string, surface: string, position?: number) {
  const key = `${surface}:${productId}`;
  if (seenImpressions.has(key)) return;
  seenImpressions.add(key);
  enqueue(sanitizeEvent({ type: "impression", productId, surface, position }));
}

export function trackClick(productId: number | string, surface: string, position?: number) {
  enqueue(sanitizeEvent({ type: "click", productId, surface, position }));
}
