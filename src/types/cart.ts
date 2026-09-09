import type { Service } from "@/payload-types";

export interface CartItem
  extends Pick<Service, "id" | "title" | "description" | "image"> {
  price: number;
  adultPrice?: number;
  quantity: number;
  addedAt: number;
  slotId?: number;
  date?: string;
  startTime?: string;
  endTime?: string;
  childrenQty?: number;
  adultsQty?: number;
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
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (key: string) => boolean;
  getItemQuantity: (key: string) => number;
}
