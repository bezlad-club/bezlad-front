import { CartItem } from "@/types/cart";
import { AppliedPromo } from "@/types/promoCode";
import { getPriceValue } from "./getPriceValue";

export const normalizePromoCode = (code: string): string => {
  return code.trim().toUpperCase();
};

export const calculatePromoDiscount = (
  items: CartItem[],
  promo: AppliedPromo
): number => {
  let discount = 0;

  if (!promo.applicableServices || promo.applicableServices.length === 0) {
    return 0;
  }

  items.forEach((item) => {
    const isApplicable =
      item._id && promo.applicableServices!.includes(item._id);

    if (isApplicable) {
      const price = getPriceValue(item.price);
      discount += (price * item.quantity * promo.discountPercent) / 100;
    }
  });

  return Math.round(discount);
};
