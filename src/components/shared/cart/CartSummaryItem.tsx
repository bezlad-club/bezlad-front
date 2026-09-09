import Image from "next/image";
import { CartItem } from "@/types/cart";
import { AppliedPromo } from "@/types/promoCode";
import { getImageUrl } from "@/utils/getImageUrl";
import { formatDateShortUk } from "@/utils/dateUtils";
import {
  getCartItemAmount,
  isSlottedCartItem,
  roundToCoins,
} from "@/utils/cartUtils";
import { getDiscountedCartItemAmount } from "@/utils/promoCodeUtils";

interface CartSummaryItemProps {
  item: CartItem;
  appliedPromo?: AppliedPromo | null;
}

export default function CartSummaryItem({
  item,
  appliedPromo,
}: CartSummaryItemProps) {
  const imageUrl = item.image ? getImageUrl(item.image) : "";
  const isSlotted = isSlottedCartItem(item);

  const isApplicable =
    appliedPromo?.applicableServices?.includes(item.id) ?? false;

  const itemTotal =
    appliedPromo && isApplicable
      ? getDiscountedCartItemAmount(item, appliedPromo.discountPercent)
      : roundToCoins(getCartItemAmount(item));

  const pricePerItem = roundToCoins(
    item.price *
      (appliedPromo && isApplicable
        ? 1 - appliedPromo.discountPercent / 100
        : 1)
  );

  return (
    <li className="flex items-center gap-3 text-[14px]">
      {imageUrl && (
        <div className="relative w-10 h-10 rounded-[6px] overflow-hidden shrink-0">
          <Image
            src={imageUrl}
            alt={item.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">{item.title}</p>
        {isSlotted ? (
          <p className="text-[12px] text-gray-dark">
            {formatDateShortUk(item.date)} · {item.startTime} -{" "}
            {item.endTime} · Діти: {item.childrenQty ?? 0}, Дорослі:{" "}
            {item.adultsQty ?? 0}
          </p>
        ) : (
          <p className="text-[12px] text-gray-dark">
            {item.quantity} шт. × {pricePerItem} грн
          </p>
        )}
      </div>
      <p className="font-bold shrink-0 font-azbuka">{itemTotal} грн</p>
    </li>
  );
}
