"use client";

import { useCallback, useEffect, useRef, useState, type DependencyList } from "react";
import { parseApiError } from "@/lib/api-error";
import type { ApiErrorInfo } from "@/types/common";

interface AsyncState<T> {
  data: T | null;
  error: ApiErrorInfo | null;
  loading: boolean;
}

/**
 * Carrega dados de um service e cuida de loading/erro/corrida entre requisições.
 * `deps` controla quando recarregar; `enabled=false` adia a chamada.
 */
export function useAsync<T>(fn: () => Promise<T>, deps: DependencyList, enabled = true) {
  const [state, setState] = useState<AsyncState<T>>({ data: null, error: null, loading: enabled });
  const [nonce, setNonce] = useState(0);

  // Sempre chama a versão mais recente de `fn`; o refetch é guiado só por `deps`/`enabled`.
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  });
  const depsKey = deps.map((d) => String(d)).join("|");

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState((s) => ({ ...s, loading: true, error: null }));
    fnRef
      .current()
      .then((data) => active && setState({ data, error: null, loading: false }))
      .catch((err) => active && setState((s) => ({ data: s.data, error: parseApiError(err), loading: false })));
    return () => {
      active = false;
    };
  }, [depsKey, enabled, nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  /** Atualização local (otimista ou resposta de uma mutação) sem novo GET. */
  const mutate = useCallback((updater: (current: T | null) => T | null) => {
    setState((s) => ({ ...s, data: updater(s.data) }));
  }, []);

  return { ...state, reload, mutate };
}
