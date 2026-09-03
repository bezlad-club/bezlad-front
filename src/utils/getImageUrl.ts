import type { Media } from "@/payload-types";

export function getImageUrl(
  media: number | Media | null | undefined
): string {
  return media && typeof media === "object" ? (media.url ?? "") : "";
}
