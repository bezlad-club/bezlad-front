import CTAContactUs from "@/components/homePage/ctaContactUs/CTAContactUs";
import CTAOrder from "@/components/homePage/ctaOrder/CTAOrder";
import Faq from "@/components/homePage/faq/Faq";
import Hero from "@/components/homePage/hero/Hero";
import PriceList from "@/components/homePage/priceList/PriceList";
import Advantages from "@/components/homePage/advantages/Advantages";
import Gallery from "@/components/homePage/gallery/Gallery";
import InteractiveZones from "@/components/homePage/interactiveZones/InteractiveZones";
import Loader from "@/components/shared/loader/Loader";
import { getPayloadClient } from "@/lib/payload";
import { Suspense } from "react";

export default async function HomePage() {
  const payload = await getPayloadClient();

  const servicesResult = await payload.find({
    collection: "service",
    sort: "menuOrder",
    depth: 1,
    limit: 500,
  });

  servicesResult.docs.sort((a, b) => {
    if (a.menuOrder !== b.menuOrder) return a.menuOrder - b.menuOrder;
    if (a.title < b.title) return -1;
    if (a.title > b.title) return 1;
    return 0;
  });

  const galleryResult = await payload.find({
    collection: "gallery",
    limit: 1,
    depth: 1,
  });

  return (
    <>
      <Hero />
      <InteractiveZones />
      <Suspense fallback={<Loader />}>
        <PriceList services={servicesResult.docs} />
      </Suspense>
      <Advantages />
      <Suspense fallback={<Loader />}>
        <Gallery gallery={galleryResult.docs[0] ?? null} />
      </Suspense>
      <CTAOrder />
      <Faq />
      <CTAContactUs />
    </>
  );
}
