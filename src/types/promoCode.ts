export interface PromoCode {
  _id: string;
  code: string;
  discountPercent: number;
  type: "reusable" | "personal";
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  validFrom?: string;
  validUntil?: string;
}

export interface PromoCodeValidation {
  isValid: boolean;
  discountPercent?: number;
  code?: string;
  _id?: string;
  applicableServices?: string[];
}

export interface AppliedPromo {
  code: string;
  discountPercent: number;
  applicableServices?: string[];
}
