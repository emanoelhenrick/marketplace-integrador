"use client";

import { api } from "@/services/api";
import { useEffect, useState } from "react";


const userNameCache = new Map<string, string>();
const inflightRequests = new Map<string, Promise<string>>();

interface ReviewerNameProps {
  userId: string | number;
  fallbackName?: string;
}

function resolveUserName(id: string): Promise<string> {
  const cached = userNameCache.get(id);
  if (cached) return Promise.resolve(cached);

  const existing = inflightRequests.get(id);
  if (existing) return existing;

  const request = api
    .get<{ name?: string }>(`/users/${id}`)
    .then((response) => {
      const resolvedName = response?.name?.trim() || "Cliente Manoa";
      userNameCache.set(id, resolvedName);
      return resolvedName;
    })
    .catch(() => "Cliente Manoa")
    .finally(() => {
      inflightRequests.delete(id);
    });

  inflightRequests.set(id, request);
  return request;
}

export function ReviewerName({ userId, fallbackName }: ReviewerNameProps) {
  const normalizedId = String(userId ?? "").trim();

  const [name, setName] = useState<string>(() => {
    if (fallbackName?.trim()) return fallbackName.trim();
    if (!normalizedId) return "Cliente Manoa";
    return userNameCache.get(normalizedId) ?? "";
  });

  useEffect(() => {
    if (fallbackName?.trim()) {
      setName(fallbackName.trim());
      return;
    }

    if (!normalizedId) {
      setName("Cliente Manoa");
      return;
    }

    const cached = userNameCache.get(normalizedId);
    if (cached) {
      setName(cached);
      return;
    }

    let isMounted = true;

    resolveUserName(normalizedId).then((resolved) => {
      if (isMounted) setName(resolved);
    });

    return () => {
      isMounted = false;
    };
  }, [normalizedId, fallbackName]);

  if (!name) {
    return (
      <span
        aria-label="Carregando nome do cliente"
        className="inline-block h-4 w-24 animate-pulse rounded bg-muted align-middle"
      />
    );
  }

  return <span>{name}</span>;
}