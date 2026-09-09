import type { CartItem } from "@/types/cart";

export interface SlottedCartItemFields {
  slotId: number;
  date: string;
  startTime?: string;
  endTime?: string;
  childrenQty?: number;
  adultsQty?: number;
}

export const isSlottedCartItem = <T extends { slotId?: number; date?: string }>(
  item: T
): item is T & SlottedCartItemFields => {
  return typeof item.slotId === "number" && typeof item.date === "string";
};

export const getCartItemKey = (item: {
  id: number;
  slotId?: number;
  date?: string;
}): string => {
  return isSlottedCartItem(item)
    ? `${item.id}_${item.date}_${item.slotId}`
    : `${item.id}`;
};

export const getCartItemVisitors = (item: CartItem): number => {
  return (item.childrenQty ?? 0) + (item.adultsQty ?? 0);
};

// Matches the WayForPay gateway rounding (roundToCoins on the server)
export const roundToCoins = (value: number): number => {
  return Math.round(value * 100) / 100;
};

// Gross line amount: children pay the children price, adults pay adultPrice
export const getCartItemAmount = (item: CartItem): number => {
  if (isSlottedCartItem(item)) {
    return (
      item.price * (item.childrenQty ?? 0) +
      (item.adultPrice ?? 0) * (item.adultsQty ?? 0)
    );
  }
  return item.price * item.quantity;
};
