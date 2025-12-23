export const normalizePromoCode = (code: string): string => {
  return code.trim().toUpperCase();
};

export const calculatePromoDiscount = (
  amount: number,
  discountPercent: number
): number => {
  return Math.round((amount * discountPercent) / 100);
};
