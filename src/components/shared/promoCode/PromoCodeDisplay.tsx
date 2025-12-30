
interface PromoCodeDisplayProps {
  code: string;
  discountPercent: number;
  className?: string;
  isPartial?: boolean;
}

export default function PromoCodeDisplay({
  code,
  discountPercent,
  className = "",
  isPartial = false,
}: PromoCodeDisplayProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-center">
        <span className="text-[14px] text-gray-dark font-azbuka">
          Промо-код &quot;{code}&quot; (
          <span className="font-azbuka text-purple">
            −{discountPercent}%{isPartial && "*"}
          </span>
          )
        </span>
      </div>
      {isPartial && (
        <div className="flex justify-start">
          <span className="text-[10px] text-gray-dark font-azbuka">
            * знижка застосовується лише до окремих товарів
          </span>
        </div>
      )}
    </div>
  );
}
