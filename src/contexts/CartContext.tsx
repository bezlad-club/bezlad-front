"use client";
import { createContext, ReactNode, useMemo, useCallback, useRef } from "react";
import { Cart, CartContextType, CartItem } from "@/types/cart";
import useStorage from "@/hooks/useStorage";
import { getCartItemAmount, getCartItemKey, isSlottedCartItem } from "@/utils/cartUtils";
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
    const totalAmount = items.reduce(
      (sum, item) => sum + getCartItemAmount(item),
      0
    );

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return { totalAmount, totalItems };
  };

  const addItem = useCallback(
    (service: Omit<CartItem, "quantity" | "addedAt">, quantity: number = 1) => {
      if (isUpdatingRef.current) return;

      isUpdatingRef.current = true;

      const currentCart = cart || INITIAL_CART;
      const itemKey = getCartItemKey(service);
      const existingItemIndex = currentCart.items.findIndex(
        (item) => getCartItemKey(item) === itemKey
      );

      let newItems: CartItem[];

      if (existingItemIndex !== -1) {
        newItems = currentCart.items.map((item, index) => {
          if (index === existingItemIndex) {
            if (isSlottedCartItem(service)) {
              const childrenQty = Math.min(
                (item.childrenQty ?? 0) + (service.childrenQty ?? 0),
                MAX_ITEMS_PER_SERVICE
              );
              const adultsQty = Math.min(
                (item.adultsQty ?? 0) + (service.adultsQty ?? 0),
                MAX_ITEMS_PER_SERVICE
              );
              return {
                ...item,
                // Price fields come from the slot (fresh values win)
                price: service.price,
                adultPrice: service.adultPrice,
                childrenQty,
                adultsQty,
                quantity: childrenQty + adultsQty,
              };
            }
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
          quantity: isSlottedCartItem(service)
            ? (service.childrenQty ?? 0) + (service.adultsQty ?? 0)
            : Math.min(quantity, MAX_ITEMS_PER_SERVICE),
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
    (key: string) => {
      setCart((prevCart) => {
        if (!prevCart) return INITIAL_CART;

        const newItems = prevCart.items.filter(
          (item) => getCartItemKey(item) !== key
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

  const updateQuantity = useCallback(
    (key: string, quantity: number) => {
      if (
        quantity < MIN_ITEMS_PER_SERVICE ||
        quantity > MAX_ITEMS_PER_SERVICE
      ) {
        return;
      }

      setCart((prevCart) => {
        if (!prevCart) return INITIAL_CART;

        const newItems = prevCart.items.map((item) =>
          getCartItemKey(item) === key ? { ...item, quantity } : item
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
    (key: string): boolean => {
      if (!cart) return false;
      return cart.items.some((item) => getCartItemKey(item) === key);
    },
    [cart]
  );

  const getItemQuantity = useCallback(
    (key: string): number => {
      if (!cart) return 0;
      const item = cart.items.find((item) => getCartItemKey(item) === key);
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
