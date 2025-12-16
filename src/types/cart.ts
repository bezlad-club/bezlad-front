import { Service } from "./service";

export interface CartItem extends Service {
  id: string;
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
  addItem: (service: Service, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (serviceTitle: string) => boolean;
  getItemQuantity: (serviceTitle: string) => number;
}
