import { SanityImage } from "./sanityImage";

export interface Service {
  _id?: string;
  title: string;
  description?: string;
  price?: string;
  menuOrder?: number;
  image?: SanityImage;
}
