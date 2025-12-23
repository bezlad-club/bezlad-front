import CTAContactUs from "@/components/homePage/ctaContactUs/CTAContactUs";
import CTAOrder from "@/components/homePage/ctaOrder/CTAOrder";
import Faq from "@/components/homePage/faq/Faq";
import Hero from "@/components/homePage/hero/Hero";
import PriceList from "@/components/homePage/priceList/PriceList";
import Advantages from "@/components/homePage/advantages/Advantages";
import Gallery from "@/components/homePage/gallery/Gallery";
import { ALL_SERVICES_QUERY, GALLERY_IMAGES_QUERY } from "@/lib/queries";
import { fetchSanityData } from "@/utils/fetchSanityData";
import InteractiveZones from "@/components/homePage/interactiveZones/InteractiveZones";
import { Suspense } from "react";
import Loader from "@/components/shared/loader/Loader";

export default async function HomePage() {
  const services = await fetchSanityData(ALL_SERVICES_QUERY);
  const gallery = await fetchSanityData(GALLERY_IMAGES_QUERY);

  return (
    <>
      <Hero />
      <InteractiveZones />
      <Suspense fallback={<Loader />}>
        <PriceList services={services} />
      </Suspense>
      <Advantages />
      <Suspense fallback={<Loader />}>
        <Gallery gallery={gallery} />
      </Suspense>
      <CTAOrder />
      <Faq />
      <CTAContactUs />
    </>
  );
}
