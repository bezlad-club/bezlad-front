import { CartItem } from "@/types/cart";
import { AppliedPromo } from "@/types/promoCode";
import {
  getCartItemAmount,
  isSlottedCartItem,
  roundToCoins,
} from "@/utils/cartUtils";

export const normalizePromoCode = (code: string): string => {
  return code.trim().toUpperCase();
};

// Line amount with the promo applied exactly like the purchase route:
// the per-visitor / per-unit price is rounded to 2 coins after the discount,
// then multiplied by quantity (children use price, adults use adultPrice).
export const getDiscountedCartItemAmount = (
  item: CartItem,
  discountPercent: number
): number => {
  const discountFactor = 1 - discountPercent / 100;

  if (isSlottedCartItem(item)) {
    const childPrice = roundToCoins(item.price * discountFactor);
    const adultPrice = roundToCoins((item.adultPrice ?? 0) * discountFactor);
    return roundToCoins(
      childPrice * (item.childrenQty ?? 0) +
        adultPrice * (item.adultsQty ?? 0)
    );
  }

  return roundToCoins(roundToCoins(item.price * discountFactor) * item.quantity);
};

export const calculatePromoDiscount = (
  items: CartItem[],
  promo: AppliedPromo
): number => {
  const applicableServices = promo.applicableServices;
  if (!applicableServices || applicableServices.length === 0) {
    return 0;
  }

  let discount = 0;

  items.forEach((item) => {
    if (applicableServices.includes(item.id)) {
      discount += getCartItemAmount(item) - getDiscountedCartItemAmount(item, promo.discountPercent);
    }
  });

  return roundToCoins(discount);
};
