import Image from "next/image";
import { CartItem } from "@/types/cart";
import { AppliedPromo } from "@/types/promoCode";
import { urlForSanityImage } from "@/utils/getUrlForSanityImage";
import { getPriceValue } from "@/utils/getPriceValue";

interface CartSummaryItemProps {
  item: CartItem;
  appliedPromo?: AppliedPromo | null;
}

export default function CartSummaryItem({
  item,
  appliedPromo,
}: CartSummaryItemProps) {
  const imageUrl = item.image ? urlForSanityImage(item.image).url() : "";
  const originalPrice = getPriceValue(item.price);

  const isApplicable =
    appliedPromo?.applicableServices &&
    item._id &&
    appliedPromo.applicableServices.includes(item._id);

  const pricePerItem =
    appliedPromo && isApplicable
      ? originalPrice * (1 - appliedPromo.discountPercent / 100)
      : originalPrice;

  const itemTotal = Math.round(pricePerItem * item.quantity);

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
        <p className="text-[12px] text-gray-dark">
          {item.quantity} шт. × {Math.round(pricePerItem)} грн
        </p>
      </div>
      <p className="font-bold shrink-0 font-azbuka">{itemTotal} грн</p>
    </li>
  );
}
