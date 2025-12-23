"use client";
import { useState, useEffect } from "react";
import { AppliedPromo } from "@/types/promoCode";
import { normalizePromoCode } from "@/utils/promoCodeUtils";
import { validatePromoCode } from "@/services/promoCodeService";
import {
  PROMO_CODE_INPUT_MAX_LENGTH,
  PROMO_CODE_VALIDATION_DEBOUNCE,
  PROMO_CODE_ERRORS,
} from "@/constants/constants";
import MainButton from "../buttons/MainButton";

type ValidationState = "idle" | "validating" | "valid" | "invalid";

interface PromoCodeInputProps {
  onApply: (promo: AppliedPromo) => void;
  appliedCode?: string;
}

export default function PromoCodeInput({
  onApply,
  appliedCode,
}: PromoCodeInputProps) {
  const [code, setCode] = useState("");
  const [validationState, setValidationState] =
    useState<ValidationState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isApplying, setIsApplying] = useState(false);

  // Debounce validation
  useEffect(() => {
    if (!code || appliedCode) {
      setValidationState("idle");
      setErrorMessage("");
      return;
    }

    setValidationState("validating");
    setErrorMessage("");

    const timer = setTimeout(async () => {
      const result = await validatePromoCode(code);

      if (result.isValid && result.discountPercent) {
        setValidationState("valid");
        setDiscountPercent(result.discountPercent);
      } else {
        setValidationState("invalid");
        setErrorMessage(PROMO_CODE_ERRORS.INVALID_CODE);
      }
    }, PROMO_CODE_VALIDATION_DEBOUNCE);

    return () => clearTimeout(timer);
  }, [code, appliedCode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    if (value.length <= PROMO_CODE_INPUT_MAX_LENGTH) {
      setCode(value);
    }
  };

  const handleApply = async () => {
    if (validationState !== "valid") return;

    setIsApplying(true);
    onApply({
      code: normalizePromoCode(code),
      discountPercent: discountPercent,
    });
    setIsApplying(false);
  };

  // If code is already applied
  if (appliedCode) {
    return (
      <div className="mb-4 p-3 rounded-[12px] bg-green-50 border border-green-200">
        <div className="flex items-center gap-2">
          <span className="text-green-600 font-medium text-[14px] font-azbuka">
            ✓ Промо-код &quot;{appliedCode}&quot; застосовано
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={code}
            onChange={handleInputChange}
            placeholder="Введіть промо-код"
            maxLength={PROMO_CODE_INPUT_MAX_LENGTH}
            disabled={!!appliedCode || isApplying}
            className="w-full h-[48px] px-4 rounded-[12px] border border-gray-light 
              focus:outline-none focus:border-purple transition-colors
              text-[14px] uppercase placeholder:normal-case font-azbuka
              disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          {validationState === "validating" && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-purple border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {validationState === "valid" && !appliedCode && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 text-[20px]">
              ✓
            </div>
          )}
        </div>
        <div className="w-auto shrink-0">
          <MainButton
            onClick={handleApply}
            disabled={
              validationState !== "valid" || isApplying || !!appliedCode
            }
            isLoading={isApplying}
            className="h-[48px] px-4 text-[14px] whitespace-nowrap min-w-[120px]"
          >
            Застосувати
          </MainButton>
        </div>
      </div>

      {errorMessage && (
        <p className="mt-2 text-[12px] text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}
