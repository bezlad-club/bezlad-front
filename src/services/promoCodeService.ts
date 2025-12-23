import axios from "axios";
import { PromoCodeValidation } from "@/types/promoCode";

export const validatePromoCode = async (
  code: string
): Promise<PromoCodeValidation> => {
  try {
    const response = await axios.post("/api/promo/validate", { code });
    return response.data;
  } catch {
    return {
      isValid: false,
    };
  }
};
