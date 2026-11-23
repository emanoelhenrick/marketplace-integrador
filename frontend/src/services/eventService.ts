import { api, SKIP_AUTH_HEADER } from "./api";
import { ENDPOINTS } from "./endpoints";
import type { TrackedEvent } from "@/types/recommendation";

export const eventService = {
  /** Envio anônimo: sem Authorization. O corpo já vem saneado por lib/event-tracker. */
  async sendBatch(events: TrackedEvent[]): Promise<void> {
    await api.post(ENDPOINTS.events, { events }, { headers: { [SKIP_AUTH_HEADER]: "1" } });
  },
};
