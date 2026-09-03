export interface PromoCodeValidation {
  isValid: boolean;
  discountPercent?: number;
  code?: string;
  id?: number;
  applicableServices?: number[];
}

export interface AppliedPromo {
  code: string;
  discountPercent: number;
  applicableServices?: number[];
}
