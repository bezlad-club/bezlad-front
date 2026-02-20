import { SanityImage } from "./sanityImage";

export interface Service {
  _id?: string;
  title: string;
  description?: string;
  second_description?: string;
  price?: string;
  menuOrder?: number;
  image?: SanityImage;
}
