"use client";
import { Dispatch, SetStateAction } from "react";
import Modal from "../modals/Modal";
import Backdrop from "../backdrop/Backdrop";
import MainButton from "../buttons/MainButton";
import CartItem from "./CartItem";
import EmptyCart from "./EmptyCart";
import { CartItem as CartItemType } from "@/types/cart";

interface CartModalProps {
  isModalShown: boolean;
  setIsModalShown: Dispatch<SetStateAction<boolean>>;
  items: CartItemType[];
  totalAmount: number;
  totalItems: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
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
}: CartModalProps) {
  const isEmpty = items.length === 0;

  const handleCheckout = () => {
    setIsModalShown(false);
    onCheckout();
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
                    />
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-light pt-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-[14px] text-gray-dark font-azbuka">
                      Всього товарів: {totalItems}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[24px] leading-[120%] font-azbuka">
                      {totalAmount}{" "}
                      <span className="text-[14px] font-azbuka">грн</span>
                    </p>
                  </div>
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
