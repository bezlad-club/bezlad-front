import { CartItem } from "@/types/cart";
import { AppliedPromo } from "@/types/promoCode";

export const normalizePromoCode = (code: string): string => {
  return code.trim().toUpperCase();
};

export const calculatePromoDiscount = (
  items: CartItem[],
  promo: AppliedPromo
): number => {
  let discount = 0;

  const applicableServices = promo.applicableServices;
  if (applicableServices && applicableServices.length > 0) {
    items.forEach((item) => {
      if (applicableServices.includes(item.id)) {
        discount += (item.price * item.quantity * promo.discountPercent) / 100;
      }
    });
  }

  return Math.round(discount);
};
