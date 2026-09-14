"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export const PROTECTION_PRICE = 800;
export const PROTECTION_KEY = "package-protection";

export type CartLine = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  line: string;
  image: string;
  color: string;
  colorHex: string;
  size: string;
  price: number;
  quantity: number;
  giftWrap?: boolean;
  kind?: "product" | "protection";
};

type CartContextValue = {
  lines: CartLine[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addLine: (line: Omit<CartLine, "key" | "quantity"> & { quantity?: number }) => void;
  removeLine: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  setGiftWrap: (key: string, giftWrap: boolean) => void;
  protection: boolean;
  setProtection: (on: boolean) => void;
  count: number;
  subtotal: number;
  /** Increments on each successful add — drives bag micro-feedback */
  addEpoch: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "sable-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [addEpoch, setAddEpoch] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const addLine: CartContextValue["addLine"] = (incoming) => {
      const key = `${incoming.productId}-${incoming.color}-${incoming.size}`;
      setLines((current) => {
        const existing = current.find((line) => line.key === key);
        if (existing) {
          return current.map((line) =>
            line.key === key
              ? { ...line, quantity: line.quantity + (incoming.quantity ?? 1) }
              : line,
          );
        }
        return [
          ...current,
          { ...incoming, key, quantity: incoming.quantity ?? 1 },
        ];
      });
      setAddEpoch((current) => current + 1);
      setIsOpen(true);
    };

    return {
      lines,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addLine,
      addEpoch,
      removeLine: (key) =>
        setLines((current) => current.filter((line) => line.key !== key)),
      setQuantity: (key, quantity) =>
        setLines((current) =>
          quantity <= 0
            ? current.filter((line) => line.key !== key)
            : current.map((line) =>
                line.key === key ? { ...line, quantity } : line,
              ),
        ),
        setGiftWrap: (key, giftWrap) =>
          setLines((current) =>
            current.map((line) =>
              line.key === key ? { ...line, giftWrap } : line,
            ),
          ),
      protection: lines.some((line) => line.kind === "protection"),
      setProtection: (on) => {
        setLines((current) => {
          const without = current.filter((line) => line.kind !== "protection");
          if (!on) return without;
          return [
            ...without,
            {
              key: PROTECTION_KEY,
              productId: "protection",
              slug: "shipping",
              name: "Package protection",
              line: "Service",
              image: "",
              color: "—",
              colorHex: "#141414",
              size: "—",
              price: PROTECTION_PRICE,
              quantity: 1,
              kind: "protection",
            },
          ];
        });
      },
      count: lines
        .filter((line) => line.kind !== "protection")
        .reduce((sum, line) => sum + line.quantity, 0),
      subtotal: lines.reduce((sum, line) => sum + line.price * line.quantity, 0),
    };
  }, [lines, isOpen, addEpoch]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
