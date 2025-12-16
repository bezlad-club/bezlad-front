import {
  MIN_ITEMS_PER_SERVICE,
  MAX_ITEMS_PER_SERVICE,
} from "@/constants/constants";

interface QuantityControlProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
  className?: string;
}

export default function QuantityControl({
  quantity,
  onIncrease,
  onDecrease,
  min = MIN_ITEMS_PER_SERVICE,
  max = MAX_ITEMS_PER_SERVICE,
  className = "",
}: QuantityControlProps) {
  return (
    <div
      className={`flex items-center gap-2 bg-gray-light rounded-full px-1 py-1 ${className}`}
    >
      <button
        onClick={onDecrease}
        disabled={quantity <= min}
        className="w-7 h-7 rounded-full bg-white flex items-center justify-center 
          disabled:opacity-40 disabled:cursor-not-allowed
          enabled:hover:bg-purple-ultra-light enabled:active:scale-95
          transition-all duration-200 cursor-pointer"
        aria-label="Зменшити кількість"
      >
        <span className="text-[16px] font-bold">−</span>
      </button>
      <span className="text-[14px] font-bold w-6 text-center font-azbuka">
        {quantity}
      </span>
      <button
        onClick={onIncrease}
        disabled={quantity >= max}
        className="w-7 h-7 rounded-full bg-white flex items-center justify-center 
          disabled:opacity-40 disabled:cursor-not-allowed
          enabled:hover:bg-purple-ultra-light enabled:active:scale-95
          transition-all duration-200 cursor-pointer"
        aria-label="Збільшити кількість"
      >
        <span className="text-[16px] font-bold">+</span>
      </button>
    </div>
  );
}
