import type { Service } from "@/payload-types";

export interface CartItem
  extends Pick<Service, "id" | "title" | "price" | "description" | "image"> {
  quantity: number;
  addedAt: number;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

export interface CartContextType {
  cart: Cart;
  addItem: (
    service: Omit<CartItem, "quantity" | "addedAt">,
    quantity?: number
  ) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  isInCart: (serviceTitle: string) => boolean;
  getItemQuantity: (serviceTitle: string) => number;
}
