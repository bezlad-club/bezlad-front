import { SanityImage } from "./sanityImage";

export interface Service {
  title: string;
  description?: string;
  price?: string;
  menuOrder?: number;
  paymentUrl?: string;
  image?: SanityImage;
}
