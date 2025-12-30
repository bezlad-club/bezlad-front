"use client";
import { Dispatch, SetStateAction, useState } from "react";
import Modal from "../modals/Modal";
import Backdrop from "../backdrop/Backdrop";
import MainButton from "../buttons/MainButton";
import CartItem from "./CartItem";
import EmptyCart from "./EmptyCart";
import PromoCodeInput from "../promoCode/PromoCodeInput";
import PromoCodeDisplay from "../promoCode/PromoCodeDisplay";
import { CartItem as CartItemType } from "@/types/cart";
import { AppliedPromo } from "@/types/promoCode";
import { calculatePromoDiscount } from "@/utils/promoCodeUtils";

interface CartModalProps {
  isModalShown: boolean;
  setIsModalShown: Dispatch<SetStateAction<boolean>>;
  items: CartItemType[];
  totalAmount: number;
  totalItems: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: (appliedPromo?: AppliedPromo | null) => void;
  appliedPromo?: AppliedPromo | null;
  onPromoChange?: (promo: AppliedPromo | null) => void;
}

export default function CartModal({
  isModalShown,
  setIsModalShown,
  items,
  totalAmount,
  totalItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  appliedPromo: externalAppliedPromo,
  onPromoChange,
}: CartModalProps) {
  const isEmpty = items.length === 0;
  const [localAppliedPromo, setLocalAppliedPromo] =
    useState<AppliedPromo | null>(null);

  const appliedPromo =
    externalAppliedPromo !== undefined
      ? externalAppliedPromo
      : localAppliedPromo;

  const discount = appliedPromo
    ? calculatePromoDiscount(items, appliedPromo)
    : 0;
  
  // Check if promo applies to at least one item
  const isPromoApplicable = appliedPromo
    ? items.some((item) =>
        appliedPromo.applicableServices?.includes(item._id || "")
      )
    : false;

  // Check if promo is partial (applies to some but not all items)
  // Logic: if promo has applicableServices AND there is at least one item in cart NOT in that list
  const isPartialPromo =
    isPromoApplicable &&
    appliedPromo &&
    appliedPromo.applicableServices &&
    items.some(
      (item) => !appliedPromo.applicableServices!.includes(item._id || "")
    );

  const finalAmount = totalAmount - discount;

  const handleCheckout = () => {
    setIsModalShown(false);
    onCheckout(appliedPromo);
  };

  const handleApplyPromo = (promo: AppliedPromo) => {
    setLocalAppliedPromo(promo);
    if (onPromoChange) {
      onPromoChange(promo);
    }
  };

  return (
    <>
      <Modal
        isModalShown={isModalShown}
        setIsModalShown={setIsModalShown}
        className="pb-5 lg:pb-[22px] pr-2 lg:pr-8"
      >
        <div className="flex-1 flex flex-col pr-3 overflow-hidden">
          <h2 className="mb-6 font-azbuka text-[24px] lg:text-[35px] font-normal leading-[120%] text-center uppercase">
            Ваша корзина
          </h2>

          {isEmpty ? (
            <EmptyCart onClose={() => setIsModalShown(false)} />
          ) : (
            <>
              <div className="flex-1 overflow-y-auto scrollbar scrollbar-w-[3px] lg:scrollbar-w-[4px] scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-purple scrollbar-track-purple/10 mb-6">
                <div className="flex flex-col gap-3 pr-2">
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={onUpdateQuantity}
                      onRemove={onRemoveItem}
                      appliedPromo={appliedPromo}
                    />
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-light pt-4">
                <PromoCodeInput
                  onApply={handleApplyPromo}
                  appliedCode={appliedPromo?.code}
                />

                <div className="mb-2">
                  <p className="text-[14px] text-gray-dark font-azbuka">
                    Всього товарів: {totalItems}
                  </p>
                </div>

                {appliedPromo && (
                  <div className="mb-3">
                    {isPromoApplicable ? (
                      <PromoCodeDisplay
                        code={appliedPromo.code}
                        discountPercent={appliedPromo.discountPercent}
                        originalAmount={totalAmount}
                        discountAmount={discount}
                        isPartial={isPartialPromo || false}
                      />
                    ) : (
                      <div className="text-red-500 text-[12px] font-azbuka">
                        Промо-код не застосовується до товарів у кошику
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-center mb-4">
                  <p className="font-bold text-[16px] font-azbuka">
                    Сума до сплати:
                  </p>
                  <p className="font-bold text-[24px] leading-[120%] font-azbuka">
                    {finalAmount}{" "}
                    <span className="text-[14px] font-azbuka">грн</span>
                  </p>
                </div>

                <MainButton
                  onClick={handleCheckout}
                  className="w-full h-14 text-[14px] lg:text-[16px]"
                >
                  Оформити замовлення
                </MainButton>
              </div>
            </>
          )}
        </div>
      </Modal>
      <Backdrop
        isVisible={isModalShown}
        onClick={() => setIsModalShown(false)}
      />
    </>
  );
}
