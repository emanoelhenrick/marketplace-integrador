"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cardStore";

export function CartHydrator() {
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);
  return null;
}
