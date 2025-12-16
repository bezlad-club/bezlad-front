"use client";
import { createContext, ReactNode, useMemo, useCallback, useRef } from "react";
import { Cart, CartContextType, CartItem } from "@/types/cart";
import { Service } from "@/types/service";
import useStorage from "@/hooks/useStorage";
import { getPriceValue } from "@/utils/getPriceValue";
import {
  CART_STORAGE_KEY,
  MIN_ITEMS_PER_SERVICE,
  MAX_ITEMS_PER_SERVICE,
  CART_UPDATE_DEBOUNCE,
} from "@/constants/constants";

const INITIAL_CART: Cart = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
};

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart, isLoading] = useStorage<Cart>(
    CART_STORAGE_KEY,
    INITIAL_CART
  );
  const isUpdatingRef = useRef(false);

  const calculateTotals = (
    items: CartItem[]
  ): Pick<Cart, "totalAmount" | "totalItems"> => {
    const totalAmount = items.reduce((sum, item) => {
      const price = getPriceValue(item.price);
      return sum + price * item.quantity;
    }, 0);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return { totalAmount, totalItems };
  };

  const addItem = useCallback(
    (service: Service, quantity: number = 1) => {
      if (isUpdatingRef.current) return;

      isUpdatingRef.current = true;

      const currentCart = cart || INITIAL_CART;
      const existingItemIndex = currentCart.items.findIndex(
        (item) => item.title === service.title
      );

      let newItems: CartItem[];

      if (existingItemIndex !== -1) {
        newItems = currentCart.items.map((item, index) => {
          if (index === existingItemIndex) {
            const newQuantity = Math.min(
              item.quantity + quantity,
              MAX_ITEMS_PER_SERVICE
            );
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
      } else {
        const newItem: CartItem = {
          ...service,
          id: crypto.randomUUID(),
          quantity: Math.min(quantity, MAX_ITEMS_PER_SERVICE),
          addedAt: Date.now(),
        };
        newItems = [...currentCart.items, newItem];
      }

      const totals = calculateTotals(newItems);

      setCart({
        items: newItems,
        ...totals,
      });

      setTimeout(() => {
        isUpdatingRef.current = false;
      }, CART_UPDATE_DEBOUNCE);
    },
    [cart, setCart]
  );

  const removeItem = useCallback(
    (id: string) => {
      setCart((prevCart) => {
        if (!prevCart) return INITIAL_CART;

        const newItems = prevCart.items.filter((item) => item.id !== id);
        const totals = calculateTotals(newItems);

        return {
          items: newItems,
          ...totals,
        };
      });
    },
    [setCart]
  );

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      if (
        quantity < MIN_ITEMS_PER_SERVICE ||
        quantity > MAX_ITEMS_PER_SERVICE
      ) {
        return;
      }

      setCart((prevCart) => {
        if (!prevCart) return INITIAL_CART;

        const newItems = prevCart.items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        );

        const totals = calculateTotals(newItems);

        return {
          items: newItems,
          ...totals,
        };
      });
    },
    [setCart]
  );

  const clearCart = useCallback(() => {
    setCart(INITIAL_CART);
  }, [setCart]);

  const isInCart = useCallback(
    (serviceTitle: string): boolean => {
      if (!cart) return false;
      return cart.items.some((item) => item.title === serviceTitle);
    },
    [cart]
  );

  const getItemQuantity = useCallback(
    (serviceTitle: string): number => {
      if (!cart) return 0;
      const item = cart.items.find((item) => item.title === serviceTitle);
      return item ? item.quantity : 0;
    },
    [cart]
  );

  const contextValue: CartContextType = useMemo(
    () => ({
      cart: cart || INITIAL_CART,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isInCart,
      getItemQuantity,
    }),
    [
      cart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isInCart,
      getItemQuantity,
    ]
  );

  if (isLoading) {
    return null;
  }

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}
