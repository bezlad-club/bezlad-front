import MainButton from "../buttons/MainButton";
import Link from "next/link";
import CartIcon from "../icons/CartIcon";

interface EmptyCartProps {
  onClose: () => void;
}

export default function EmptyCart({ onClose }: EmptyCartProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-24 h-24 lg:w-32 lg:h-32 mb-6 rounded-full bg-purple-ultra-light flex items-center justify-center">
        <CartIcon
          className="w-12 h-12 lg:w-16 lg:h-16 text-purple"
          showBadge={false}
        />
      </div>
      <h3 className="font-azbuka text-[20px] lg:text-[24px] uppercase text-center mb-3">
        Ваша корзина порожня
      </h3>
      <p className="text-[14px] text-center text-gray-dark mb-6 max-w-[280px]">
        Додайте квитки до корзини, щоб оформити замовлення
      </p>
      <Link href="/#price-list" className="w-full max-w-[280px]">
        <MainButton
          className="h-[52px] text-[14px] leading-[120%]"
          onClick={onClose}
        >
          Переглянути тарифи
        </MainButton>
      </Link>
    </div>
  );
}
