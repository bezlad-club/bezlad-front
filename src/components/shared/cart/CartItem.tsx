"use client";
import { CartItem as CartItemType } from "@/types/cart";
import Image from "next/image";
import { urlForSanityImage } from "@/utils/getUrlForSanityImage";
import IconButton from "../buttons/IconButton";
import CrossIcon from "../icons/CrossIcon";
import { getPriceValue } from "@/utils/getPriceValue";
import QuantityControl from "./QuantityControl";

import { AppliedPromo } from "@/types/promoCode";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  appliedPromo?: AppliedPromo | null;
}

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  appliedPromo,
}: CartItemProps) {
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
    <div className="flex gap-4 p-4 rounded-[12px] bg-white lg:bg-gray border border-gray-light transition-all duration-300 hover:shadow-md">
      <div className="relative w-16 h-16 rounded-[8px] overflow-hidden shrink-0 bg-purple-ultra-light">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={item.title}
            fill
            className="object-cover"
          />
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h4 className="font-azbuka text-[16px] leading-[120%] uppercase text-black truncate">
            {item.title}
          </h4>
          <IconButton
            handleClick={() => onRemove(item.id)}
            className="flex items-center justify-center w-6 h-6 shrink-0 hover:bg-purple-ultra-light rounded-full transition-colors"
            aria-label="Видалити товар"
          >
            <CrossIcon className="w-4 h-4" />
          </IconButton>
        </div>

        {item.description && (
          <p className="text-[12px] text-gray-dark line-clamp-1 mb-2">
            {item.description}
          </p>
        )}

        <div className="flex justify-between items-center">
          <QuantityControl
            quantity={item.quantity}
            onIncrease={() => onUpdateQuantity(item.id, item.quantity + 1)}
            onDecrease={() => onUpdateQuantity(item.id, item.quantity - 1)}
          />

          <div className="flex flex-col items-end">
            <div className="flex flex-col items-end">
              {isApplicable && appliedPromo ? (
                <>
                  <p className="font-bold text-[18px] leading-[120%] font-azbuka text-purple">
                    {itemTotal}{" "}
                    <span className="text-[12px] font-azbuka">грн</span>
                  </p>
                  <p className="text-[12px] text-gray-dark line-through font-azbuka">
                    {originalPrice * item.quantity} грн
                  </p>
                </>
              ) : (
                <p className="font-bold text-[18px] leading-[120%] font-azbuka">
                  {itemTotal}{" "}
                  <span className="text-[12px] font-azbuka">грн</span>
                </p>
              )}
            </div>
            {item.quantity > 1 && (
              <p className="text-[10px] text-gray-dark font-azbuka">
                {Math.round(pricePerItem)} × {item.quantity}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
