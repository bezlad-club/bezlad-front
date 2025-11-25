import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/lib/sanityClient";

const builder = imageUrlBuilder(client);

export function urlForSanityImage(
  source: Parameters<typeof builder.image>[0] | undefined | null
) {
  if (!source) {
    // Створюємо fallback об'єкт, який підтримує ланцюжок методів
    const createFallback = () => ({
      url: () => "",
      width: createFallback,
      height: createFallback,
      fit: createFallback,
      crop: createFallback,
      quality: createFallback,
      format: createFallback,
    });
    return createFallback() as unknown as ReturnType<typeof builder.image>;
  }
  return builder.image(source);
}
