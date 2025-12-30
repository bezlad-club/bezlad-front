
interface PromoCodeDisplayProps {
  code: string;
  discountPercent: number;
  originalAmount: number;
  discountAmount: number;
  className?: string;
}

export default function PromoCodeDisplay({
  code,
  discountPercent,
  originalAmount,
  discountAmount,
  className = "",
}: PromoCodeDisplayProps) {
  const finalAmount = originalAmount - discountAmount;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex justify-between items-center">
        <span className="text-[12px] text-gray-dark font-azbuka">
          Промо-код &quot;{code}&quot; (
          <span className="font-azbuka">−{discountPercent}%</span>)
        </span>
        <span className="text-[14px] text-gray-dark line-through font-azbuka">
          {originalAmount} грн
        </span>
      </div>
      <div className="flex justify-end">
        <span className="text-[18px] font-bold text-purple font-azbuka">
          {finalAmount} грн
        </span>
      </div>
    </div>
  );
}
