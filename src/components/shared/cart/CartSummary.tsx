import { CartItem } from "@/types/cart";
import CartSummaryItem from "./CartSummaryItem";

interface CartSummaryProps {
  items: CartItem[];
  totalAmount: number;
  className?: string;
}

export default function CartSummary({
  items,
  totalAmount,
  className = "",
}: CartSummaryProps) {
  if (items.length === 0) return null;

  return (
    <div className={`p-4 rounded-[12px] bg-purple-ultra-light ${className}`}>
      <h3 className="font-azbuka text-[16px] uppercase mb-3">
        Ваше замовлення:
      </h3>
      <ul className="flex flex-col gap-2 mb-3">
        {items.map((item) => (
          <CartSummaryItem key={item.id} item={item} />
        ))}
      </ul>
      <div className="flex justify-between items-center pt-3 border-t border-purple-light">
        <p className="font-bold text-[16px]">Загалом:</p>
        <p className="font-bold text-[20px]">{totalAmount} грн</p>
      </div>
    </div>
  );
}
