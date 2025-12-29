import axios from "axios";
import { PromoCodeValidation } from "@/types/promoCode";

export const validatePromoCode = async (
  code: string,
  signal?: AbortSignal
): Promise<PromoCodeValidation> => {
  try {
    const response = await axios.post("/api/promo/validate", { code }, { signal });
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      throw error;
    }
    return {
      isValid: false,
    };
  }
};
