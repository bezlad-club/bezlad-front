export const getPriceValue = (price: string | number | undefined): number => {
  if (!price) return 0;
  if (typeof price === "number") return price;
  return parseFloat(price.replace(/\D/g, "")) || 0;
};
