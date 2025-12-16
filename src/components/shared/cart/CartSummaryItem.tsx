import Image from "next/image";
import { CartItem } from "@/types/cart";
import { urlForSanityImage } from "@/utils/getUrlForSanityImage";
import { getPriceValue } from "@/utils/getPriceValue";

interface CartSummaryItemProps {
  item: CartItem;
}

export default function CartSummaryItem({ item }: CartSummaryItemProps) {
  const imageUrl = item.image ? urlForSanityImage(item.image).url() : "";
  const itemTotal = getPriceValue(item.price) * item.quantity;

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
          {item.quantity} шт. × {item.price} грн
        </p>
      </div>
      <p className="font-bold shrink-0">{itemTotal} грн</p>
    </li>
  );
}
