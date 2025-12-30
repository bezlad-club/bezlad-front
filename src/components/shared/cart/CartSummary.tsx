import { CartItem } from "@/types/cart";
import { AppliedPromo } from "@/types/promoCode";
import CartSummaryItem from "./CartSummaryItem";
import PromoCodeDisplay from "../promoCode/PromoCodeDisplay";
import { calculatePromoDiscount } from "@/utils/promoCodeUtils";

interface CartSummaryProps {
  items: CartItem[];
  totalAmount: number;
  appliedPromo?: AppliedPromo | null;
  className?: string;
}

export default function CartSummary({
  items,
  totalAmount,
  appliedPromo,
  className = "",
}: CartSummaryProps) {
  if (items.length === 0) return null;

  const discount = appliedPromo
    ? calculatePromoDiscount(items, appliedPromo)
    : 0;

  return (
    <div className={`p-4 rounded-[12px] bg-purple-ultra-light ${className}`}>
      <h3 className="font-azbuka text-[16px] uppercase mb-3">
        Ваше замовлення:
      </h3>
      <ul className="flex flex-col gap-2 mb-3">
        {items.map((item) => (
          <CartSummaryItem
            key={item.id}
            item={item}
            appliedPromo={appliedPromo}
          />
        ))}
      </ul>
      <div className="pt-3 border-t border-purple-light">
        {appliedPromo ? (
          <PromoCodeDisplay
            code={appliedPromo.code}
            discountPercent={appliedPromo.discountPercent}
            originalAmount={totalAmount}
            discountAmount={discount}
          />
        ) : (
          <div className="flex justify-between items-center">
            <p className="font-bold text-[16px]">Загалом:</p>
            <p className="font-bold text-[20px]">{totalAmount} грн</p>
          </div>
        )}
      </div>
    </div>
  );
}
